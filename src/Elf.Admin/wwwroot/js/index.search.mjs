import { elements } from './index.dom.mjs';
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
    updateState({ pageSize: parseInt(elements.pageSizeSelect.value) });
    resetPage();
    loadLinks();
}

function clearTagSearchUI() {
    // Import and clear tag search if available
    import('./index.tagSearch.js').then(() => {
        const tagFilterElement = elements.tagFilter;
        if (tagFilterElement && tagFilterElement.tagify) {
            tagFilterElement.tagify.removeAllTags();
        }
    }).catch(() => {
        // Tag search module might not be loaded yet
    });
}