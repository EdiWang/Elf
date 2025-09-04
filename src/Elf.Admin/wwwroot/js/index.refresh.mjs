import { loadLinks } from './index.links.mjs';
import { elements } from './index.dom.mjs';

export function setupRefreshEventListeners() {
    elements.refreshBtn.addEventListener('click', handleRefresh);
}

async function handleRefresh() {
    // Add visual feedback for the refresh action
    const refreshIcon = elements.refreshBtn.querySelector('i');
    const originalClass = refreshIcon.className;
    
    // Add spinning animation
    refreshIcon.className = 'bi bi-arrow-clockwise';
    elements.refreshBtn.disabled = true;
    
    try {
        await loadLinks();
    } catch (error) {
        console.error('Error refreshing links:', error);
    } finally {
        // Restore button state
        refreshIcon.className = originalClass;
        elements.refreshBtn.disabled = false;
    }
}