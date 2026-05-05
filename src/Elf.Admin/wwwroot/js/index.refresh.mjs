import { loadLinks } from './index.links.mjs';
import { elements } from './index.dom.mjs';

export function setupRefreshEventListeners() {
    elements.refreshBtn.addEventListener('click', handleRefresh);
}

async function handleRefresh() {
    elements.refreshBtn.disabled = true;
    
    try {
        await loadLinks();
    } catch (error) {
        console.error('Error refreshing links:', error);
    } finally {
        elements.refreshBtn.disabled = false;
    }
}