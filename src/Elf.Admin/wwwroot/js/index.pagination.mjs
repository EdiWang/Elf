import { state, updateState } from './index.state.mjs';

const LINKS_PAGINATION_CHANGED_EVENT = 'elf.links.pagination-changed';

export function updatePagination(totalRowsCount) {
    updateState({ totalRows: totalRowsCount });
    const totalPages = Math.ceil(state.totalRows / state.pageSize);
    const startRecord = state.totalRows === 0 ? 0 : (state.currentPage * state.pageSize) + 1;
    const endRecord = Math.min((state.currentPage + 1) * state.pageSize, state.totalRows);

    document.dispatchEvent(new CustomEvent(LINKS_PAGINATION_CHANGED_EVENT, {
        detail: {
            recordsInfo: `Showing ${startRecord}-${endRecord} of ${state.totalRows} records`,
            paginationItems: createPaginationItems(totalPages)
        }
    }));
}

function createPaginationItems(totalPages) {
    if (totalPages <= 1) {
        return [];
    }

    const items = [
        createPageButton('Previous', 'prev', state.currentPage === 0)
    ];

    const startPage = Math.max(0, state.currentPage - 2);
    const endPage = Math.min(totalPages - 1, state.currentPage + 2);

    if (startPage > 0) {
        items.push(createPageButton('1', '0'));

        if (startPage > 1) {
            items.push(createEllipsis('start'));
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        items.push(createPageButton(String(i + 1), String(i), false, i === state.currentPage));
    }

    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            items.push(createEllipsis('end'));
        }

        items.push(createPageButton(String(totalPages), String(totalPages - 1)));
    }

    items.push(createPageButton('Next', 'next', state.currentPage === totalPages - 1));

    return items;
}

function createPageButton(label, page, disabled = false, current = false) {
    return {
        key: `page-${page}`,
        type: 'button',
        label,
        page,
        disabled,
        current
    };
}

function createEllipsis(position) {
    return {
        key: `ellipsis-${position}`,
        type: 'ellipsis',
        label: '...'
    };
}
