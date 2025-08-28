import { getLinks } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.js';
import { state, updateState, getOffset } from './index.state.js';
import { updatePagination } from './index.pagination.js';
import { showDeleteModal } from './index.delete.js';
import { escapeHtml } from './index.utils.js';

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
        ? '<span class="badge bg-success">Active</span>'
        : '<span class="badge bg-secondary">Disabled</span>';

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

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
                            : '<span class="text-muted small">(N/A)</span>'
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
                    <div class="col-md-1">${statusBadge}</div>
                    <div class="col-md-1">
                        <i class="bi bi-eye"></i> ${link.hits}
                    </div>
                    <div class="col-auto">
                        <span class="text-muted">${updateDate}</span>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-link-id="${link.id}" data-token="${escapeHtml(link.fwToken)}" data-url="${escapeHtml(link.originUrl)}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;

    // Use event delegation instead of direct event listener
    row.addEventListener('click', function (e) {
        if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            const linkId = deleteBtn.getAttribute('data-link-id');
            const token = deleteBtn.getAttribute('data-token');
            const url = deleteBtn.getAttribute('data-url');
            showDeleteModal(linkId, token, url);
        }
    });

    return row;
}

function getForwarderUrl(token) {
    // Get base URL from global configuration or data attribute using HTML5 data API
    const baseUrl = window.appConfig?.forwarderBaseUrl || document.documentElement.dataset.forwarderBaseUrl || '';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}/fw/${encodeURIComponent(token)}`;
}