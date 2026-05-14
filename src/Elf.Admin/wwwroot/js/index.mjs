import { Alpine } from './alpine-init.mjs';
import { loadLinks, setupToolbarActionEventListeners } from './index.links.mjs';
import { setupSearchEventListeners } from './index.search.mjs';
import { setupDeleteEventListeners } from './index.delete.mjs';
import { setupRefreshEventListeners } from './index.refresh.mjs';
import { setupLinkEditEventListeners } from './index.linkEdit.mjs';
import { setupTagSearchEventListeners } from './index.tagSearch.mjs';

Alpine.data('linksDashboard', () => ({
    init() {
        this.setupEventListeners();
        void loadLinks();
    },

    setupEventListeners() {
        setupSearchEventListeners();
        setupDeleteEventListeners();
        setupRefreshEventListeners();
        setupLinkEditEventListeners();
        setupTagSearchEventListeners();
        setupToolbarActionEventListeners();
    }
}));
