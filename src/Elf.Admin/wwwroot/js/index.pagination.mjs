import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.mjs';
import { loadLinks } from './index.links.js';

export function updatePagination(totalRowsCount) {
    updateState({ totalRows: totalRowsCount });
    const totalPages = Math.ceil(state.totalRows / state.pageSize);

    // Update records info
    const startRecord = state.totalRows === 0 ? 0 : (state.currentPage * state.pageSize) + 1;
    const endRecord = Math.min((state.currentPage + 1) * state.pageSize, state.totalRows);
    elements.recordsInfo.textContent = `Showing ${startRecord}-${endRecord} of ${state.totalRows} records`;

    // Generate pagination
    elements.pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${state.currentPage === 0 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#" data-page="prev">Previous</a>';
    elements.pagination.appendChild(prevLi);

    // Page numbers
    const startPage = Math.max(0, state.currentPage - 2);
    const endPage = Math.min(totalPages - 1, state.currentPage + 2);

    if (startPage > 0) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = '<a class="page-link" href="#" data-page="0">1</a>';
        elements.pagination.appendChild(firstLi);

        if (startPage > 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = '<span class="page-link">...</span>';
            elements.pagination.appendChild(ellipsisLi);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === state.currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i + 1}</a>`;
        elements.pagination.appendChild(li);
    }

    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = '<span class="page-link">...</span>';
            elements.pagination.appendChild(ellipsisLi);
        }

        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#" data-page="${totalPages - 1}">${totalPages}</a>`;
        elements.pagination.appendChild(lastLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${state.currentPage === totalPages - 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#" data-page="next">Next</a>';
    elements.pagination.appendChild(nextLi);

    // Add click events to pagination links
    elements.pagination.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('page-link')) {
            const page = e.target.getAttribute('data-page');
            if (page === 'prev' && state.currentPage > 0) {
                updateState({ currentPage: state.currentPage - 1 });
                loadLinks();
            } else if (page === 'next' && state.currentPage < totalPages - 1) {
                updateState({ currentPage: state.currentPage + 1 });
                loadLinks();
            } else if (page !== 'prev' && page !== 'next') {
                updateState({ currentPage: parseInt(page) });
                loadLinks();
            }
        }
    });
}