/**
 * UI state management for the report page
 */

/**
 * Show or hide loading state
 * @param {boolean} isLoading - Whether to show loading state
 * @param {HTMLElement} refreshBtn - Refresh button element
 * @param {HTMLElement} refreshSpinner - Refresh spinner element
 */
export function setLoadingState(isLoading, refreshBtn, refreshSpinner) {
    if (isLoading) {
        refreshSpinner.classList.remove('d-none');
        refreshBtn.disabled = true;
    } else {
        refreshSpinner.classList.add('d-none');
        refreshBtn.disabled = false;
    }
}

/**
 * Handle errors with logging and optional user feedback
 * @param {Error} error - The error that occurred
 * @param {string} context - Context where the error occurred
 */
export function handleError(error, context) {
    console.error(`Error ${context}:`, error);
    // You could add user-friendly error handling here
    // For example: show a toast notification or error banner
}