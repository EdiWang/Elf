import { getLinksByTags } from '/js/links.apiclient.mjs';
import { getTags } from '/js/tags.apiclient.mjs';
import { elements } from './index.dom.js';
import { state, updateState, resetPage, getOffset } from './index.state.js';
import { displayLinks, showLoading, showNoData } from './index.links.js';
import { updatePagination } from './index.pagination.js';

let tagSearchTagify = null;

export function setupTagSearchEventListeners() {
    elements.tagSearchBtn.addEventListener('click', handleTagSearch);
    elements.clearTagFilterBtn.addEventListener('click', clearTagSearch);
    
    // Initialize Tagify for tag search
    initializeTagSearchTagify();
}

async function initializeTagSearchTagify() {
    try {
        // Fetch existing tags from API
        const tagsResponse = await getTags();
        const existingTags = tagsResponse.map(tag => ({ value: tag.name, id: tag.id }));
        
        // Initialize Tagify
        tagSearchTagify = new Tagify(elements.tagFilter, {
            whitelist: existingTags,
            maxTags: 20, // Allow multiple tags for filtering
            dropdown: {
                maxItems: 20,
                classname: 'tags-dropdown',
                enabled: 0, // Show dropdown immediately when typing
                closeOnSelect: false
            },
            editTags: false, // Don't allow editing for search
            placeholder: 'Select tags to filter...',
            transformTag: transformTag
        });
        
    } catch (error) {
        console.error('Error initializing tag search Tagify:', error);
        // Fallback to basic text input behavior
    }
}

function transformTag(tagData) {
    // Ensure tag names are properly formatted
    tagData.value = tagData.value.toLowerCase().trim();
}

export async function handleTagSearch() {
    if (!tagSearchTagify) return;
    
    const selectedTags = tagSearchTagify.value;
    
    if (selectedTags.length === 0) {
        alert('Please select at least one tag to search.');
        return;
    }
    
    const tagIds = selectedTags.map(tag => {
        // Find the tag ID from the whitelist
        const whitelistTag = tagSearchTagify.whitelist.find(wt => 
            wt.value.toLowerCase() === tag.value.toLowerCase()
        );
        return whitelistTag ? whitelistTag.id : null;
    }).filter(id => id !== null);
    
    if (tagIds.length === 0) {
        alert('No valid tags selected.');
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

function clearTagSearch() {
    if (tagSearchTagify) {
        tagSearchTagify.removeAllTags();
    }
    
    updateState({ 
        selectedTagIds: [],
        searchMode: 'text'
    });
    
    resetPage();
    
    // Load all links using regular search
    import('./index.links.js').then(({ loadLinks }) => {
        loadLinks();
    });
}

export function hasActiveTagSearch() {
    return state.searchMode === 'tags' && state.selectedTagIds && state.selectedTagIds.length > 0;
}