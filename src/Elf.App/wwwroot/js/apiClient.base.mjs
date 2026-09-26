import { success, error } from './toastService.mjs';

function buildUrl(apiBase, endpoint = '', params = null) {
    let url = `${apiBase}${endpoint}`;

    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams}`;
    }

    return url;
}

function normalizeRequestOptions(paramsOrSuccessMessage = null, successMessage = null) {
    if (typeof paramsOrSuccessMessage === 'string' || paramsOrSuccessMessage === null || paramsOrSuccessMessage === undefined) {
        return {
            params: null,
            successMessage: paramsOrSuccessMessage ?? successMessage
        };
    }

    return {
        params: paramsOrSuccessMessage,
        successMessage
    };
}

function getAntiforgeryToken() {
    return document.querySelector('#antiforgeryTokenHost input[name="__RequestVerificationToken"]')?.value
        ?? document.querySelector('input[name="__RequestVerificationToken"]')?.value
        ?? '';
}

function shouldSendAntiforgeryToken(method) {
    return !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method.toUpperCase());
}

// Helper function to handle API responses
export async function handleResponse(response, successMessage = null) {
    if (response.ok) {
        if (successMessage) {
            success(successMessage);
        }
        
        // Return JSON data if response has content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return null;
    } else {
        const errorText = await response.text() || `Error ${response.status}: ${response.statusText}`;
        error(errorText);
        throw new Error(errorText);
    }
}

// Helper function to make API requests
export async function apiRequest(url, options = {}) {
    const method = options.method ?? 'GET';
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (shouldSendAntiforgeryToken(method) && !headers.RequestVerificationToken) {
        const token = getAntiforgeryToken();
        if (token) {
            headers.RequestVerificationToken = token;
        }
    }

    const response = await fetch(url, { ...options, headers });
    return response;
}

// Generic API operation wrapper
export async function apiOperation(operation, errorMessage) {
    try {
        return await operation();
    } catch (err) {
        console.error(errorMessage, err);
        throw err;
    }
}

// Common CRUD operations
export class ApiClient {
    constructor(apiBase) {
        this.apiBase = apiBase;
    }

    async get(endpoint = '', params = null) {
        return apiOperation(async () => {
            const url = buildUrl(this.apiBase, endpoint, params);
            const response = await apiRequest(url);
            return await handleResponse(response);
        }, `Failed to get from ${endpoint}`);
    }

    async post(endpoint = '', data = null, paramsOrSuccessMessage = null, successMessage = null) {
        return apiOperation(async () => {
            const requestOptions = normalizeRequestOptions(paramsOrSuccessMessage, successMessage);
            const url = buildUrl(this.apiBase, endpoint, requestOptions.params);
            const response = await apiRequest(url, {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined
            });
            return await handleResponse(response, requestOptions.successMessage);
        }, `Failed to post to ${endpoint}`);
    }

    async put(endpoint = '', data = null, paramsOrSuccessMessage = null, successMessage = null) {
        return apiOperation(async () => {
            const requestOptions = normalizeRequestOptions(paramsOrSuccessMessage, successMessage);
            const url = buildUrl(this.apiBase, endpoint, requestOptions.params);
            const response = await apiRequest(url, {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined
            });
            return await handleResponse(response, requestOptions.successMessage);
        }, `Failed to put to ${endpoint}`);
    }

    async delete(endpoint = '', successMessage = null) {
        return apiOperation(async () => {
            const response = await apiRequest(`${this.apiBase}${endpoint}`, {
                method: 'DELETE'
            });
            return await handleResponse(response, successMessage);
        }, `Failed to delete from ${endpoint}`);
    }
}
