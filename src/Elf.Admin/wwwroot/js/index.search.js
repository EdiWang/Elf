import { elements } from './index.dom.js';
import { state, updateState, resetPage } from './index.state.js';
import { loadLinks } from './index.links.js';

export function setupSearchEventListeners() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.pageSizeSelect.addEventListener('change', handlePageSizeChange);

    // Enter key for search
    elements.searchTerm.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

export function handleSearch() {
    updateState({ currentSearchTerm: elements.searchTerm.value.trim() });
    resetPage();
    loadLinks();
}

export function handleClear() {
    elements.searchTerm.value = '';
    updateState({ currentSearchTerm: '' });
    resetPage();
    loadLinks();
}

export function handlePageSizeChange() {
    updateState({ pageSize: parseInt(elements.pageSizeSelect.value) });
    resetPage();
    loadLinks();
}