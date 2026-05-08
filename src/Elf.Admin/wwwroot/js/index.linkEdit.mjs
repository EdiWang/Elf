import { createLink, editLink, getLink } from '/js/links.apiclient.mjs';
import { getTags } from '/js/tags.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.mjs';
import { loadLinks } from './index.links.mjs';

const EXISTING_TAGS_PLACEHOLDER = 'Select existing tags...';

let availableTagNames = [];
let selectedTags = [];

export function setupLinkEditEventListeners() {
    elements.addLinkBtn.addEventListener('click', () => {
        void showLinkEditModal();
    });
    elements.saveLinkBtn.addEventListener('click', () => {
        void handleSaveLink();
    });
    elements.linkEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        void handleSaveLink();
    });

    elements.tags.addEventListener('change', handleTagsDropdownChange);
    elements.addTagBtn.addEventListener('click', handleAddTag);
    elements.tagInput.addEventListener('keydown', handleTagInputKeyDown);
    elements.linkEditModal.element.addEventListener('close', () => clearForm());
}

async function refreshAvailableTags() {
    try {
        const tagsResponse = await getTags();
        availableTagNames = [...new Set(tagsResponse
            .map(tag => normalizeTagName(tag.name))
            .filter(Boolean))]
            .sort((left, right) => left.localeCompare(right));

        renderTagOptions();
        syncTagEditor();
    } catch (error) {
        console.error('Error loading available tags:', error);
        availableTagNames = [];
        renderTagOptions();
        syncTagEditor();
    }
}

function renderTagOptions() {
    const listbox = elements.tagsListbox;
    if (!listbox) {
        return;
    }

    listbox.replaceChildren();

    const fragment = document.createDocumentFragment();

    for (const tagName of availableTagNames) {
        const option = document.createElement('fluent-option');
        option.setAttribute('value', tagName);
        option.textContent = tagName;
        fragment.appendChild(option);
    }

    listbox.appendChild(fragment);
}

function normalizeTagName(tagName) {
    return (tagName ?? '').trim().toLowerCase();
}

function getUniqueTagNames(tagNames) {
    const uniqueTagNames = [];
    const seen = new Set();

    for (const tagName of tagNames) {
        const normalizedTagName = normalizeTagName(tagName);
        if (!normalizedTagName || seen.has(normalizedTagName)) {
            continue;
        }

        seen.add(normalizedTagName);
        uniqueTagNames.push(normalizedTagName);
    }

    return uniqueTagNames;
}

function getSelectedDropdownTagNames() {
    if (!elements.tags?.selectedOptions) {
        return [];
    }

    return Array.from(elements.tags.selectedOptions)
        .map(option => normalizeTagName(option.value || option.getAttribute('value')))
        .filter(Boolean);
}

function setDropdownOptionSelected(option, isSelected) {
    option.selected = isSelected;

    if ('currentSelected' in option) {
        option.currentSelected = isSelected;
    }

    if (isSelected) {
        option.setAttribute('selected', '');
    } else {
        option.removeAttribute('selected');
    }
}

function setSelectedTags(tagNames) {
    selectedTags = getUniqueTagNames(tagNames);
    syncTagEditor();
}

function getTagsDropdownControl() {
    if (elements.tagsControl?.isConnected) {
        return elements.tagsControl;
    }

    const existingControl = elements.tags?.querySelector('[slot="control"]');
    if (existingControl) {
        elements.tagsControl = existingControl;
        return existingControl;
    }

    if (!elements.tags) {
        return null;
    }

    const control = document.createElement('button');
    control.type = 'button';
    control.id = 'tagsControl';
    control.slot = 'control';
    control.className = 'tag-editor-control is-placeholder';
    control.setAttribute('aria-haspopup', 'listbox');
    control.setAttribute('aria-controls', 'tagsListbox');
    control.textContent = EXISTING_TAGS_PLACEHOLDER;

    elements.tags.appendChild(control);
    elements.tagsControl = control;
    return control;
}

function syncTagEditor() {
    syncTagsDropdownSelection();
    updateTagsDropdownControlText();
    renderSelectedTags();
}

function syncTagsDropdownSelection() {
    const existingTagNameSet = new Set(availableTagNames);
    const selectedExistingTagSet = new Set(selectedTags.filter(tagName => existingTagNameSet.has(tagName)));
    const options = elements.tagsListbox?.querySelectorAll('fluent-option') ?? [];

    for (const option of options) {
        const optionValue = normalizeTagName(option.value || option.getAttribute('value'));
        setDropdownOptionSelected(option, selectedExistingTagSet.has(optionValue));
    }

    if (!selectedExistingTagSet.size) {
        elements.tags.value = '';
    }
}

function updateTagsDropdownControlText() {
    const existingTagNameSet = new Set(availableTagNames);
    const selectedExistingTagNames = selectedTags.filter(tagName => existingTagNameSet.has(tagName));
    const tagsControl = getTagsDropdownControl();

    if (!tagsControl) {
        return;
    }

    if (selectedExistingTagNames.length === 0) {
        tagsControl.textContent = EXISTING_TAGS_PLACEHOLDER;
        tagsControl.title = '';
        tagsControl.classList.add('is-placeholder');
        return;
    }

    const controlText = selectedExistingTagNames.length <= 2
        ? selectedExistingTagNames.join(', ')
        : `${selectedExistingTagNames.length} tags selected`;

    tagsControl.textContent = controlText;
    tagsControl.title = selectedExistingTagNames.join(', ');
    tagsControl.classList.remove('is-placeholder');
}

function renderSelectedTags() {
    const container = elements.selectedTags;
    if (!container) {
        return;
    }

    container.replaceChildren();

    if (selectedTags.length === 0) {
        container.classList.add('d-none');
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const tagName of selectedTags) {
        const chip = document.createElement('div');
        chip.className = 'tag-editor-chip';

        const badge = document.createElement('fluent-badge');
        badge.textContent = tagName;

        const removeButton = document.createElement('fluent-button');
        removeButton.type = 'button';
        removeButton.appearance = 'stealth';
        removeButton.className = 'button-icon-only tag-editor-chip-remove';
        removeButton.title = `Remove ${tagName}`;
        removeButton.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
        removeButton.addEventListener('click', () => removeSelectedTag(tagName));

        chip.appendChild(badge);
        chip.appendChild(removeButton);
        fragment.appendChild(chip);
    }

    container.appendChild(fragment);
    container.classList.remove('d-none');
}

function removeSelectedTag(tagName) {
    setSelectedTags(selectedTags.filter(currentTag => currentTag !== tagName));
}

function handleTagsDropdownChange() {
    const existingTagNameSet = new Set(availableTagNames);
    const customTagNames = selectedTags.filter(tagName => !existingTagNameSet.has(tagName));
    setSelectedTags([...getSelectedDropdownTagNames(), ...customTagNames]);
}

function parseTagInput(value) {
    return value
        .split(/[\r\n,;]+/)
        .map(normalizeTagName)
        .filter(Boolean);
}

function handleAddTag() {
    const newTagNames = parseTagInput(elements.tagInput.value);
    if (newTagNames.length === 0) {
        return;
    }

    setSelectedTags([...selectedTags, ...newTagNames]);
    elements.tagInput.value = '';
}

function handleTagInputKeyDown(event) {
    if (event.key !== 'Enter') {
        return;
    }

    event.preventDefault();
    handleAddTag();
}

export async function showLinkEditModal(linkId = null) {
    clearForm({ resetEditingLinkId: false });
    updateState({ editingLinkId: linkId });

    if (linkId) {
        elements.linkEditModalLabel.textContent = 'Edit Link';
    } else {
        elements.linkEditModalLabel.textContent = 'Create Link';
    }

    elements.linkEditModal.show();

    await refreshAvailableTags();

    if (linkId) {
        await loadLinkForEdit(linkId);
    }
}

async function loadLinkForEdit(linkId) {
    try {
        showSaveSpinner(true);
        const link = await getLink(linkId);

        elements.originUrl.value = link.originUrl || '';
        elements.note.value = link.note || '';
        elements.akaName.value = link.akaName || '';
        elements.isEnabled.checked = link.isEnabled;
        elements.ttl.value = link.ttl || 0;

        setSelectedTags((link.tags ?? []).map(tag => tag.name || tag));
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
            await editLink(state.editingLinkId, formData);
        } else {
            await createLink(formData);
        }

        elements.linkEditModal.hide();
        await loadLinks();
    } catch (error) {
        console.error('Error saving link:', error);
        showModalError(error.message || 'Failed to save link');
    } finally {
        showSaveSpinner(false);
    }
}

function getFormData() {
    return {
        originUrl: elements.originUrl.value.trim(),
        note: elements.note.value.trim(),
        akaName: elements.akaName.value.trim() || null,
        isEnabled: elements.isEnabled.checked,
        ttl: parseInt(elements.ttl.value) || 0,
        tags: selectedTags
    };
}

function validateForm() {
    clearValidationErrors();
    let isValid = true;

    const originUrl = elements.originUrl.value.trim();
    if (!originUrl) {
        showFieldError('originUrl', 'Origin URL is required');
        isValid = false;
    } else if (originUrl.length > 256) {
        showFieldError('originUrl', 'Origin URL must be 256 characters or less');
        isValid = false;
    }

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
    field.setAttribute('aria-invalid', 'true');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearValidationErrors() {
    const formFields = ['originUrl', 'note', 'akaName', 'ttl', 'tags'];
    formFields.forEach(fieldName => {
        const field = elements[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');

        if (field) {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
        }
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

function clearForm({ resetEditingLinkId = true } = {}) {
    elements.linkEditForm.reset();
    elements.originUrl.value = '';
    elements.note.value = '';
    elements.akaName.value = '';
    elements.ttl.value = 0;
    elements.isEnabled.checked = true;
    elements.tagInput.value = '';
    setSelectedTags([]);
    clearValidationErrors();
    hideModalError();

    if (resetEditingLinkId) {
        updateState({ editingLinkId: null });
    }
}