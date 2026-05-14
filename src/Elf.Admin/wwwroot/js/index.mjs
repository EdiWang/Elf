import { Alpine } from './alpine-init.mjs';
import { elements } from './index.dom.mjs';
import { updateState, resetPage } from './index.state.mjs';
import { loadLinks, setupToolbarActionEventListeners } from './index.links.mjs';
import { setupDeleteEventListeners } from './index.delete.mjs';
import { setupLinkEditEventListeners } from './index.linkEdit.mjs';
import { clearTagSearchSelection, loadLinksByTags } from './index.tagSearch.mjs';
import { getTags } from './tags.apiclient.mjs';
import { warning } from './toastService.mjs';

const TAG_FILTER_PLACEHOLDER = 'Select tags to filter...';

Alpine.data('linksDashboard', () => ({
    isLoading: false,
    isRefreshing: false,
    showEmptyState: false,
    selectedTagFilterNames: [],
    tagFilterPlaceholder: TAG_FILTER_PLACEHOLDER,

    init() {
        this.setupStateListeners();
        this.setupEventListeners();
        this.setupPageCommandListeners();
        void this.initializeTagFilter();
        void this.load();
    },

    setupEventListeners() {
        setupDeleteEventListeners();
        setupLinkEditEventListeners();
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

        this.$refs.tagFilter?.addEventListener('change', () => {
            this.syncSelectedTagFilterNames();
        });

        this.$refs.tagSearchButton?.addEventListener('click', () => {
            void this.searchByTags();
        });

        this.$refs.clearTagFilterButton?.addEventListener('click', () => {
            void this.clearTagFilter();
        });

        this.$refs.searchTerm?.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                void this.search();
            }
        });
    },

    get selectedTagFilterLabel() {
        return this.selectedTagFilterNames.length > 0
            ? this.selectedTagFilterNames.join(', ')
            : this.tagFilterPlaceholder;
    },

    async load() {
        await loadLinks();
    },

    async initializeTagFilter() {
        await this.loadTagFilterOptions();
        this.syncSelectedTagFilterNames();
    },

    async loadTagFilterOptions() {
        try {
            const tags = await getTags();
            this.renderTagFilterOptions(tags);
        } catch (error) {
            console.error('Error initializing tag search dropdown:', error);
        }
    },

    renderTagFilterOptions(tags) {
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
    },

    async search() {
        updateState({
            currentSearchTerm: this.$refs.searchTerm?.value.trim() ?? '',
            selectedTagIds: [],
            searchMode: 'text'
        });

        clearTagSearchSelection();
        this.syncSelectedTagFilterNames();
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
        this.syncSelectedTagFilterNames();
        resetPage();
        await this.load();
    },

    async searchByTags() {
        const tagIds = this.getSelectedTagIds();
        if (tagIds.length === 0) {
            warning('Please select at least one tag to search.');
            return;
        }

        if (this.$refs.searchTerm) {
            this.$refs.searchTerm.value = '';
        }

        updateState({
            selectedTagIds: tagIds,
            searchMode: 'tags',
            currentSearchTerm: ''
        });

        this.syncSelectedTagFilterNames();
        resetPage();
        await loadLinksByTags();
    },

    async clearTagFilter() {
        clearTagSearchSelection();
        this.syncSelectedTagFilterNames();

        updateState({
            selectedTagIds: [],
            searchMode: 'text'
        });

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
    },

    getSelectedTagOptions() {
        if (!elements.tagFilter?.selectedOptions) {
            return [];
        }

        return Array.from(elements.tagFilter.selectedOptions);
    },

    getSelectedTagIds() {
        return this.getSelectedTagOptions()
            .map(option => Number.parseInt(option.value || option.getAttribute('value') || '', 10))
            .filter(tagId => !Number.isNaN(tagId));
    },

    getSelectedTagNames() {
        return this.getSelectedTagOptions()
            .map(option => option.textContent?.trim())
            .filter(Boolean);
    },

    syncSelectedTagFilterNames() {
        this.selectedTagFilterNames = this.getSelectedTagNames();
    }
}));
