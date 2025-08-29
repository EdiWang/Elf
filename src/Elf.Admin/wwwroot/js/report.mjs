document.addEventListener('DOMContentLoaded', function () {
    // Initialize date inputs with default values
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const refreshBtn = document.getElementById('refreshChartBtn');
    const refreshSpinner = document.getElementById('refreshSpinner');

    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

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