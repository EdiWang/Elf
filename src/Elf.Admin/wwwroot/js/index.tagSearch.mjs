import { getLinksByTags } from '/js/links.apiclient.mjs';
import { getTags } from '/js/tags.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState, resetPage, getOffset } from './index.state.mjs';
import { displayLinks, showLoading, showNoData } from './index.links.mjs';
import { updatePagination } from './index.pagination.mjs';
import { warning } from './toastService.mjs';

const TAG_FILTER_PLACEHOLDER = 'Select tags to filter...';

export function setupTagSearchEventListeners() {
    elements.tagSearchBtn.addEventListener('click', handleTagSearch);
    elements.clearTagFilterBtn.addEventListener('click', clearTagSearch);
    elements.tagFilter.addEventListener('change', handleTagFilterChange);

    initializeTagSearchDropdown();
}

async function initializeTagSearchDropdown() {
    try {
        const tagsResponse = await getTags();
        renderTagOptions(tagsResponse);
        updateTagFilterControlText();
    } catch (error) {
        console.error('Error initializing tag search dropdown:', error);
    }
}

function renderTagOptions(tags) {
    const listbox = elements.tagFilterListbox;
    if (!listbox) {
        return;
    }

    listbox.replaceChildren();

    const fragment = document.createDocumentFragment();
    const orderedTags = [...tags].sort((left, right) => left.name.localeCompare(right.name));

    for (const tag of orderedTags) {
        const option = document.createElement('fluent-option');
        option.setAttribute('value', tag.id.toString());
        option.textContent = tag.name;
        fragment.appendChild(option);
    }

    listbox.appendChild(fragment);
}

function handleTagFilterChange() {
    updateTagFilterControlText();
}

function getSelectedTagOptions() {
    if (!elements.tagFilter?.selectedOptions) {
        return [];
    }

    return Array.from(elements.tagFilter.selectedOptions);
}

function updateTagFilterControlText() {
    const control = elements.tagFilterControl;
    if (!control) {
        return;
    }

    const selectedNames = getSelectedTagOptions()
        .map(option => option.textContent?.trim())
        .filter(Boolean);

    if (selectedNames.length === 0) {
        control.textContent = TAG_FILTER_PLACEHOLDER;
        control.title = '';
        control.classList.add('is-placeholder');
        return;
    }

    const label = selectedNames.join(', ');
    control.textContent = label;
    control.title = label;
    control.classList.remove('is-placeholder');
}

export async function handleTagSearch() {
    const tagIds = getSelectedTagOptions()
        .map(option => Number.parseInt(option.value || option.getAttribute('value') || '', 10))
        .filter(tagId => !Number.isNaN(tagId));

    if (tagIds.length === 0) {
        warning('Please select at least one tag to search.');
        return;
    }

    updateState({ 
        selectedTagIds: tagIds,
        searchMode: 'tags',
        currentSearchTerm: '' // Clear text search when doing tag search
    });
    
    // Clear text search input
    elements.searchTerm.value = '';
    
    resetPage();
    await loadLinksByTags();
}

export async function loadLinksByTags() {
    if (!state.selectedTagIds || state.selectedTagIds.length === 0) {
        return;
    }
    
    try {
        showLoading(true);
        
        const request = {
            tagIds: state.selectedTagIds,
            take: state.pageSize,
            offset: getOffset()
        };
        
        const response = await getLinksByTags(request);
        
        displayLinks(response.links);
        updatePagination(response.totalRows);
        showNoData(response.links.length === 0);
        
    } catch (error) {
        console.error('Error loading links by tags:', error);
        showNoData(true);
    } finally {
        showLoading(false);
    }
}

export function clearTagSearchSelection() {
    const options = elements.tagFilter?.querySelectorAll('fluent-option') ?? [];

    for (const option of options) {
        option.selected = false;
        if ('currentSelected' in option) {
            option.currentSelected = false;
        }
        option.removeAttribute('selected');
    }

    if (elements.tagFilter) {
        elements.tagFilter.value = '';
    }

    updateTagFilterControlText();
}

function clearTagSearch() {
    clearTagSearchSelection();
    
    updateState({ 
        selectedTagIds: [],
        searchMode: 'text'
    });
    
    resetPage();
    
    // Load all links using regular search
    import('./index.links.mjs').then(({ loadLinks }) => {
        loadLinks();
    });
}

export function hasActiveTagSearch() {
    return state.searchMode === 'tags' && state.selectedTagIds && state.selectedTagIds.length > 0;
}