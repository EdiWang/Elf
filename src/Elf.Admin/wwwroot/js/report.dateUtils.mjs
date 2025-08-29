/**
 * Date utility functions for the report page
 */

/**
 * Create a date range request object from input values
 * @param {string} startDateValue - Start date input value
 * @param {string} endDateValue - End date input value
 * @returns {Object} Date range request object
 */
export function createDateRangeRequest(startDateValue, endDateValue) {
    const startDateUtc = new Date(startDateValue + 'T00:00:00.000Z').toISOString();
    const endDateUtc = new Date(endDateValue + 'T23:59:59.999Z').toISOString();

    return {
        startDateUtc: startDateUtc,
        endDateUtc: endDateUtc
    };
}

/**
 * Set default date values (last 7 days) to date inputs
 * @param {HTMLInputElement} startDateInput - Start date input element
 * @param {HTMLInputElement} endDateInput - End date input element
 */
export function setDefaultDates(startDateInput, endDateInput) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));

    startDateInput.value = sevenDaysAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];
}

/**
 * Validate date range inputs
 * @param {HTMLInputElement} startDateInput - Start date input element
 * @param {HTMLInputElement} endDateInput - End date input element
 * @returns {boolean} True if validation passes
 */
export function validateDateRange(startDateInput, endDateInput) {
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

/**
 * Setup date validation event listeners
 * @param {HTMLInputElement} startDateInput - Start date input element
 * @param {HTMLInputElement} endDateInput - End date input element
 */
export function setupDateValidation(startDateInput, endDateInput) {
    startDateInput.addEventListener('change', function () {
        if (endDateInput.value) {
            validateDateRange(startDateInput, endDateInput);
        }
    });

    endDateInput.addEventListener('change', function () {
        if (startDateInput.value) {
            validateDateRange(startDateInput, endDateInput);
        }
    });
}