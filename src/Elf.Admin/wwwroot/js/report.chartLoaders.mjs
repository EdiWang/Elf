/**
 * Chart data loading functions for the report page
 */

import { getTrackingCounts, getClientTypeCounts } from './report.apiclient.mjs';
import { createRequestsLineChart, createClientTypesPieChart } from './report.charts.mjs';
import { createDateRangeRequest } from './report.dateUtils.mjs';
import { setLoadingState, handleError } from './report.uiState.mjs';

/**
 * Load and display the requests line chart
 * @param {HTMLInputElement} startDateInput - Start date input element
 * @param {HTMLInputElement} endDateInput - End date input element
 * @param {HTMLElement} refreshBtn - Refresh button element
 * @param {HTMLElement} refreshSpinner - Refresh spinner element
 */
export async function loadRequestsChart(startDateInput, endDateInput, refreshBtn, refreshSpinner) {
    try {
        // Show loading state
        setLoadingState(true, refreshBtn, refreshSpinner);

        // Prepare date range request
        const dateRangeRequest = createDateRangeRequest(startDateInput.value, endDateInput.value);

        // Get tracking data
        const trackingData = await getTrackingCounts(dateRangeRequest);

        // Create chart
        createRequestsLineChart(trackingData);

    } catch (error) {
        handleError(error, 'loading requests chart');
    } finally {
        // Hide loading state
        setLoadingState(false, refreshBtn, refreshSpinner);
    }
}

/**
 * Load and display the client types pie chart
 * @param {HTMLInputElement} startDateInput - Start date input element
 * @param {HTMLInputElement} endDateInput - End date input element
 */
export async function loadClientTypesChart(startDateInput, endDateInput) {
    try {
        // Prepare date range request
        const dateRangeRequest = createDateRangeRequest(startDateInput.value, endDateInput.value);

        // Get client type data
        const clientTypeData = await getClientTypeCounts(dateRangeRequest);

        // Create chart
        createClientTypesPieChart(clientTypeData);

    } catch (error) {
        handleError(error, 'loading client types chart');
    }
}