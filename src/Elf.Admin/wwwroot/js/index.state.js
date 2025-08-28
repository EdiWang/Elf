// State management
export let state = {
    currentPage: 0,
    pageSize: 10,
    currentSearchTerm: '',
    totalRows: 0,
    linkToDelete: null,
    editingLinkId: null
};

export function updateState(updates) {
    Object.assign(state, updates);
}

export function resetPage() {
    state.currentPage = 0;
}

export function getOffset() {
    return state.currentPage * state.pageSize;
}