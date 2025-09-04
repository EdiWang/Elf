import { getLinks, setLinkEnabled } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState, getOffset } from './index.state.mjs';
import { updatePagination } from './index.pagination.mjs';
import { showDeleteModal } from './index.delete.mjs';
import { showLinkEditModal } from './index.linkEdit.js';
import { escapeHtml } from './index.utils.mjs';
import { success as showSuccessToast, error as showErrorToast } from './toastService.mjs';

export async function loadLinks() {
    // Check if we should use tag search instead
    if (state.searchMode === 'tags' && state.selectedTagIds && state.selectedTagIds.length > 0) {
        const { loadLinksByTags } = await import('./index.tagSearch.mjs');
        await loadLinksByTags();
        return;
    }
    
    try {
        showLoading(true);
        const response = await getLinks(state.currentSearchTerm, state.pageSize, getOffset());

        displayLinks(response.links);
        updatePagination(response.totalRows);
        showNoData(response.links.length === 0);

    } catch (error) {
        console.error('Error loading links:', error);
        showNoData(true);
    } finally {
        showLoading(false);
    }
}

export function showLoading(show) {
    elements.loadingSpinner.classList.toggle('d-none', !show);
    elements.linksData.style.opacity = show ? '0.5' : '1';
}

export function showNoData(show) {
    elements.noDataMessage.classList.toggle('d-none', !show);
    elements.paginationContainer.classList.toggle('d-none', show);
}

export function displayLinks(links) {
    elements.linksData.innerHTML = '';

    links.forEach(link => {
        const linkRow = createLinkRow(link);
        elements.linksData.appendChild(linkRow);
    });
}

function createLinkRow(link) {
    const row = document.createElement('div');
    row.className = 'bg-white py-3 px-2 rounded-3 border mb-1 link-row';
    row.setAttribute('data-link-id', link.id);

    const statusToggle = `
        <div class="form-check form-switch">
            <input class="form-check-input status-toggle" type="checkbox" role="switch" 
                   id="status-${link.id}" ${link.isEnabled ? 'checked' : ''} 
                   data-link-id="${link.id}" title="${link.isEnabled ? 'Enabled' : 'Disabled'}">
            <label class="form-check-label visually-hidden" for="status-${link.id}">
                Toggle link status
            </label>
        </div>
    `;

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    // Create tags badges
    const tagsBadges = link.tags && link.tags.length > 0
        ? link.tags.map(tag => `<span class="badge bg-primary me-1">${escapeHtml(tag.name)}</span>`).join('')
        : '<span class="text-muted small">(no tags)</span>';

    row.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-auto">
                        <a href="${getForwarderUrl(link.fwToken)}" target="_blank" class="code-link-token ms-2">
                            <code>
                                ${escapeHtml(link.fwToken)}
                            </code>
                        </a>
                    </div>
                    <div class="col-md-1">
                        ${link.akaName 
                            ? `<a href="${getAkaForwarderUrl(link.akaName)}" target="_blank">
                                    <code>${escapeHtml(link.akaName)}</code>
                               </a>` 
                            : `<span class="text-muted small">(none)</span>`
                        }
                    </div>
                    <div class="col col-overflow-ellipsis">
                        <a href="${escapeHtml(link.originUrl)}" target="_blank" title="${escapeHtml(link.originUrl)}">
                            ${escapeHtml(link.originUrl)}
                        </a>
                    </div>
                    <div class="col col-overflow-ellipsis">
                        <span title="${escapeHtml(link.note || 'No note')}">${escapeHtml(link.note || 'No note')}</span>
                    </div>
                    <div class="col-md-1">
                        ${tagsBadges}
                    </div>
                    <div class="col-auto">${statusToggle}</div>
                    <div class="col-auto">
                        <span class="ttl-container">
                            <i class="bi bi-clock"></i> ${link.ttl}
                        </span>
                    </div>
                    <div class="col-auto">
                        <div class="link-hits-container">
                            <i class="bi bi-eye"></i> ${link.hits}
                        </div>
                    </div>
                    <div class="col-auto">
                        <span class="text-muted">${updateDate}</span>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-sm btn-outline-secondary me-1 qr-btn" data-fw-token="${escapeHtml(link.fwToken)}" title="Show QR Code">
                            <i class="bi bi-qr-code"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary me-1 copy-btn" data-fw-token="${escapeHtml(link.fwToken)}" title="Copy link URL">
                            <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-link-id="${link.id}" title="Edit link">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-link-id="${link.id}" data-token="${escapeHtml(link.fwToken)}" data-url="${escapeHtml(link.originUrl)}" title="Delete link">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;

    // Use event delegation for QR, copy, edit, delete buttons and status toggle
    row.addEventListener('click', function (e) {
        if (e.target.closest('.qr-btn')) {
            const qrBtn = e.target.closest('.qr-btn');
            const fwToken = qrBtn.getAttribute('data-fw-token');
            showQRCodeModal(fwToken);
        } else if (e.target.closest('.copy-btn')) {
            const copyBtn = e.target.closest('.copy-btn');
            const fwToken = copyBtn.getAttribute('data-fw-token');
            copyLinkToClipboard(fwToken);
        } else if (e.target.closest('.edit-btn')) {
            const editBtn = e.target.closest('.edit-btn');
            const linkId = parseInt(editBtn.getAttribute('data-link-id'));
            showLinkEditModal(linkId);
        } else if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            const linkId = deleteBtn.getAttribute('data-link-id');
            const token = deleteBtn.getAttribute('data-token');
            const url = deleteBtn.getAttribute('data-url');
            showDeleteModal(linkId, token, url);
        }
    });

    // Add event listener for status toggle
    row.addEventListener('change', async function (e) {
        if (e.target.classList.contains('status-toggle')) {
            const toggle = e.target;
            const linkId = parseInt(toggle.getAttribute('data-link-id'));
            const isEnabled = toggle.checked;
            
            // Disable the toggle while processing
            toggle.disabled = true;
            
            try {
                await setLinkEnabled(linkId, isEnabled);
                // Update the title attribute to reflect the new state
                toggle.title = isEnabled ? 'Enabled' : 'Disabled';
            } catch (error) {
                console.error('Failed to update link status:', error);
                // Revert the toggle state on failure
                toggle.checked = !isEnabled;
                showErrorToast('Failed to update link status');
            } finally {
                // Re-enable the toggle
                toggle.disabled = false;
            }
        }
    });

    return row;
}

export function showQRCodeModal(fwToken) {
    const url = getForwarderUrl(fwToken);
    const modal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
    
    // Update the URL text
    document.getElementById('qrCodeUrl').textContent = url;
    
    // Generate QR code
    const canvas = document.getElementById('qrCodeCanvas');
    const qr = new QRious({
        element: canvas,
        value: url,
        size: 256,
        foreground: '#000000',
        background: '#ffffff'
    });
    
    modal.show();
}

async function copyLinkToClipboard(fwToken) {
    try {
        const url = getForwarderUrl(fwToken);
        await navigator.clipboard.writeText(url);
        showSuccessToast('Link copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = getForwarderUrl(fwToken);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessToast('Link copied to clipboard!');
        } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            showErrorToast('Failed to copy link to clipboard');
        }
    }
}

function getBaseUrl() {
    const baseUrl = window.appConfig?.forwarderBaseUrl || document.documentElement.dataset.forwarderBaseUrl || '';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function getForwarderUrl(token) {
    return `${getBaseUrl()}/fw/${encodeURIComponent(token)}`;
}

function getAkaForwarderUrl(aka) {
    return `${getBaseUrl()}/aka/${encodeURIComponent(aka)}`;
}