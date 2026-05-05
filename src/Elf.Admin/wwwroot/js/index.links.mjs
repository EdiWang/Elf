import { getLinks, setLinkEnabled } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState, getOffset } from './index.state.mjs';
import { updatePagination } from './index.pagination.mjs';
import { showDeleteModal } from './index.delete.mjs';
import { showLinkEditModal } from './index.linkEdit.mjs';
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
    const row = document.createElement('fluent-card');
    row.className = 'link-row';
    row.setAttribute('data-link-id', link.id);

    const statusToggle = `
        <fluent-switch class="status-toggle" id="status-${link.id}" ${link.isEnabled ? 'checked' : ''} data-link-id="${link.id}" title="${link.isEnabled ? 'Enabled' : 'Disabled'}" aria-label="Toggle link status"></fluent-switch>
    `;

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    // Create tags badges
    const tagsBadges = link.tags && link.tags.length > 0
        ? link.tags.map(tag => `<fluent-badge appearance="filled">${escapeHtml(tag.name)}</fluent-badge>`).join('')
        : '<span class="muted-text">(no tags)</span>';

    row.innerHTML = `
                <div class="link-row-grid">
                    <div class="token-cell">
                        <a href="${getForwarderUrl(link.fwToken)}" target="_blank" class="code-link-token">
                            <code>
                                ${escapeHtml(link.fwToken)}
                            </code>
                        </a>
                    </div>
                    <div class="aka-cell">
                        ${link.akaName 
                            ? `<a href="${getAkaForwarderUrl(link.akaName)}" target="_blank">
                                    <code>${escapeHtml(link.akaName)}</code>
                               </a>` 
                            : `<span class="muted-text">(none)</span>`
                        }
                    </div>
                    <div class="overflow-cell">
                        <a href="${escapeHtml(link.originUrl)}" target="_blank" title="${escapeHtml(link.originUrl)}">
                            ${escapeHtml(link.originUrl)}
                        </a>
                    </div>
                    <div class="overflow-cell">
                        <span title="${escapeHtml(link.note || 'No note')}">${escapeHtml(link.note || 'No note')}</span>
                    </div>
                    <div class="tag-list">
                        ${tagsBadges}
                    </div>
                    <div class="status-cell">${statusToggle}</div>
                    <div class="metric-cell">
                        <span class="ttl-container">
                            <i class="bi bi-hourglass-split" aria-hidden="true"></i> ${link.ttl}
                        </span>
                    </div>
                    <div class="metric-cell">
                        <div class="link-hits-container">
                            <i class="bi bi-activity" aria-hidden="true"></i> ${link.hits}
                        </div>
                    </div>
                    <div class="date-cell">
                        <span class="muted-text">${updateDate}</span>
                    </div>
                    <div class="row-actions">
                        <fluent-button appearance="subtle" class="report-btn" data-link-id="${link.id}" title="View Report"><i class="bi bi-graph-up-arrow" aria-hidden="true"></i></fluent-button>
                        <fluent-button appearance="subtle" class="qr-btn" data-fw-token="${escapeHtml(link.fwToken)}" title="Show QR Code"><i class="bi bi-qr-code" aria-hidden="true"></i></fluent-button>
                        <fluent-button appearance="subtle" class="copy-btn" data-fw-token="${escapeHtml(link.fwToken)}" title="Copy link URL"><i class="bi bi-clipboard" aria-hidden="true"></i></fluent-button>
                        <fluent-button appearance="subtle" class="edit-btn" data-link-id="${link.id}" title="Edit link"><i class="bi bi-pencil-square" aria-hidden="true"></i></fluent-button>
                        <fluent-button appearance="subtle" class="delete-btn danger-action" data-link-id="${link.id}" data-token="${escapeHtml(link.fwToken)}" data-url="${escapeHtml(link.originUrl)}" title="Delete link"><i class="bi bi-trash" aria-hidden="true"></i></fluent-button>
                    </div>
                </div>
            `;

    // Use event delegation for QR, copy, edit, delete buttons and status toggle
    row.addEventListener('click', function (e) {
        if (e.target.closest('.report-btn')) {
            const reportBtn = e.target.closest('.report-btn');
            const linkId = reportBtn.getAttribute('data-link-id');
            window.open(`/Report?linkId=${linkId}`, '_blank');
        } else if (e.target.closest('.qr-btn')) {
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
    const modal = document.getElementById('qrCodeModal');
    
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
    
    if (!modal.open) modal.showModal();
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