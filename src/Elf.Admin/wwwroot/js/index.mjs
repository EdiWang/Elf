import { getLinks, deleteLink } from '/js/links.apiclient.mjs';

// State management
let currentPage = 0;
let pageSize = 10;
let currentSearchTerm = '';
let totalRows = 0;
let linkToDelete = null;

// DOM elements
const linksData = document.getElementById('linksData');
const loadingSpinner = document.getElementById('loadingSpinner');
const noDataMessage = document.getElementById('noDataMessage');
const paginationContainer = document.getElementById('paginationContainer');
const pagination = document.getElementById('pagination');
const recordsInfo = document.getElementById('recordsInfo');
const searchTerm = document.getElementById('searchTerm');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const pageSizeSelect = document.getElementById('pageSize');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const deleteTokenPreview = document.getElementById('deleteTokenPreview');
const deleteUrlPreview = document.getElementById('deleteUrlPreview');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadLinks();
    setupEventListeners();
});

function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', handleClear);
    pageSizeSelect.addEventListener('change', handlePageSizeChange);
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

    // Enter key for search
    searchTerm.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

function handleSearch() {
    currentSearchTerm = searchTerm.value.trim();
    currentPage = 0;
    loadLinks();
}

function handleClear() {
    searchTerm.value = '';
    currentSearchTerm = '';
    currentPage = 0;
    loadLinks();
}

function handlePageSizeChange() {
    pageSize = parseInt(pageSizeSelect.value);
    currentPage = 0;
    loadLinks();
}

async function loadLinks() {
    try {
        showLoading(true);
        const offset = currentPage * pageSize;
        const response = await getLinks(currentSearchTerm, pageSize, offset);

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

function showLoading(show) {
    loadingSpinner.classList.toggle('d-none', !show);
    linksData.style.opacity = show ? '0.5' : '1';
}

function showNoData(show) {
    noDataMessage.classList.toggle('d-none', !show);
    paginationContainer.classList.toggle('d-none', show);
}

function displayLinks(links) {
    linksData.innerHTML = '';

    links.forEach(link => {
        const linkRow = createLinkRow(link);
        linksData.appendChild(linkRow);
    });
}

function createLinkRow(link) {
    const row = document.createElement('div');
    row.className = 'row py-2 border-bottom align-items-center link-row';
    row.setAttribute('data-link-id', link.id);

    const statusBadge = link.isEnabled
        ? '<span class="badge bg-success">Active</span>'
        : '<span class="badge bg-secondary">Disabled</span>';

    const shortUrl = link.originUrl.length > 50 ?
        link.originUrl.substring(0, 50) + '...' : link.originUrl;

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString();

    row.innerHTML = `
                <!-- Mobile Layout -->
                <div class="d-block d-md-none">
                    <div class="card mb-2">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0">${escapeHtml(link.fwToken)}</h6>
                                <div class="d-flex gap-2">
                                    ${statusBadge}
                                    <button class="btn btn-sm btn-outline-danger delete-btn" data-link-id="${link.id}" data-token="${escapeHtml(link.fwToken)}" data-url="${escapeHtml(link.originUrl)}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                            <p class="card-text small mb-1"><strong>URL:</strong> ${escapeHtml(shortUrl)}</p>
                            <p class="card-text small mb-1"><strong>Note:</strong> ${escapeHtml(link.note || 'No note')}</p>
                            <div class="d-flex justify-content-between small text-muted">
                                <span><strong>Hits:</strong> ${link.hits}</span>
                                <span><strong>Updated:</strong> ${updateDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Desktop Layout -->
                <div class="d-none d-md-flex w-100 align-items-center">
                    <div class="col-md-1">${link.id}</div>
                    <div class="col-md-2">
                        <code class="text-primary">${escapeHtml(link.fwToken)}</code>
                    </div>
                    <div class="col-md-3">
                        <a href="${escapeHtml(link.originUrl)}" target="_blank" class="text-decoration-none" title="${escapeHtml(link.originUrl)}">
                            ${escapeHtml(shortUrl)}
                        </a>
                    </div>
                    <div class="col-md-2">
                        <span title="${escapeHtml(link.note || 'No note')}">${escapeHtml(link.note || 'No note')}</span>
                    </div>
                    <div class="col-md-1">${statusBadge}</div>
                    <div class="col-md-1">${link.hits}</div>
                    <div class="col-md-1">${updateDate}</div>
                    <div class="col-md-1">
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-link-id="${link.id}" data-token="${escapeHtml(link.fwToken)}" data-url="${escapeHtml(link.originUrl)}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;

    // Add event listener for delete button
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        const linkId = this.getAttribute('data-link-id');
        const token = this.getAttribute('data-token');
        const url = this.getAttribute('data-url');
        showDeleteModal(linkId, token, url);
    });

    return row;
}

function showDeleteModal(linkId, token, url) {
    linkToDelete = linkId;
    deleteTokenPreview.textContent = token;
    deleteUrlPreview.textContent = url;
    deleteModal.show();
}

async function handleConfirmDelete() {
    if (!linkToDelete) return;

    try {
        await deleteLink(parseInt(linkToDelete));
        deleteModal.hide();

        // Reload current page
        await loadLinks();

        linkToDelete = null;
    } catch (error) {
        console.error('Error deleting link:', error);
    }
}

function updatePagination(totalRowsCount) {
    totalRows = totalRowsCount;
    const totalPages = Math.ceil(totalRows / pageSize);

    // Update records info
    const startRecord = totalRows === 0 ? 0 : (currentPage * pageSize) + 1;
    const endRecord = Math.min((currentPage + 1) * pageSize, totalRows);
    recordsInfo.textContent = `Showing ${startRecord}-${endRecord} of ${totalRows} records`;

    // Generate pagination
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#" data-page="prev">Previous</a>';
    pagination.appendChild(prevLi);

    // Page numbers
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 0) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = '<a class="page-link" href="#" data-page="0">1</a>';
        pagination.appendChild(firstLi);

        if (startPage > 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(ellipsisLi);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i + 1}</a>`;
        pagination.appendChild(li);
    }

    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = '<span class="page-link">...</span>';
            pagination.appendChild(ellipsisLi);
        }

        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#" data-page="${totalPages - 1}">${totalPages}</a>`;
        pagination.appendChild(lastLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#" data-page="next">Next</a>';
    pagination.appendChild(nextLi);

    // Add click events to pagination links
    pagination.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('page-link')) {
            const page = e.target.getAttribute('data-page');
            if (page === 'prev' && currentPage > 0) {
                currentPage--;
                loadLinks();
            } else if (page === 'next' && currentPage < totalPages - 1) {
                currentPage++;
                loadLinks();
            } else if (page !== 'prev' && page !== 'next') {
                currentPage = parseInt(page);
                loadLinks();
            }
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}