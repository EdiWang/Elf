import { getTrackingCounts, getClientTypeCounts } from './report.apiclient.mjs';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize date inputs with default values
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const refreshBtn = document.getElementById('refreshChartBtn');
    const refreshSpinner = document.getElementById('refreshSpinner');

    // Chart instances
    let requestsChart = null;
    let clientTypesChart = null;

    // Set default dates (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

    startDateInput.value = sevenDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

    // Initialize charts on page load
    loadRequestsChart();
    loadClientTypesChart();

    // Refresh chart button click handler
    refreshBtn.addEventListener('click', function () {
        if (validateDateRange()) {
            loadRequestsChart();
            loadClientTypesChart();
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

    // Load client types pie chart
    async function loadClientTypesChart() {
        try {
            // Prepare date range request
            const startDateUtc = new Date(startDateInput.value + 'T00:00:00.000Z').toISOString();
            const endDateUtc = new Date(endDateInput.value + 'T23:59:59.999Z').toISOString();

            const dateRangeRequest = {
                startDateUtc: startDateUtc,
                endDateUtc: endDateUtc
            };

            // Get client type data
            const clientTypeData = await getClientTypeCounts(dateRangeRequest);

            // Prepare chart data
            const labels = clientTypeData.map(item => item.clientTypeName);
            const requestCounts = clientTypeData.map(item => item.count);

            // Generate colors for pie chart segments
            const backgroundColors = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(199, 199, 199, 0.8)',
                'rgba(83, 102, 255, 0.8)',
                'rgba(255, 99, 255, 0.8)',
                'rgba(99, 255, 132, 0.8)'
            ];

            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)',
                'rgba(255, 99, 255, 1)',
                'rgba(99, 255, 132, 1)'
            ];

            // Destroy existing chart if it exists
            if (clientTypesChart) {
                clientTypesChart.destroy();
            }

            // Create new pie chart
            const ctx = document.getElementById('clientTypesPieChart').getContext('2d');
            clientTypesChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Request Count',
                        data: requestCounts,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading client types chart:', error);
            // You could add user-friendly error handling here
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