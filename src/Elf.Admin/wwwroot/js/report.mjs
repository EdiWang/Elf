import { setDefaultDates, validateDateRange, setupDateValidation } from './report.dateUtils.mjs';
import { loadRequestsChart, loadClientTypesChart } from './report.chartLoaders.mjs';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize DOM elements
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const refreshBtn = document.getElementById('refreshChartBtn');
    const refreshSpinner = document.getElementById('refreshSpinner');

    // Set default dates (last 7 days)
    setDefaultDates(startDateInput, endDateInput);

    // Setup date validation
    setupDateValidation(startDateInput, endDateInput);

    // Initialize charts on page load
    loadRequestsChart(startDateInput, endDateInput, refreshBtn, refreshSpinner);
    loadClientTypesChart(startDateInput, endDateInput);

    // Refresh chart button click handler
    refreshBtn.addEventListener('click', function () {
        if (validateDateRange(startDateInput, endDateInput)) {
            loadRequestsChart(startDateInput, endDateInput, refreshBtn, refreshSpinner);
            loadClientTypesChart(startDateInput, endDateInput);
        }
    });
});