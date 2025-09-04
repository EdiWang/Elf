import { loadLinks } from './index.links.js';
import { setupSearchEventListeners } from './index.search.mjs';
import { setupDeleteEventListeners } from './index.delete.mjs';
import { setupRefreshEventListeners } from './index.refresh.mjs';
import { setupLinkEditEventListeners } from './index.linkEdit.js';
import { setupTagSearchEventListeners } from './index.tagSearch.js';

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadLinks();
    setupEventListeners();
});

function setupEventListeners() {
    setupSearchEventListeners();
    setupDeleteEventListeners();
    setupRefreshEventListeners();
    setupLinkEditEventListeners();
    setupTagSearchEventListeners();
}