import { getTrackingCounts } from './report.apiclient.mjs';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize date inputs with default values
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const refreshBtn = document.getElementById('refreshChartBtn');
    const refreshSpinner = document.getElementById('refreshSpinner');

    // Chart instance
    let requestsChart = null;

    // Set default dates (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

    startDateInput.value = sevenDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

    // Initialize chart on page load
    loadRequestsChart();

    // Refresh chart button click handler
    refreshBtn.addEventListener('click', function() {
        if (validateDateRange()) {
            loadRequestsChart();
        }
    });

    // Load requests line chart
    async function loadRequestsChart() {
        try {
            // Show loading state
            refreshSpinner.classList.remove('d-none');
            refreshBtn.disabled = true;

            // Prepare date range request
            const startDateUtc = new Date(startDateInput.value + 'T00:00:00.000Z').toISOString();
            const endDateUtc = new Date(endDateInput.value + 'T23:59:59.999Z').toISOString();
            
            const dateRangeRequest = {
                startDateUtc: startDateUtc,
                endDateUtc: endDateUtc
            };

            // Get tracking data
            const trackingData = await getTrackingCounts(dateRangeRequest);

            // Sort data by date
            trackingData.sort((a, b) => new Date(a.trackingDateUtc) - new Date(b.trackingDateUtc));

            // Prepare chart data
            const labels = trackingData.map(item => {
                const date = new Date(item.trackingDateUtc);
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
            });

            const requestCounts = trackingData.map(item => item.requestCount);

            // Destroy existing chart if it exists
            if (requestsChart) {
                requestsChart.destroy();
            }

            // Create new chart
            const ctx = document.getElementById('requestsLineChart').getContext('2d');
            requestsChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Requests',
                        data: requestCounts,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Hide legend as requested
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading requests chart:', error);
            // You could add user-friendly error handling here
        } finally {
            // Hide loading state
            refreshSpinner.classList.add('d-none');
            refreshBtn.disabled = false;
        }
    }

    // Validate date range
    function validateDateRange() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        // Clear previous errors
        startDateInput.classList.remove('is-invalid');
        endDateInput.classList.remove('is-invalid');
        document.getElementById('startDateError').textContent = '';
        document.getElementById('endDateError').textContent = '';

        let isValid = true;

        if (!startDateInput.value) {
            startDateInput.classList.add('is-invalid');
            document.getElementById('startDateError').textContent = 'Start date is required.';
            isValid = false;
        }

        if (!endDateInput.value) {
            endDateInput.classList.add('is-invalid');
            document.getElementById('endDateError').textContent = 'End date is required.';
            isValid = false;
        }

        if (startDateInput.value && endDateInput.value && endDate < startDate) {
            endDateInput.classList.add('is-invalid');
            document.getElementById('endDateError').textContent = 'End date must be greater than or equal to start date.';
            isValid = false;
        }

        return isValid;
    }

    // Validate dates on change
    startDateInput.addEventListener('change', function () {
        if (endDateInput.value) {
            validateDateRange();
        }
    });

    endDateInput.addEventListener('change', function () {
        if (startDateInput.value) {
            validateDateRange();
        }
    });
});