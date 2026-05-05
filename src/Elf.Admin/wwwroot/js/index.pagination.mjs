import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.mjs';
import { loadLinks } from './index.links.mjs';

export function updatePagination(totalRowsCount) {
    updateState({ totalRows: totalRowsCount });
    const totalPages = Math.ceil(state.totalRows / state.pageSize);

    // Update records info
    const startRecord = state.totalRows === 0 ? 0 : (state.currentPage * state.pageSize) + 1;
    const endRecord = Math.min((state.currentPage + 1) * state.pageSize, state.totalRows);
    elements.recordsInfo.textContent = `Showing ${startRecord}-${endRecord} of ${state.totalRows} records`;

    elements.pagination.innerHTML = '';

    if (totalPages <= 1) return;

    elements.pagination.appendChild(createPageButton('Previous', 'prev', state.currentPage === 0));

    // Page numbers
    const startPage = Math.max(0, state.currentPage - 2);
    const endPage = Math.min(totalPages - 1, state.currentPage + 2);

    if (startPage > 0) {
        elements.pagination.appendChild(createPageButton('1', '0'));

        if (startPage > 1) {
            elements.pagination.appendChild(createEllipsis());
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        elements.pagination.appendChild(createPageButton(String(i + 1), String(i), false, i === state.currentPage));
    }

    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            elements.pagination.appendChild(createEllipsis());
        }

        elements.pagination.appendChild(createPageButton(String(totalPages), String(totalPages - 1)));
    }

    elements.pagination.appendChild(createPageButton('Next', 'next', state.currentPage === totalPages - 1));

    elements.pagination.onclick = function (e) {
        const target = e.target.closest('[data-page]');
        if (!target || target.disabled) return;

        const page = target.getAttribute('data-page');
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
    };
}

function createPageButton(label, page, disabled = false, current = false) {
    const button = document.createElement('fluent-button');
    button.setAttribute('appearance', current ? 'primary' : 'secondary');
    button.setAttribute('data-page', page);
    button.textContent = label;
    button.disabled = disabled;
    if (current) button.setAttribute('aria-current', 'page');
    return button;
}

function createEllipsis() {
    const span = document.createElement('span');
    span.className = 'pagination-ellipsis';
    span.textContent = '...';
    return span;
}