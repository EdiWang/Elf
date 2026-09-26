import { getRequests } from './report.apiclient.mjs';

let currentPage = 1;
const pageSize = 15;
let totalRows = 0;

/**
 * Format location data by combining country, region, and city
 * @param {string} country - IP Country
 * @param {string} region - IP Region  
 * @param {string} city - IP City
 * @returns {string} Formatted location string
 */
function formatLocation(country, region, city) {
    const parts = [city, region, country].filter(part => part && part.trim() !== '');
    return parts.length > 0 ? parts.join(', ') : 'Unknown';
}

/**
 * Convert UTC datetime to local datetime string
 * @param {string} utcDateString - UTC datetime string
 * @returns {string} Formatted local datetime
 */
function formatLocalDateTime(utcDateString) {
    if (!utcDateString) return '';

    const utcDate = new Date(utcDateString);
    return utcDate.toLocaleString();
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} HTML escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Create table row HTML for a request track item
 * @param {Object} request - RequestTrack object
 * @returns {string} HTML string for table row
 */
function createTableRow(request) {
    const location = formatLocation(request.ipCountry, request.ipRegion, request.ipCity);
    const localDateTime = formatLocalDateTime(request.requestTimeUtc);

    return `
        <tr class="fluent-table-row">
            <td><code>${escapeHtml(request.fwToken)}</code></td>
            <td>${escapeHtml(request.note)}</td>
            <td><span class="fluent-table-text-cell" title="${escapeHtml(request.userAgent)}">${escapeHtml(request.userAgent)}</span></td>
            <td><code>${escapeHtml(request.ipAddress)}</code></td>
            <td><span class="fluent-table-text-cell">${escapeHtml(location)}</span></td>
            <td>${escapeHtml(request.ipasn)}</td>
            <td><span class="fluent-table-text-cell">${escapeHtml(request.ipOrg)}</span></td>
            <td>${escapeHtml(localDateTime)}</td>
        </tr>
    `;
}

/**
 * Create pagination HTML
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @returns {string} HTML string for pagination
 */
function createPaginationHtml(currentPage, totalPages) {
    if (totalPages <= 1) return '';

    let paginationHtml = '<nav class="pagination-actions table-pagination" aria-label="Recent requests pagination">';

    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    paginationHtml += `
        <fluent-button appearance="secondary" data-page="${currentPage - 1}" ${prevDisabled}>Previous</fluent-button>
    `;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHtml += `<fluent-button appearance="secondary" data-page="1">1</fluent-button>`;
        if (startPage > 2) {
            paginationHtml += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <fluent-button appearance="${i === currentPage ? 'primary' : 'secondary'}" data-page="${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</fluent-button>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHtml += `<fluent-button appearance="secondary" data-page="${totalPages}">${totalPages}</fluent-button>`;
    }

    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    paginationHtml += `
        <fluent-button appearance="secondary" data-page="${currentPage + 1}" ${nextDisabled}>Next</fluent-button>
    `;

    paginationHtml += '</nav>';
    return paginationHtml;
}

/**
 * Load and display recent requests table with pagination
 * @param {number} page - Page number to load (default: 1)
 */
export async function loadRecentRequestsTable(page = 1) {
    try {
        const tableBody = document.querySelector('#recentRequestsTable tbody');
        const tableContainer = document.querySelector('.recent-requests-container');

        if (!tableBody || !tableContainer) {
            console.error('Recent requests table elements not found');
            return;
        }

        // Show loading state
        tableBody.innerHTML = '<tr class="fluent-table-state-row"><td colspan="8" class="table-message"><fluent-progress-ring class="inline-progress"></fluent-progress-ring> Loading recent requests...</td></tr>';

        // Remove existing pagination
        const existingPagination = tableContainer.querySelector('nav[aria-label="Recent requests pagination"]');
        if (existingPagination) {
            existingPagination.remove();
        }

        // Calculate offset
        const offset = (page - 1) * pageSize;

        // Fetch data
        const response = await getRequests(pageSize, offset, window.reportPageData?.linkId);

        if (!response || !response.requestTracks) {
            throw new Error('Invalid response format');
        }

        const { requestTracks: requests, totalRows: total } = response;
        totalRows = total;
        currentPage = page;

        // Clear table body
        tableBody.innerHTML = '';

        if (requests.length === 0) {
            tableBody.innerHTML = '<tr class="fluent-table-state-row"><td colspan="8" class="table-message muted-text">No recent requests found</td></tr>';
            return;
        }

        // Populate table rows
        requests.forEach(request => {
            tableBody.innerHTML += createTableRow(request);
        });

        // Add pagination
        const totalPages = Math.ceil(totalRows / pageSize);
        const paginationHtml = createPaginationHtml(currentPage, totalPages);

        if (paginationHtml) {
            tableContainer.insertAdjacentHTML('beforeend', paginationHtml);

            // Add click handlers for pagination
            const paginationLinks = tableContainer.querySelectorAll('[data-page]');
            paginationLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    if (this.disabled) return;
                    const targetPage = parseInt(this.getAttribute('data-page'));
                    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
                        loadRecentRequestsTable(targetPage);
                    }
                });
            });
        }

    } catch (error) {
        console.error('Error loading recent requests:', error);
        const tableBody = document.querySelector('#recentRequestsTable tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr class="fluent-table-state-row"><td colspan="8" class="table-message danger-text">Error loading recent requests. Please try again.</td></tr>';
        }
    }
}
