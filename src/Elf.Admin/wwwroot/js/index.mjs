import { Alpine } from './alpine-init.mjs';
import { elements } from './index.dom.mjs';
import { updateState, resetPage } from './index.state.mjs';
import { loadLinks, setupToolbarActionEventListeners } from './index.links.mjs';
import { setupDeleteEventListeners } from './index.delete.mjs';
import { setupLinkEditEventListeners } from './index.linkEdit.mjs';
import { clearTagSearchSelection, setupTagSearchEventListeners } from './index.tagSearch.mjs';

Alpine.data('linksDashboard', () => ({
    isLoading: false,
    isRefreshing: false,
    showEmptyState: false,

    init() {
        this.setupStateListeners();
        this.setupEventListeners();
        this.setupPageCommandListeners();
        void this.load();
    },

    setupEventListeners() {
        setupDeleteEventListeners();
        setupLinkEditEventListeners();
        setupTagSearchEventListeners();
        setupToolbarActionEventListeners();
    },

    setupStateListeners() {
        document.addEventListener('elf.links.loading-changed', event => {
            this.isLoading = Boolean(event.detail?.isLoading);
            this.syncRefreshButtonState();
        });

        document.addEventListener('elf.links.empty-state-changed', event => {
            this.showEmptyState = Boolean(event.detail?.showEmptyState);
        });
    },

    setupPageCommandListeners() {
        this.$refs.searchButton?.addEventListener('click', () => {
            void this.search();
        });

        this.$refs.clearButton?.addEventListener('click', () => {
            void this.clearSearch();
        });

        this.$refs.refreshButton?.addEventListener('click', () => {
            void this.refresh();
        });

        this.$refs.pageSize?.addEventListener('change', () => {
            void this.changePageSize();
        });

        this.$refs.searchTerm?.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                void this.search();
            }
        });
    },

    async load() {
        await loadLinks();
    },

    async search() {
        updateState({
            currentSearchTerm: this.$refs.searchTerm?.value.trim() ?? '',
            selectedTagIds: [],
            searchMode: 'text'
        });

        clearTagSearchSelection();
        resetPage();
        await this.load();
    },

    async clearSearch() {
        if (this.$refs.searchTerm) {
            this.$refs.searchTerm.value = '';
        }

        updateState({
            currentSearchTerm: '',
            selectedTagIds: [],
            searchMode: 'text'
        });

        clearTagSearchSelection();
        resetPage();
        await this.load();
    },

    async refresh() {
        this.isRefreshing = true;
        this.syncRefreshButtonState();

        try {
            await this.load();
        } finally {
            this.isRefreshing = false;
            this.syncRefreshButtonState();
        }
    },

    async changePageSize() {
        const pageSizeValue = (this.$refs.pageSize?.value ?? '').toString();
        const pageSize = Number.parseInt(pageSizeValue, 10);
        if (Number.isNaN(pageSize)) {
            return;
        }

        updateState({ pageSize });
        resetPage();
        await this.load();
    },

    syncRefreshButtonState() {
        if (!elements.refreshBtn) {
            return;
        }

        const disabled = this.isRefreshing || this.isLoading;
        elements.refreshBtn.disabled = disabled;
        elements.refreshBtn.toggleAttribute('disabled', disabled);
    }
}));
