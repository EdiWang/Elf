import { getLinks, setLinkEnabled } from '/js/links.apiclient.mjs';
import { elements } from './index.dom.mjs';
import { state, updateState, getOffset } from './index.state.mjs';
import { updatePagination } from './index.pagination.mjs';
import { showDeleteModal } from './index.delete.mjs';
import { showLinkEditModal } from './index.linkEdit.mjs';
import { escapeHtml } from './index.utils.mjs';
import { success as showSuccessToast, error as showErrorToast } from './toastService.mjs';

const TOOLBAR_ACTION_BUTTONS = [
    'reportActionBtn',
    'qrActionBtn',
    'copyActionBtn',
    'editActionBtn',
    'deleteActionBtn'
];

export function setupToolbarActionEventListeners() {
    elements.reportActionBtn.addEventListener('click', handleReportAction);
    elements.qrActionBtn.addEventListener('click', handleQrAction);
    elements.copyActionBtn.addEventListener('click', () => {
        void handleCopyAction();
    });
    elements.editActionBtn.addEventListener('click', () => {
        void handleEditAction();
    });
    elements.deleteActionBtn.addEventListener('click', handleDeleteAction);

    syncToolbarActionState();
}

export async function loadLinks() {
    // Check if we should use tag search instead
    if (state.searchMode === 'tags' && state.selectedTagIds && state.selectedTagIds.length > 0) {
        const { loadLinksByTags } = await import('./index.tagSearch.mjs');
        await loadLinksByTags();
        return;
    }
    
    try {
        showLoading(true);
        const response = await getLinks(state.currentSearchTerm, state.pageSize, getOffset());

        displayLinks(response.links);
        updatePagination(response.totalRows);
        showNoData(response.links.length === 0);

    } catch (error) {
        console.error('Error loading links:', error);
        showNoData(true);
    } finally {
        showLoading(false);
    }
}

export function showLoading(show) {
    elements.loadingSpinner.classList.toggle('d-none', !show);
    elements.linksData.style.opacity = show ? '0.5' : '1';
}

export function showNoData(show) {
    elements.noDataMessage.classList.toggle('d-none', !show);
    elements.paginationContainer.classList.toggle('d-none', show);
}

export function displayLinks(links) {
    clearSelectedLink();
    elements.linksData.innerHTML = '';

    links.forEach(link => {
        const linkRow = createLinkRow(link);
        elements.linksData.appendChild(linkRow);
    });
}

function createLinkRow(link) {
    const row = document.createElement('tr');
    row.className = 'fluent-table-row link-table-row';
    row.setAttribute('data-link-id', link.id);
    row.tabIndex = 0;
    row.setAttribute('aria-selected', 'false');

    const statusToggle = `
        <fluent-switch class="status-toggle" id="status-${link.id}" ${link.isEnabled ? 'checked' : ''} data-link-id="${link.id}" title="${link.isEnabled ? 'Enabled' : 'Disabled'}" aria-label="Toggle link status"></fluent-switch>
    `;

    const updateDate = new Date(link.updateTimeUtc).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    // Create tags badges
    const tagsBadges = link.tags && link.tags.length > 0
        ? link.tags.map(tag => `<fluent-badge appearance="filled">${escapeHtml(tag.name)}</fluent-badge>`).join('')
        : '<span class="muted-text">(no tags)</span>';

    row.innerHTML = `
                    <td class="token-cell">
                        <a href="${getForwarderUrl(link.fwToken)}" target="_blank" class="code-link-token">
                            <code>
                                ${escapeHtml(link.fwToken)}
                            </code>
                        </a>
                    </td>
                    <td class="aka-cell">
                        ${link.akaName 
                            ? `<a href="${getAkaForwarderUrl(link.akaName)}" target="_blank">
                                    <code>${escapeHtml(link.akaName)}</code>
                               </a>` 
                            : `<span class="muted-text">(none)</span>`
                        }
                    </td>
                    <td class="url-cell">
                        <a class="fluent-table-text-cell" href="${escapeHtml(link.originUrl)}" target="_blank" title="${escapeHtml(link.originUrl)}">
                            ${escapeHtml(link.originUrl)}
                        </a>
                    </td>
                    <td class="note-cell">
                        <span class="fluent-table-text-cell" title="${escapeHtml(link.note || 'No note')}">${escapeHtml(link.note || 'No note')}</span>
                    </td>
                    <td>
                        <div class="tag-list">
                        ${tagsBadges}
                        </div>
                    </td>
                    <td class="status-cell">${statusToggle}</td>
                    <td class="metric-cell">
                        <span class="ttl-container">
                            ${link.ttl}
                        </span>
                    </td>
                    <td class="metric-cell">
                        <div class="link-hits-container">
                            ${link.hits}
                        </div>
                    </td>
                    <td class="date-cell">
                        <span class="muted-text">${updateDate}</span>
                    </td>
            `;

    row.addEventListener('click', function (e) {
        if (isInteractiveTarget(e.target)) {
            return;
        }

        selectLink(row, link);
    });

    row.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') {
            return;
        }

        if (isInteractiveTarget(e.target)) {
            return;
        }

        e.preventDefault();
        selectLink(row, link);
    });

    row.addEventListener('change', async function (e) {
        if (e.target.classList.contains('status-toggle')) {
            const toggle = e.target;
            const linkId = parseInt(toggle.getAttribute('data-link-id'));
            const isEnabled = toggle.checked;
            
            // Disable the toggle while processing
            toggle.disabled = true;
            
            try {
                await setLinkEnabled(linkId, isEnabled);
                // Update the title attribute to reflect the new state
                toggle.title = isEnabled ? 'Enabled' : 'Disabled';
            } catch (error) {
                console.error('Failed to update link status:', error);
                // Revert the toggle state on failure
                toggle.checked = !isEnabled;
                showErrorToast('Failed to update link status');
            } finally {
                toggle.disabled = false;
            }
        }
    });

    return row;
}

function isInteractiveTarget(target) {
    if (!(target instanceof Element)) {
        return false;
    }

    return Boolean(target.closest('a, button, input, textarea, select, fluent-switch, fluent-button, [role="button"], [role="link"], [role="switch"]'));
}

function selectLink(row, link) {
    const selectedRows = elements.linksData.querySelectorAll('.link-table-row.is-selected');
    for (const selectedRow of selectedRows) {
        selectedRow.classList.remove('is-selected');
        selectedRow.setAttribute('aria-selected', 'false');
    }

    row.classList.add('is-selected');
    row.setAttribute('aria-selected', 'true');

    updateState({
        selectedLink: {
            id: link.id,
            fwToken: link.fwToken,
            originUrl: link.originUrl,
            akaName: link.akaName ?? null
        }
    });

    syncToolbarActionState();
}

function clearSelectedLink() {
    const selectedRows = elements.linksData.querySelectorAll('.link-table-row.is-selected');
    for (const selectedRow of selectedRows) {
        selectedRow.classList.remove('is-selected');
        selectedRow.setAttribute('aria-selected', 'false');
    }

    updateState({ selectedLink: null });
    syncToolbarActionState();
}

function syncToolbarActionState() {
    const hasSelection = Boolean(state.selectedLink);

    for (const buttonName of TOOLBAR_ACTION_BUTTONS) {
        const button = elements[buttonName];
        if (button) {
            button.disabled = !hasSelection;
        }
    }
}

function handleReportAction() {
    if (!state.selectedLink) {
        return;
    }

    window.open(`/Report?linkId=${state.selectedLink.id}`, '_blank');
}

function handleQrAction() {
    if (!state.selectedLink) {
        return;
    }

    showQRCodeModal(state.selectedLink.fwToken);
}

async function handleCopyAction() {
    if (!state.selectedLink) {
        return;
    }

    await copyLinkToClipboard(state.selectedLink.fwToken);
}

async function handleEditAction() {
    if (!state.selectedLink) {
        return;
    }

    await showLinkEditModal(state.selectedLink.id);
}

function handleDeleteAction() {
    if (!state.selectedLink) {
        return;
    }

    showDeleteModal(state.selectedLink.id, state.selectedLink.fwToken, state.selectedLink.originUrl);
}

export function showQRCodeModal(fwToken) {
    const url = getForwarderUrl(fwToken);
    const modal = document.getElementById('qrCodeModal');
    
    // Update the URL text
    document.getElementById('qrCodeUrl').textContent = url;
    
    // Generate QR code
    const canvas = document.getElementById('qrCodeCanvas');
    const qr = new QRious({
        element: canvas,
        value: url,
        size: 256,
        foreground: '#000000',
        background: '#ffffff'
    });
    
    modal.show();
}

async function copyLinkToClipboard(fwToken) {
    try {
        const url = getForwarderUrl(fwToken);
        await navigator.clipboard.writeText(url);
        showSuccessToast('Link copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = getForwarderUrl(fwToken);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessToast('Link copied to clipboard!');
        } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            showErrorToast('Failed to copy link to clipboard');
        }
    }
}

function getBaseUrl() {
    const baseUrl = window.appConfig?.forwarderBaseUrl || document.documentElement.dataset.forwarderBaseUrl || '';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function getForwarderUrl(token) {
    return `${getBaseUrl()}/fw/${encodeURIComponent(token)}`;
}

function getAkaForwarderUrl(aka) {
    return `${getBaseUrl()}/aka/${encodeURIComponent(aka)}`;
}