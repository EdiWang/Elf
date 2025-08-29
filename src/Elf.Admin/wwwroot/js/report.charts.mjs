/**
 * Chart management utilities for the report page
 */

// Chart color schemes
const PIE_CHART_COLORS = {
    background: [
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
    ],
    border: [
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
    ]
};

// Chart instances
let requestsChart = null;
let clientTypesChart = null;

/**
 * Create or update the requests line chart
 * @param {Array} trackingData - Array of tracking data objects
 */
export function createRequestsLineChart(trackingData) {
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
}

/**
 * Create or update the client types pie chart
 * @param {Array} clientTypeData - Array of client type data objects
 */
export function createClientTypesPieChart(clientTypeData) {
    // Prepare chart data
    const labels = clientTypeData.map(item => item.clientTypeName);
    const requestCounts = clientTypeData.map(item => item.count);

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
                backgroundColor: PIE_CHART_COLORS.background.slice(0, labels.length),
                borderColor: PIE_CHART_COLORS.border.slice(0, labels.length),
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
}

/**
 * Destroy all chart instances
 */
export function destroyAllCharts() {
    if (requestsChart) {
        requestsChart.destroy();
        requestsChart = null;
    }
    
    if (clientTypesChart) {
        clientTypesChart.destroy();
        clientTypesChart = null;
    }
}