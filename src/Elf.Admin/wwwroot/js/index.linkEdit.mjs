import { createLink, editLink, getLink } from '/js/links.apiclient.mjs';
import { getTags } from '/js/tags.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.mjs';
import { loadLinks } from './index.links.mjs';

const MAX_TAG_SUGGESTIONS = 8;

let availableTagNames = [];
let selectedTags = [];
let tagSuggestions = [];
let activeTagSuggestionIndex = -1;

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

    elements.tagInput.addEventListener('input', handleTagInput);
    elements.tagInput.addEventListener('focus', handleTagInputFocus);
    elements.tagInput.addEventListener('keydown', handleTagInputKeyDown);
    elements.tagInput.addEventListener('blur', handleTagInputBlur);
    elements.tagSuggestionsList?.addEventListener('mousedown', handleTagSuggestionMouseDown);
    elements.tagSuggestionsList?.addEventListener('click', handleTagSuggestionClick);
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    elements.linkEditModal.element.addEventListener('close', () => clearForm());
}

async function refreshAvailableTags() {
    try {
        const tagsResponse = await getTags();
        availableTagNames = [...new Set(tagsResponse
            .map(tag => normalizeTagName(tag.name))
            .filter(Boolean))]
            .sort((left, right) => left.localeCompare(right));

        syncTagEditor();
    } catch (error) {
        console.error('Error loading available tags:', error);
        availableTagNames = [];
        syncTagEditor();
    }
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

function setSelectedTags(tagNames) {
    selectedTags = getUniqueTagNames(tagNames);
    syncTagEditor();
}

function syncTagEditor() {
    renderSelectedTags();
    updateTagSuggestions();
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
    queueMicrotask(() => elements.tagInput?.focus());
}

function getFilteredTagSuggestions(query) {
    const normalizedQuery = normalizeTagName(query);
    const selectedTagSet = new Set(selectedTags);
    const matchingExistingTags = availableTagNames
        .filter(tagName => !selectedTagSet.has(tagName))
        .filter(tagName => !normalizedQuery || tagName.includes(normalizedQuery));

    const prefixMatches = matchingExistingTags.filter(tagName => tagName.startsWith(normalizedQuery));
    const partialMatches = matchingExistingTags.filter(tagName => !tagName.startsWith(normalizedQuery));
    const suggestions = [...prefixMatches, ...partialMatches]
        .slice(0, MAX_TAG_SUGGESTIONS)
        .map(tagName => ({
            value: tagName,
            label: tagName,
            kind: 'existing'
        }));

    if (normalizedQuery && !selectedTagSet.has(normalizedQuery) && !availableTagNames.includes(normalizedQuery)) {
        suggestions.unshift({
            value: normalizedQuery,
            label: `Add "${normalizedQuery}"`,
            kind: 'create'
        });
    }

    return suggestions.slice(0, MAX_TAG_SUGGESTIONS);
}

function parseTagInput(value) {
    return value
        .split(/[\r\n,;]+/)
        .map(normalizeTagName)
        .filter(Boolean);
}

function addTagNames(tagNames) {
    const normalizedTagNames = getUniqueTagNames(tagNames);
    if (normalizedTagNames.length === 0) {
        return;
    }

    setSelectedTags([...selectedTags, ...normalizedTagNames]);
    elements.tagInput.value = '';
    hideTagSuggestions();
}

function handleTagInput() {
    updateTagSuggestions();
}

function handleTagInputFocus() {
    updateTagSuggestions();
}

function handleTagInputBlur() {
    window.setTimeout(() => {
        if (!elements.tags?.contains(document.activeElement)) {
            hideTagSuggestions();
        }
    }, 0);
}

function handleTagSuggestionMouseDown(event) {
    event.preventDefault();
}

function handleTagSuggestionClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }

    const menuItem = target.closest('fluent-menu-item');
    if (!menuItem) {
        return;
    }

    selectTagSuggestionByIndex(Number.parseInt(menuItem.dataset.index ?? '-1', 10));
}

function handleDocumentPointerDown(event) {
    const target = event.target;
    if (!(target instanceof Node)) {
        return;
    }

    if (!elements.tags?.contains(target)) {
        hideTagSuggestions();
    }
}

function updateTagSuggestions() {
    const query = elements.tagInput.value;
    const shouldShowSuggestions = document.activeElement === elements.tagInput || Boolean(query.trim());
    if (!shouldShowSuggestions) {
        tagSuggestions = [];
        hideTagSuggestions();
        return;
    }

    tagSuggestions = getFilteredTagSuggestions(query);
    activeTagSuggestionIndex = tagSuggestions.length > 0 ? 0 : -1;
    renderTagSuggestions();
}

function renderTagSuggestions() {
    const menuList = elements.tagSuggestionsList;
    if (!menuList) {
        return;
    }

    menuList.replaceChildren();

    if (tagSuggestions.length === 0) {
        hideTagSuggestions();
        return;
    }

    const fragment = document.createDocumentFragment();

    tagSuggestions.forEach((suggestion, index) => {
        const item = document.createElement('fluent-menu-item');
        item.dataset.index = index.toString();
        item.dataset.value = suggestion.value;
        item.dataset.kind = suggestion.kind;
        item.setAttribute('role', 'menuitem');
        item.tabIndex = index === activeTagSuggestionIndex ? 0 : -1;
        item.textContent = suggestion.label;

        if (suggestion.kind === 'create') {
            item.classList.add('tag-editor-menu-item-create');
        }

        if (index === activeTagSuggestionIndex) {
            item.classList.add('is-active');
        }

        fragment.appendChild(item);
    });

    menuList.appendChild(fragment);
    showTagSuggestions();
}

function showTagSuggestions() {
    elements.tagSuggestions?.classList.remove('d-none');
    elements.tagInput?.setAttribute('aria-expanded', 'true');
}

function hideTagSuggestions() {
    elements.tagSuggestions?.classList.add('d-none');
    elements.tagInput?.setAttribute('aria-expanded', 'false');
    activeTagSuggestionIndex = -1;
}

function moveActiveTagSuggestion(offset) {
    if (tagSuggestions.length === 0) {
        return;
    }

    const nextIndex = activeTagSuggestionIndex < 0
        ? 0
        : (activeTagSuggestionIndex + offset + tagSuggestions.length) % tagSuggestions.length;

    activeTagSuggestionIndex = nextIndex;
    renderTagSuggestions();
}

function selectTagSuggestionByIndex(index) {
    if (index < 0 || index >= tagSuggestions.length) {
        return;
    }

    addTagNames([tagSuggestions[index].value]);
    elements.tagInput.focus();
}

function commitTagInput() {
    const newTagNames = parseTagInput(elements.tagInput.value);
    if (newTagNames.length === 0) {
        hideTagSuggestions();
        return;
    }

    if (newTagNames.length === 1 && activeTagSuggestionIndex >= 0 && tagSuggestions[activeTagSuggestionIndex]) {
        selectTagSuggestionByIndex(activeTagSuggestionIndex);
        return;
    }

    addTagNames(newTagNames);
}

function handleTagInputKeyDown(event) {
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            moveActiveTagSuggestion(1);
            return;
        case 'ArrowUp':
            event.preventDefault();
            moveActiveTagSuggestion(-1);
            return;
        case 'Escape':
            hideTagSuggestions();
            return;
        case 'Enter':
        case ',':
        case ';':
            event.preventDefault();
            commitTagInput();
            return;
        case 'Backspace':
            if (!elements.tagInput.value.trim() && selectedTags.length > 0) {
                event.preventDefault();
                removeSelectedTag(selectedTags[selectedTags.length - 1]);
            }
            return;
        default:
            return;
    }
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
    tagSuggestions = [];
    activeTagSuggestionIndex = -1;
    hideTagSuggestions();
    setSelectedTags([]);
    clearValidationErrors();
    hideModalError();

    if (resetEditingLinkId) {
        updateState({ editingLinkId: null });
    }
}