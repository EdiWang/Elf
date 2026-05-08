import { elements } from './index.dom.mjs';
import { state, updateState, resetPage } from './index.state.mjs';
import { loadLinks } from './index.links.mjs';
import { clearTagSearchSelection } from './index.tagSearch.mjs';

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
    // Clear tag search when performing text search
    updateState({ 
        currentSearchTerm: elements.searchTerm.value.trim(),
        selectedTagIds: [],
        searchMode: 'text'
    });
    
    // Clear tag search UI
    clearTagSearchUI();
    
    resetPage();
    loadLinks();
}

export function handleClear() {
    elements.searchTerm.value = '';
    updateState({ 
        currentSearchTerm: '',
        selectedTagIds: [],
        searchMode: 'text'
    });
    
    // Clear tag search UI
    clearTagSearchUI();
    
    resetPage();
    loadLinks();
}

export function handlePageSizeChange() {
    const pageSizeValue = (elements.pageSizeSelect?.value ?? '').toString();
    const pageSize = Number.parseInt(pageSizeValue, 10);
    if (Number.isNaN(pageSize)) {
        return;
    }

    updateState({ pageSize });
    resetPage();
    loadLinks();
}

function clearTagSearchUI() {
    clearTagSearchSelection();
}