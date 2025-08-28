import { createLink, editLink, getLink } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.js';
import { state, updateState } from './index.state.js';
import { loadLinks } from './index.links.js';

export function setupLinkEditEventListeners() {
    elements.addLinkBtn.addEventListener('click', () => showLinkEditModal());
    elements.saveLinkBtn.addEventListener('click', handleSaveLink);
    elements.linkEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSaveLink();
    });
    
    // Clear form when modal is hidden
    elements.linkEditModal._element.addEventListener('hidden.bs.modal', clearForm);
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
        
        // Handle tags - convert array to comma-separated string
        if (link.tags && link.tags.length > 0) {
            elements.tags.value = link.tags.map(tag => tag.name || tag).join(', ');
        } else {
            elements.tags.value = '';
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
    // Parse tags from comma-separated string to array
    const tagsInput = elements.tags.value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    
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
}