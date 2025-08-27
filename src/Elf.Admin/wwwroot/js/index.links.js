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
    row.className = 'row align-items-center bg-white py-3 px-2 rounded-3 border mb-1 link-row';
    row.setAttribute('data-link-id', link.id);

    const statusBadge = link.isEnabled
        ? '<span class="badge bg-success">Active</span>'
        : '<span class="badge bg-secondary">Disabled</span>';

    const shortUrl = link.originUrl.length > 50 ?
        link.originUrl.substring(0, 50) + '...' : link.originUrl;

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString();

    row.innerHTML = `
                <div class="d-none d-md-flex w-100 align-items-center">
                    <div class="col-auto">
                        <code class="text-primary">
                            ${escapeHtml(link.fwToken)}
                        </code>
                    </div>
                    <div class="col-md-4">
                        <a href="${escapeHtml(link.originUrl)}" target="_blank" title="${escapeHtml(link.originUrl)}">
                            ${escapeHtml(shortUrl)}
                        </a>
                    </div>
                    <div class="col-md-3">
                        <span title="${escapeHtml(link.note || 'No note')}">${escapeHtml(link.note || 'No note')}</span>
                    </div>
                    <div class="col-md-1">${statusBadge}</div>
                    <div class="col-md-1">${link.hits}</div>
                    <div class="col-md-1">${updateDate}</div>
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