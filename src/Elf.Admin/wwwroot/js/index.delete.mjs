import { deleteLink } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState } from './index.state.js';
import { loadLinks } from './index.links.js';

export function setupDeleteEventListeners() {
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
}

export function showDeleteModal(linkId, token, url) {
    updateState({ linkToDelete: linkId });
    elements.deleteTokenPreview.textContent = token;
    elements.deleteUrlPreview.textContent = url;
    elements.deleteModal.show();
}

export async function handleConfirmDelete() {
    if (!state.linkToDelete) return;

    try {
        await deleteLink(parseInt(state.linkToDelete));
        elements.deleteModal.hide();

        // Reload current page
        await loadLinks();

        updateState({ linkToDelete: null });
    } catch (error) {
        console.error('Error deleting link:', error);
    }
}