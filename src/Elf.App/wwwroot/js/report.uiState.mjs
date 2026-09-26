/**
 * UI state management for the report page
 */

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
