import { ApiClient, apiOperation } from './apiClient.base.mjs';

const reportClient = new ApiClient('/api/report');

/**
 * Get recent requests with pagination
 * @param {number} take - Number of records to take
 * @param {number} offset - Number of records to skip
 * @param {number|null} linkId - Optional link ID to filter by
 * @returns {Promise<Object>} PagedRequestTrack object
 */
export async function getRequests(take = 10, offset = 0, linkId = null) {
    return apiOperation(async () => {
        const params = {
            take: take.toString(),
            offset: offset.toString()
        };
        
        if (linkId !== null && linkId !== undefined) {
            params.linkId = linkId.toString();
        }
        
        return await reportClient.get('/requests', params);
    }, 'Failed to get requests');
}

/**
 * Get most requested links for a date range
 * @param {Object} dateRangeRequest - Date range request object
 * @param {string} dateRangeRequest.startDateUtc - Start date in UTC
 * @param {string} dateRangeRequest.endDateUtc - End date in UTC
 * @returns {Promise<Array>} List of MostRequestedLinkCount objects
 */
export async function getMostRequestedLinks(dateRangeRequest) {
    return apiOperation(async () => {
        return await reportClient.post('/requests/link', dateRangeRequest);
    }, 'Failed to get most requested links');
}

/**
 * Get client type counts for a date range
 * @param {Object} dateRangeRequest - Date range request object
 * @param {string} dateRangeRequest.startDateUtc - Start date in UTC
 * @param {string} dateRangeRequest.endDateUtc - End date in UTC
 * @param {number|null} linkId - Optional link ID to filter by specific link
 * @returns {Promise<Array>} List of ClientTypeCount objects
 */
export async function getClientTypeCounts(dateRangeRequest, linkId = null) {
    return apiOperation(async () => {
        const params = {};
        
        if (linkId !== null && linkId !== undefined) {
            params.linkId = linkId.toString();
        }
        
        return await reportClient.post('/requests/clienttype', dateRangeRequest, params);
    }, 'Failed to get client type counts');
}

/**
 * Get link tracking date counts for a date range
 * @param {Object} dateRangeRequest - Date range request object
 * @param {string} dateRangeRequest.startDateUtc - Start date in UTC
 * @param {string} dateRangeRequest.endDateUtc - End date in UTC
 * @param {number|null} linkId - Optional link ID to filter by specific link
 * @returns {Promise<Array>} List of LinkTrackingDateCount objects
 */
export async function getTrackingCounts(dateRangeRequest, linkId = null) {
    return apiOperation(async () => {
        const params = {};
        
        if (linkId !== null && linkId !== undefined) {
            params.linkId = linkId.toString();
        }
        
        return await reportClient.post('/tracking', dateRangeRequest, params);
    }, 'Failed to get tracking counts');
}

/**
 * Clear all tracking data
 * @returns {Promise<void>}
 */
export async function clearTrackingData() {
    return apiOperation(async () => {
        return await reportClient.delete('/tracking/clear', 'Tracking data cleared successfully');
    }, 'Failed to clear tracking data');
}