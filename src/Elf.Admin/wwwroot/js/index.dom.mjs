// DOM element references
export const elements = {
    linksData: document.getElementById('linksData'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    noDataMessage: document.getElementById('noDataMessage'),
    paginationContainer: document.getElementById('paginationContainer'),
    pagination: document.getElementById('pagination'),
    recordsInfo: document.getElementById('recordsInfo'),
    searchTerm: document.getElementById('searchTerm'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    addLinkBtn: document.getElementById('addLinkBtn'),
    pageSizeSelect: document.getElementById('pageSize'),
    deleteModal: new bootstrap.Modal(document.getElementById('deleteModal')),
    deleteTokenPreview: document.getElementById('deleteTokenPreview'),
    deleteUrlPreview: document.getElementById('deleteUrlPreview'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),

    // Tag search elements
    tagFilter: document.getElementById('tagFilter'),
    tagSearchBtn: document.getElementById('tagSearchBtn'),
    clearTagFilterBtn: document.getElementById('clearTagFilterBtn'),

    // Link Edit Modal elements
    linkEditModal: new bootstrap.Modal(document.getElementById('linkEditModal')),
    linkEditModalLabel: document.getElementById('linkEditModalLabel'),
    linkEditForm: document.getElementById('linkEditForm'),
    originUrl: document.getElementById('originUrl'),
    note: document.getElementById('note'),
    akaName: document.getElementById('akaName'),
    isEnabled: document.getElementById('isEnabled'),
    ttl: document.getElementById('ttl'),
    tags: document.getElementById('tags'),
    saveLinkBtn: document.getElementById('saveLinkBtn'),
    saveSpinner: document.getElementById('saveSpinner'),
    modalErrorAlert: document.getElementById('modalErrorAlert'),
    modalErrorMessage: document.getElementById('modalErrorMessage')
};