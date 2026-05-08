import { getTags, createTag, updateTag, deleteTag } from './tags.apiclient.mjs';
import { success, error } from './toastService.mjs';
import { createDialogController } from './dialogService.mjs';

const TOOLBAR_ACTION_BUTTONS = [
    'editTagActionBtn',
    'deleteTagActionBtn'
];

// DOM elements
const elements = {
    addTagBtn: document.getElementById('addTagBtn'),
    refreshTagBtn: document.getElementById('refreshTagBtn'),
    editTagActionBtn: document.getElementById('editTagActionBtn'),
    deleteTagActionBtn: document.getElementById('deleteTagActionBtn'),
    selectedTagStatus: document.getElementById('selectedTagStatus'),
    tagEditModal: document.getElementById('tagEditModal'),
    tagEditModalLabel: document.getElementById('tagEditModalLabel'),
    tagEditForm: document.getElementById('tagEditForm'),
    tagId: document.getElementById('tagId'),
    tagName: document.getElementById('tagName'),
    tagNameError: document.getElementById('tagNameError'),
    saveTagBtn: document.getElementById('saveTagBtn'),
    cancelTagBtn: document.getElementById('cancelTagBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    noTagsMessage: document.getElementById('noTagsMessage'),
    tagsGridContainer: document.getElementById('tagsGridContainer'),
    tagsGrid: document.getElementById('tagsGrid'),
    deleteTagModal: document.getElementById('deleteTagModal'),
    deleteTagName: document.getElementById('deleteTagName'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn')
};

// State
let tags = [];
let editingTagId = null;
let tagToDeleteId = null;
let selectedTagId = null;
let tagEditModal = null;
let deleteModal = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    tagEditModal = createDialogController(elements.tagEditModal);
    deleteModal = createDialogController(elements.deleteTagModal);
    await loadTags();
});

function setupEventListeners() {
    elements.addTagBtn.addEventListener('click', showCreateDialog);
    elements.refreshTagBtn.addEventListener('click', () => {
        void loadTags(selectedTagId);
    });
    elements.editTagActionBtn.addEventListener('click', handleEditAction);
    elements.deleteTagActionBtn.addEventListener('click', handleDeleteAction);
    elements.tagEditForm.addEventListener('submit', handleSaveTag);
    elements.cancelTagBtn.addEventListener('click', hideTagEditDialog);
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    elements.tagName.addEventListener('input', clearValidationError);
    elements.tagEditModal.addEventListener('shown.elf.dialog', focusTagNameInput);
    elements.tagEditModal.addEventListener('close', resetTagEditState);
    elements.deleteTagModal.addEventListener('close', resetDeleteState);

    syncToolbarActionState();
}

async function loadTags(preferredSelectedTagId = selectedTagId) {
    try {
        showLoading();
        const response = await getTags();
        tags = response.sort((a, b) => a.name.localeCompare(b.name));
        renderTags(preferredSelectedTagId);
    } catch (err) {
        hideLoading();
        clearSelectedTag();
        console.error('Error loading tags:', err);
        error('Failed to load tags. Please try again.');
    }
}

function renderTags(preferredSelectedTagId = null) {
    hideLoading();

    if (tags.length === 0) {
        clearSelectedTag();
        elements.noTagsMessage.classList.remove('d-none');
        elements.tagsGridContainer.classList.add('d-none');
        return;
    }

    clearSelectedTag();
    elements.noTagsMessage.classList.add('d-none');
    elements.tagsGridContainer.classList.remove('d-none');
    elements.tagsGrid.innerHTML = '';

    for (const tag of tags) {
        elements.tagsGrid.appendChild(createTagBadge(tag));
    }

    if (preferredSelectedTagId) {
        const selectedBadge = elements.tagsGrid.querySelector(`[data-tag-id="${preferredSelectedTagId}"]`);
        const selectedTag = tags.find(tag => tag.id === preferredSelectedTagId);

        if (selectedBadge && selectedTag) {
            selectTag(selectedBadge, selectedTag);
        }
    }
}

function createTagBadge(tag) {
    const badge = document.createElement('fluent-badge');
    badge.className = 'tag-badge';
    badge.setAttribute('appearance', 'outline');
    badge.setAttribute('size', 'large');
    badge.setAttribute('data-tag-id', tag.id);
    badge.setAttribute('title', tag.name);
    badge.setAttribute('role', 'option');
    badge.setAttribute('aria-selected', 'false');
    badge.tabIndex = 0;
    badge.textContent = tag.name;

    badge.addEventListener('click', event => {
        if (isInteractiveTarget(event.target)) {
            return;
        }

        selectTag(badge, tag);
    });

    badge.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        if (isInteractiveTarget(event.target)) {
            return;
        }

        event.preventDefault();
        selectTag(badge, tag);
    });

    return badge;
}

function isInteractiveTarget(target) {
    if (!(target instanceof Element)) {
        return false;
    }

    return Boolean(target.closest('a, button, input, textarea, select, fluent-button, [role="button"], [role="link"]'));
}

function selectTag(badge, tag) {
    const selectedBadges = elements.tagsGrid.querySelectorAll('.tag-badge.is-selected');
    for (const selectedBadge of selectedBadges) {
        selectedBadge.classList.remove('is-selected');
        selectedBadge.setAttribute('appearance', 'outline');
        selectedBadge.setAttribute('aria-selected', 'false');
    }

    badge.classList.add('is-selected');
    badge.setAttribute('appearance', 'filled');
    badge.setAttribute('aria-selected', 'true');
    selectedTagId = tag.id;
    syncToolbarActionState(tag);
}

function clearSelectedTag() {
    const selectedBadges = elements.tagsGrid.querySelectorAll('.tag-badge.is-selected');
    for (const selectedBadge of selectedBadges) {
        selectedBadge.classList.remove('is-selected');
        selectedBadge.setAttribute('appearance', 'outline');
        selectedBadge.setAttribute('aria-selected', 'false');
    }

    selectedTagId = null;
    syncToolbarActionState(null);
}

function syncToolbarActionState(selectedTag = getSelectedTag()) {
    const hasSelection = Boolean(selectedTag);

    for (const buttonName of TOOLBAR_ACTION_BUTTONS) {
        const button = elements[buttonName];
        if (button) {
            button.disabled = !hasSelection;
        }
    }

    elements.selectedTagStatus.textContent = hasSelection
        ? `Selected: ${selectedTag.name}`
        : 'No tag selected';
}

function getSelectedTag() {
    if (!selectedTagId) {
        return null;
    }

    return tags.find(tag => tag.id === selectedTagId) ?? null;
}

function showCreateDialog() {
    editingTagId = null;
    elements.tagEditModalLabel.textContent = 'Create Tag';
    elements.tagId.value = '';
    elements.tagName.value = '';
    clearValidationError();
    tagEditModal.show();
}

function editTag(id) {
    const tag = tags.find(t => t.id === id);
    if (!tag) {
        return;
    }

    editingTagId = id;
    elements.tagEditModalLabel.textContent = 'Edit Tag';
    elements.tagId.value = id;
    elements.tagName.value = tag.name;
    clearValidationError();
    tagEditModal.show();
}

function hideTagEditDialog() {
    tagEditModal.hide();
}

async function handleSaveTag(event) {
    event.preventDefault();

    const name = elements.tagName.value.trim();

    if (!validateTagName(name)) {
        return;
    }

    const preferredSelectedTagId = editingTagId;

    try {
        elements.saveTagBtn.disabled = true;
        elements.saveTagBtn.innerHTML = '<fluent-progress-ring class="inline-progress"></fluent-progress-ring> Saving...';

        if (editingTagId) {
            await updateTag(editingTagId, { name });
            success('Tag updated successfully.');
        } else {
            await createTag({ name });
            success('Tag created successfully.');
        }

        hideTagEditDialog();
        await loadTags(preferredSelectedTagId);

    } catch (err) {
        console.error('Error saving tag:', err);
        error('Failed to save tag. Please try again.');
    } finally {
        elements.saveTagBtn.disabled = false;
        elements.saveTagBtn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i> Save';
    }
}

function validateTagName(name) {
    clearValidationError();

    if (!name) {
        showValidationError('Tag name is required.');
        return false;
    }

    if (name.length > 32) {
        showValidationError('Tag name cannot exceed 32 characters.');
        return false;
    }

    // Check for duplicates (case-insensitive)
    const existingTag = tags.find(tag => 
        tag.name.toLowerCase() === name.toLowerCase() && 
        tag.id !== editingTagId
    );

    if (existingTag) {
        showValidationError('A tag with this name already exists.');
        return false;
    }

    return true;
}

function handleEditAction() {
    if (!selectedTagId) {
        return;
    }

    editTag(selectedTagId);
}

function showValidationError(message) {
    elements.tagName.classList.add('is-invalid');
    elements.tagName.setAttribute('aria-invalid', 'true');
    elements.tagNameError.textContent = message;
}

function clearValidationError() {
    elements.tagName.classList.remove('is-invalid');
    elements.tagName.removeAttribute('aria-invalid');
    elements.tagNameError.textContent = '';
}

function focusTagNameInput() {
    elements.tagName.focus();

    if (editingTagId && typeof elements.tagName.select === 'function') {
        elements.tagName.select();
    }
}

function resetTagEditState() {
    editingTagId = null;
    elements.tagEditForm.reset();
    elements.tagId.value = '';
    elements.tagEditModalLabel.textContent = 'Create Tag';
    clearValidationError();
}

function showDeleteConfirmation(id, name) {
    tagToDeleteId = id;
    elements.deleteTagName.textContent = name;
    deleteModal.show();
}

function handleDeleteAction() {
    const selectedTag = getSelectedTag();
    if (!selectedTag) {
        return;
    }

    showDeleteConfirmation(selectedTag.id, selectedTag.name);
}

async function handleConfirmDelete() {
    if (!tagToDeleteId) return;

    const deletedTagId = tagToDeleteId;

    try {
        elements.confirmDeleteBtn.disabled = true;
        elements.confirmDeleteBtn.innerHTML = '<fluent-progress-ring class="inline-progress"></fluent-progress-ring> Deleting...';

        await deleteTag(tagToDeleteId);
        deleteModal.hide();
        success('Tag deleted successfully.');

        if (selectedTagId === deletedTagId) {
            clearSelectedTag();
        }

        await loadTags();

    } catch (err) {
        console.error('Error deleting tag:', err);
        error('Failed to delete tag. Please try again.');
    } finally {
        resetDeleteState();
    }
}

function showLoading() {
    elements.loadingSpinner.classList.remove('d-none');
    elements.noTagsMessage.classList.add('d-none');
    elements.tagsGridContainer.classList.add('d-none');
}

function hideLoading() {
    elements.loadingSpinner.classList.add('d-none');
}

function resetDeleteState() {
    tagToDeleteId = null;
    elements.deleteTagName.textContent = '';
    elements.confirmDeleteBtn.disabled = false;
    elements.confirmDeleteBtn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i> Delete';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}