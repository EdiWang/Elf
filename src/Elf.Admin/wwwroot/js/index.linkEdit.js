import { createLink, editLink, getLink } from '/js/links.apiclient.mjs';
import { getTags } from '/js/tags.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.js';
import { loadLinks } from './index.links.js';

let tagify = null;

export function setupLinkEditEventListeners() {
    elements.addLinkBtn.addEventListener('click', () => showLinkEditModal());
    elements.saveLinkBtn.addEventListener('click', handleSaveLink);
    elements.linkEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSaveLink();
    });
    
    // Clear form when modal is hidden
    elements.linkEditModal._element.addEventListener('hidden.bs.modal', clearForm);
    
    // Initialize Tagify when modal is shown
    elements.linkEditModal._element.addEventListener('shown.bs.modal', initializeTagify);
}

async function initializeTagify() {
    if (tagify) return; // Already initialized
    
    try {
        // Fetch existing tags from API
        const tagsResponse = await getTags();
        const existingTags = tagsResponse.map(tag => ({ value: tag.name, id: tag.id }));
        
        // Initialize Tagify
        tagify = new Tagify(elements.tags, {
            whitelist: existingTags,
            maxTags: 10,
            dropdown: {
                maxItems: 20,
                classname: 'tags-dropdown',
                enabled: 0, // Show dropdown immediately when typing
                closeOnSelect: false
            },
            editTags: 1, // Allow editing tags by clicking
            placeholder: 'Type to search or add tags...',
            transformTag: transformTag,
            callbacks: {
                'add': onTagAdd,
                'remove': onTagRemove,
                'edit:updated': onTagEdit
            }
        });
        
    } catch (error) {
        console.error('Error initializing Tagify:', error);
        // Fallback to basic text input behavior
    }
}

function transformTag(tagData) {
    // Ensure tag names are properly formatted
    tagData.value = tagData.value.toLowerCase().trim();
}

function onTagAdd(e) {
    console.debug('Tag added:', e.detail.data);
}

function onTagRemove(e) {
    console.debug('Tag removed:', e.detail.data);
}

function onTagEdit(e) {
    console.debug('Tag edited:', e.detail.data);
}

export function showLinkEditModal(linkId = null) {
    updateState({ editingLinkId: linkId });
    
    if (linkId) {
        // Edit mode
        elements.linkEditModalLabel.textContent = 'Edit Link';
        loadLinkForEdit(linkId);
    } else {
        // Create mode
        elements.linkEditModalLabel.textContent = 'Create Link';
        clearForm();
    }
    
    elements.linkEditModal.show();
}

async function loadLinkForEdit(linkId) {
    try {
        showSaveSpinner(true);
        const link = await getLink(linkId);
        
        // Populate form with link data
        elements.originUrl.value = link.originUrl || '';
        elements.note.value = link.note || '';
        elements.akaName.value = link.akaName || '';
        elements.isEnabled.checked = link.isEnabled;
        elements.ttl.value = link.ttl || 0;
        
        // Handle tags with Tagify
        if (tagify && link.tags && link.tags.length > 0) {
            const tagValues = link.tags.map(tag => ({ value: tag.name || tag }));
            tagify.addTags(tagValues);
        } else if (!tagify && link.tags && link.tags.length > 0) {
            // Fallback for when Tagify isn't initialized yet
            elements.tags.value = link.tags.map(tag => tag.name || tag).join(', ');
        }
        
    } catch (error) {
        console.error('Error loading link for edit:', error);
        showModalError('Failed to load link data');
    } finally {
        showSaveSpinner(false);
    }
}

async function handleSaveLink() {
    if (!validateForm()) return;
    
    try {
        showSaveSpinner(true);
        hideModalError();
        
        const formData = getFormData();
        
        if (state.editingLinkId) {
            // Edit existing link
            await editLink(state.editingLinkId, formData);
        } else {
            // Create new link
            await createLink(formData);
        }
        
        elements.linkEditModal.hide();
        await loadLinks(); // Refresh the links list
        
    } catch (error) {
        console.error('Error saving link:', error);
        showModalError(error.message || 'Failed to save link');
    } finally {
        showSaveSpinner(false);
    }
}

function getFormData() {
    let tags = [];
    
    if (tagify) {
        // Get tags from Tagify
        tags = tagify.value.map(tag => tag.value.trim()).filter(tag => tag.length > 0);
    } else {
        // Fallback: parse tags from comma-separated string
        const tagsInput = elements.tags.value.trim();
        tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    }
    
    return {
        originUrl: elements.originUrl.value.trim(),
        note: elements.note.value.trim(),
        akaName: elements.akaName.value.trim() || null,
        isEnabled: elements.isEnabled.checked,
        ttl: parseInt(elements.ttl.value) || 0,
        tags: tags
    };
}

function validateForm() {
    clearValidationErrors();
    let isValid = true;
    
    // Validate Origin URL
    const originUrl = elements.originUrl.value.trim();
    if (!originUrl) {
        showFieldError('originUrl', 'Origin URL is required');
        isValid = false;
    } else if (originUrl.length > 256) {
        showFieldError('originUrl', 'Origin URL must be 256 characters or less');
        isValid = false;
    }
    
    // Validate AKA Name pattern
    const akaName = elements.akaName.value.trim();
    if (akaName) {
        const akaPattern = /^(?!-)([a-z0-9-]+)(?<!-)$/;
        if (!akaPattern.test(akaName)) {
            showFieldError('akaName', 'Aka can only contain lowercase letters, numbers, and hyphens (not at start/end)');
            isValid = false;
        } else if (akaName.length > 32) {
            showFieldError('akaName', 'Aka name must be 32 characters or less');
            isValid = false;
        }
    }
    
    // Validate TTL
    const ttl = parseInt(elements.ttl.value);
    if (ttl < 0 || ttl > 86400) {
        showFieldError('ttl', 'TTL must be between 0 and 86400 seconds (24 hours)');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const field = elements[fieldName];
    const errorElement = document.getElementById(fieldName + 'Error');
    
    field.classList.add('is-invalid');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearValidationErrors() {
    const formFields = ['originUrl', 'note', 'akaName', 'ttl', 'tags'];
    formFields.forEach(fieldName => {
        const field = elements[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');
        
        if (field) field.classList.remove('is-invalid');
        if (errorElement) errorElement.textContent = '';
    });
}

function showModalError(message) {
    elements.modalErrorMessage.textContent = message;
    elements.modalErrorAlert.classList.remove('d-none');
}

function hideModalError() {
    elements.modalErrorAlert.classList.add('d-none');
    elements.modalErrorMessage.textContent = '';
}

function showSaveSpinner(show) {
    elements.saveSpinner.classList.toggle('d-none', !show);
    elements.saveLinkBtn.disabled = show;
}

function clearForm() {
    elements.linkEditForm.reset();
    elements.ttl.value = 0;
    elements.isEnabled.checked = true;
    clearValidationErrors();
    hideModalError();
    updateState({ editingLinkId: null });
    
    // Clear Tagify tags
    if (tagify) {
        tagify.removeAllTags();
    }
}