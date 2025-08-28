import { loadLinks } from './index.links.js';
import { setupSearchEventListeners } from './index.search.js';
import { setupDeleteEventListeners } from './index.delete.js';
import { setupRefreshEventListeners } from './index.refresh.js';
import { setupLinkEditEventListeners } from './index.linkEdit.js';

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
}