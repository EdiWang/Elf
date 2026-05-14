import { Alpine } from './alpine-init.mjs';
import { getTags, createTag, updateTag, deleteTag } from './tags.apiclient.mjs';
import { error } from './toastService.mjs';
import { createDialogController } from './dialogService.mjs';

Alpine.data('tagManager', () => ({
    tags: [],
    selectedTagId: null,
    editingTagId: null,
    tagToDelete: null,
    isLoading: true,
    isSaving: false,
    isDeleting: false,
    validationMessage: '',
    tagEditModal: null,
    deleteModal: null,
    formData: {
        name: ''
    },

    async init() {
        this.tagEditModal = createDialogController(this.$refs.tagEditModal);
        this.deleteModal = createDialogController(this.$refs.deleteTagModal);

        this.$refs.tagEditModal?.addEventListener('shown.elf.dialog', () => this.focusTagNameInput());
        this.$refs.tagEditModal?.addEventListener('close', () => this.resetTagEditState());
        this.$refs.deleteTagModal?.addEventListener('close', () => this.resetDeleteState());
        this.getElement('addTagBtn')?.addEventListener('click', () => this.showCreateDialog());
        this.getElement('refreshTagBtn')?.addEventListener('click', () => this.loadTags());
        this.getElement('editTagActionBtn')?.addEventListener('click', () => this.showEditDialog());
        this.getElement('deleteTagActionBtn')?.addEventListener('click', () => this.showDeleteConfirmation());
        this.getElement('saveTagBtn')?.addEventListener('click', () => this.saveTag());
        this.getElement('confirmDeleteBtn')?.addEventListener('click', () => this.confirmDelete());
        this.$refs.tagEditForm?.addEventListener('submit', event => {
            event.preventDefault();
            this.saveTag();
        });
        this.$refs.tagGrid?.addEventListener('click', event => this.handleTagGridSelection(event));
        this.$refs.tagGrid?.addEventListener('keydown', event => this.handleTagGridKeydown(event));
        this.$refs.tagName?.addEventListener('input', event => {
            this.formData.name = event.target.value;
            this.clearValidationError();
        });

        await this.loadTags();
        this.syncToolbarActionState();
    },

    get sortedTags() {
        return [...this.tags].sort((a, b) => a.name.localeCompare(b.name));
    },

    get hasTags() {
        return this.tags.length > 0;
    },

    get selectedTag() {
        return this.tags.find(tag => tag.id === this.selectedTagId) ?? null;
    },

    getElement(name) {
        return this.$refs[name] ?? document.getElementById(name);
    },

    async loadTags(preferredSelectedTagId = this.selectedTagId) {
        this.isLoading = true;

        try {
            const response = await getTags();
            this.tags = response ?? [];

            this.selectedTagId = this.tags.some(tag => tag.id === preferredSelectedTagId)
                ? preferredSelectedTagId
                : null;
        } catch (err) {
            console.error('Error loading tags:', err);
            this.selectedTagId = null;
            error('Failed to load tags. Please try again.');
        } finally {
            this.isLoading = false;
            this.syncToolbarActionState();
        }
    },

    selectTag(tag) {
        this.selectedTagId = this.selectedTagId === tag.id ? null : tag.id;
        this.syncToolbarActionState();
    },

    handleTagGridSelection(event) {
        const target = event.target.closest('[data-tag-id]');
        if (!target) return;

        const tagId = Number.parseInt(target.dataset.tagId, 10);
        const tag = this.tags.find(item => item.id === tagId);
        if (tag) {
            this.selectTag(tag);
        }
    },

    handleTagGridKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const target = event.target.closest('[data-tag-id]');
        if (!target) return;

        event.preventDefault();
        this.handleTagGridSelection(event);
    },

    showCreateDialog() {
        this.editingTagId = null;
        this.formData = { name: '' };
        this.validationMessage = '';
        this.tagEditModal.show();
        this.syncTagNameInput();
    },

    showEditDialog() {
        if (!this.selectedTag) return;

        this.editingTagId = this.selectedTag.id;
        this.formData = { name: this.selectedTag.name };
        this.validationMessage = '';
        this.tagEditModal.show();
        this.syncTagNameInput();
    },

    async saveTag() {
        if (this.isSaving) return;

        const name = this.readTagName();
        if (!this.validateTagName(name)) return;

        const preferredSelectedTagId = this.editingTagId;
        this.isSaving = true;
        this.syncSavingState();

        try {
            if (this.editingTagId) {
                await updateTag(this.editingTagId, { name });
            } else {
                await createTag({ name });
            }

            this.tagEditModal.hide();
            await this.loadTags(preferredSelectedTagId);
        } catch (err) {
            console.error('Error saving tag:', err);
        } finally {
            this.isSaving = false;
            this.syncSavingState();
        }
    },

    validateTagName(name) {
        this.clearValidationError();

        if (!name) {
            this.validationMessage = 'Tag name is required.';
            this.syncValidationState();
            return false;
        }

        if (name.length > 32) {
            this.validationMessage = 'Tag name cannot exceed 32 characters.';
            this.syncValidationState();
            return false;
        }

        const duplicateTag = this.tags.find(tag =>
            tag.name.toLowerCase() === name.toLowerCase() &&
            tag.id !== this.editingTagId);

        if (duplicateTag) {
            this.validationMessage = 'A tag with this name already exists.';
            this.syncValidationState();
            return false;
        }

        this.syncValidationState();
        return true;
    },

    clearValidationError() {
        this.validationMessage = '';
        this.syncValidationState();
    },

    showDeleteConfirmation() {
        if (!this.selectedTag) return;

        this.tagToDelete = this.selectedTag;
        this.deleteModal.show();
    },

    async confirmDelete() {
        if (!this.tagToDelete || this.isDeleting) return;

        const deletedTagId = this.tagToDelete.id;
        this.isDeleting = true;
        this.syncDeletingState();

        try {
            await deleteTag(deletedTagId);
            this.deleteModal.hide();

            if (this.selectedTagId === deletedTagId) {
                this.selectedTagId = null;
            }

            await this.loadTags();
        } catch (err) {
            console.error('Error deleting tag:', err);
        } finally {
            this.isDeleting = false;
            this.syncDeletingState();
        }
    },

    resetTagEditState() {
        this.editingTagId = null;
        this.formData = { name: '' };
        this.validationMessage = '';

        if (this.$refs.tagName) {
            this.$refs.tagName.value = '';
            this.$refs.tagName.removeAttribute('aria-invalid');
        }
    },

    resetDeleteState() {
        this.tagToDelete = null;
        this.isDeleting = false;
        this.syncDeletingState();
    },

    readTagName() {
        const name = this.$refs.tagName?.value ?? this.formData.name;
        this.formData.name = name;
        return name.trim();
    },

    syncTagNameInput() {
        this.$nextTick(() => {
            if (this.$refs.tagName) {
                this.$refs.tagName.value = this.formData.name;
            }
        });
    },

    focusTagNameInput() {
        this.$nextTick(() => {
            this.$refs.tagName?.focus();

            if (this.editingTagId && typeof this.$refs.tagName?.select === 'function') {
                this.$refs.tagName.select();
            }
        });
    },

    syncToolbarActionState() {
        const hasSelection = Boolean(this.selectedTag);

        if (this.$refs.editTagActionBtn) {
            this.$refs.editTagActionBtn.disabled = !hasSelection;
        }

        if (this.$refs.deleteTagActionBtn) {
            this.$refs.deleteTagActionBtn.disabled = !hasSelection;
        }
    },

    syncSavingState() {
        if (this.$refs.saveTagBtn) {
            this.$refs.saveTagBtn.disabled = this.isSaving;
        }
    },

    syncDeletingState() {
        if (this.$refs.confirmDeleteBtn) {
            this.$refs.confirmDeleteBtn.disabled = this.isDeleting;
        }
    },

    syncValidationState() {
        if (!this.$refs.tagName) return;

        if (this.validationMessage) {
            this.$refs.tagName.setAttribute('aria-invalid', 'true');
        } else {
            this.$refs.tagName.removeAttribute('aria-invalid');
        }
    }
}));
