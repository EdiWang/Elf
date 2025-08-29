import { getTags, createTag, updateTag, deleteTag } from './tags.apiclient.mjs';
import { success, error } from './toastService.mjs';

// DOM elements
const elements = {
    addTagBtn: document.getElementById('addTagBtn'),
    tagForm: document.getElementById('tagForm'),
    formTitle: document.getElementById('formTitle'),
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
let deleteModal = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    deleteModal = new bootstrap.Modal(elements.deleteTagModal);
    await loadTags();
});

function setupEventListeners() {
    elements.addTagBtn.addEventListener('click', showCreateForm);
    elements.tagEditForm.addEventListener('submit', handleSaveTag);
    elements.cancelTagBtn.addEventListener('click', hideForm);
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    elements.tagName.addEventListener('input', clearValidationError);
}

async function loadTags() {
    try {
        showLoading();
        const response = await getTags();
        tags = response.sort((a, b) => a.name.localeCompare(b.name));
        renderTags();
    } catch (err) {
        console.error('Error loading tags:', err);
        error('Failed to load tags. Please try again.');
    }
}

function renderTags() {
    hideLoading();
    
    if (tags.length === 0) {
        elements.noTagsMessage.style.display = 'block';
        elements.tagsGridContainer.style.display = 'none';
        return;
    }

    elements.noTagsMessage.style.display = 'none';
    elements.tagsGridContainer.style.display = 'block';

    elements.tagsGrid.innerHTML = tags.map(tag => `
        <div class="tag-pill d-inline-flex align-items-center gap-1 bg-white border rounded ps-2 pe-1 py-1">
            <span class="tag-name me-2">
                ${escapeHtml(tag.name)}
            </span>
            <button type="button" class="btn btn-sm btn-outline-primary" 
                    onclick="editTag(${tag.id})" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" 
                    onclick="showDeleteConfirmation(${tag.id}, '${escapeHtml(tag.name)}')" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
}

function showCreateForm() {
    editingTagId = null;
    elements.formTitle.textContent = 'Create Tag';
    elements.tagId.value = '';
    elements.tagName.value = '';
    clearValidationError();
    elements.tagForm.style.display = 'block';
    elements.tagName.focus();
}

function editTag(id) {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;

    editingTagId = id;
    elements.formTitle.textContent = 'Edit Tag';
    elements.tagId.value = id;
    elements.tagName.value = tag.name;
    clearValidationError();
    elements.tagForm.style.display = 'block';
    elements.tagName.focus();
    elements.tagName.select();
}

function hideForm() {
    elements.tagForm.style.display = 'none';
    editingTagId = null;
    clearValidationError();
}

async function handleSaveTag(event) {
    event.preventDefault();
    
    const name = elements.tagName.value.trim();
    
    if (!validateTagName(name)) {
        return;
    }

    try {
        elements.saveTagBtn.disabled = true;
        elements.saveTagBtn.innerHTML = '<i class="spinner-border spinner-border-sm"></i> Saving...';

        if (editingTagId) {
            await updateTag(editingTagId, { name });
            success('Tag updated successfully.');
        } else {
            await createTag({ name });
            success('Tag created successfully.');
        }

        hideForm();
        await loadTags();
        
    } catch (err) {
        console.error('Error saving tag:', err);
        error('Failed to save tag. Please try again.');
    } finally {
        elements.saveTagBtn.disabled = false;
        elements.saveTagBtn.innerHTML = '<i class="bi bi-check-circle"></i> Save';
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

function showValidationError(message) {
    elements.tagName.classList.add('is-invalid');
    elements.tagNameError.textContent = message;
}

function clearValidationError() {
    elements.tagName.classList.remove('is-invalid');
    elements.tagNameError.textContent = '';
}

function showDeleteConfirmation(id, name) {
    tagToDeleteId = id;
    elements.deleteTagName.textContent = name;
    deleteModal.show();
}

async function handleConfirmDelete() {
    if (!tagToDeleteId) return;

    try {
        elements.confirmDeleteBtn.disabled = true;
        elements.confirmDeleteBtn.innerHTML = '<i class="spinner-border spinner-border-sm"></i> Deleting...';

        await deleteTag(tagToDeleteId);
        deleteModal.hide();
        success('Tag deleted successfully.');
        await loadTags();
        
    } catch (err) {
        console.error('Error deleting tag:', err);
        error('Failed to delete tag. Please try again.');
    } finally {
        elements.confirmDeleteBtn.disabled = false;
        elements.confirmDeleteBtn.innerHTML = '<i class="bi bi-trash"></i> Delete';
        tagToDeleteId = null;
    }
}

function showLoading() {
    elements.loadingSpinner.style.display = 'block';
    elements.noTagsMessage.style.display = 'none';
    elements.tagsGridContainer.style.display = 'none';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions to global scope for onclick handlers
window.editTag = editTag;
window.showDeleteConfirmation = showDeleteConfirmation;