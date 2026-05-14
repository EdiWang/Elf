import { getLinksByTags } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, getOffset } from './index.state.mjs';
import { displayLinks, showLoading, showNoData } from './index.links.mjs';
import { updatePagination } from './index.pagination.mjs';

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
}

export function hasActiveTagSearch() {
    return state.searchMode === 'tags' && state.selectedTagIds && state.selectedTagIds.length > 0;
}
