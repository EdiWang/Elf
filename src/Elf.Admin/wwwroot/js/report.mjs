import { Alpine } from './alpine-init.mjs';
import { setDefaultDates, validateDateRange, setupDateValidation } from './report.dateUtils.mjs';
import { loadRequestsChart, loadClientTypesChart, loadMostRequestedLinksChart } from './report.chartLoaders.mjs';
import { loadRecentRequestsTable } from './report.trackingRecords.mjs';

Alpine.data('reportDashboard', () => ({
    isRefreshing: false,

    init() {
        setDefaultDates(this.$refs.startDate, this.$refs.endDate);
        setupDateValidation(this.$refs.startDate, this.$refs.endDate);

        this.$refs.refreshButton?.addEventListener('click', () => this.refresh());
        this.refresh();
    },

    async refresh() {
        if (!validateDateRange(this.$refs.startDate, this.$refs.endDate)) {
            return;
        }

        await this.loadReport();
    },

    async loadReport() {
        this.isRefreshing = true;
        this.syncRefreshButtonState();

        try {
            const loaders = [
                loadRequestsChart(this.$refs.startDate, this.$refs.endDate),
                loadClientTypesChart(this.$refs.startDate, this.$refs.endDate),
                loadRecentRequestsTable()
            ];

            if (!window.reportPageData?.linkId) {
                loaders.push(loadMostRequestedLinksChart(this.$refs.startDate, this.$refs.endDate));
            }

            await Promise.all(loaders);
        } finally {
            this.isRefreshing = false;
            this.syncRefreshButtonState();
        }
    },

    syncRefreshButtonState() {
        const refreshButton = this.$refs.refreshButton;
        if (!refreshButton) {
            return;
        }

        refreshButton.disabled = this.isRefreshing;
        refreshButton.toggleAttribute('disabled', this.isRefreshing);
    }
}));
