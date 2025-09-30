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
        <tr>
            <td><code>${escapeHtml(request.fwToken)}</code></td>
            <td>${escapeHtml(request.note)}</td>
            <td class="text-truncate" style="max-width: 200px;" title="${escapeHtml(request.userAgent)}">${escapeHtml(request.userAgent)}</td>
            <td><code>${escapeHtml(request.ipAddress)}</code></td>
            <td class="text-truncate">${escapeHtml(location)}</td>
            <td>${escapeHtml(request.ipasn)}</td>
            <td class="text-truncate">${escapeHtml(request.ipOrg)}</td>
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

    let paginationHtml = '<nav aria-label="Recent requests pagination"><ul class="pagination pagination-sm justify-content-end mt-3">';

    // Previous button
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    paginationHtml += `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" ${prevDisabled ? 'tabindex="-1" aria-disabled="true"' : ''}>Previous</a>
        </li>
    `;

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
        if (startPage > 2) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const active = i === currentPage ? 'active' : '';
        paginationHtml += `
            <li class="page-item ${active}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }

    // Next button
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    paginationHtml += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" ${nextDisabled ? 'tabindex="-1" aria-disabled="true"' : ''}>Next</a>
        </li>
    `;

    paginationHtml += '</ul></nav>';
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
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div> Loading recent requests...</td></tr>';

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
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No recent requests found</td></tr>';
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
            const paginationLinks = tableContainer.querySelectorAll('.page-link[data-page]');
            paginationLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
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
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading recent requests. Please try again.</td></tr>';
        }
    }
}