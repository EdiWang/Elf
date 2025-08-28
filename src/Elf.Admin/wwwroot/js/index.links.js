import { getLinks } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.js';
import { state, updateState, getOffset } from './index.state.js';
import { updatePagination } from './index.pagination.js';
import { showDeleteModal } from './index.delete.js';
import { showLinkEditModal } from './index.linkEdit.js';
import { escapeHtml } from './index.utils.js';
import { success as showSuccessToast, error as showErrorToast } from './toastService.mjs';

export async function loadLinks() {
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

    const statusBadge = link.isEnabled
        ? '<span class="badge bg-success"><i class="bi bi-check-lg"></i></span>'
        : '<span class="badge bg-danger"><i class="bi bi-dash-circle"></i></span>';

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
                            ? `<code>${escapeHtml(link.akaName)}</code>` 
                            : '<span class="text-muted small">(none)</span>'
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
                    <div class="col-auto">${statusBadge}</div>
                    <div class="col-md-1">
                        ${link.ttl}
                    </div>
                    <div class="col-md-1">
                        <i class="bi bi-eye"></i> ${link.hits}
                    </div>
                    <div class="col-auto">
                        <span class="text-muted">${updateDate}</span>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-sm btn-outline-info me-1 qr-btn" data-fw-token="${escapeHtml(link.fwToken)}" title="Show QR Code">
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

    // Use event delegation for QR, copy, edit and delete buttons
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

function getForwarderUrl(token) {
    // Get base URL from global configuration or data attribute using HTML5 data API
    const baseUrl = window.appConfig?.forwarderBaseUrl || document.documentElement.dataset.forwarderBaseUrl || '';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/fw/${encodeURIComponent(token)}`;
}