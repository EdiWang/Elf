import { success, error } from './toastService.mjs';

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
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
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
            let url = `${this.apiBase}${endpoint}`;
            if (params) {
                const searchParams = new URLSearchParams(params);
                url += `?${searchParams}`;
            }
            const response = await apiRequest(url);
            return await handleResponse(response);
        }, `Failed to get from ${endpoint}`);
    }

    async post(endpoint = '', data = null, successMessage = null) {
        return apiOperation(async () => {
            const response = await apiRequest(`${this.apiBase}${endpoint}`, {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined
            });
            return await handleResponse(response, successMessage);
        }, `Failed to post to ${endpoint}`);
    }

    async put(endpoint = '', data = null, successMessage = null) {
        return apiOperation(async () => {
            const response = await apiRequest(`${this.apiBase}${endpoint}`, {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined
            });
            return await handleResponse(response, successMessage);
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