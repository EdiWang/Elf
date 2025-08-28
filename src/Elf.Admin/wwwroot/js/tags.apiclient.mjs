import { success, error } from './toastService.mjs';

const API_BASE = '/api/tag';

// Helper function to handle API responses
async function handleResponse(response, successMessage = null) {
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
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    return response;
}

export async function getTags() {
    try {
        const response = await apiRequest(`${API_BASE}/list`);
        return await handleResponse(response);
    } catch (err) {
        console.error('Failed to get tags:', err);
        error('Failed to load tags');
        throw err;
    }
}

export async function createTag(tagData) {
    try {
        const response = await apiRequest(`${API_BASE}`, {
            method: 'POST',
            body: JSON.stringify(tagData)
        });
        
        return await handleResponse(response, 'Tag created successfully');
    } catch (err) {
        console.error('Failed to create tag:', err);
        throw err;
    }
}

export async function updateTag(id, tagData) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(tagData)
        });
        
        return await handleResponse(response, 'Tag updated successfully');
    } catch (err) {
        console.error('Failed to update tag:', err);
        throw err;
    }
}

export async function deleteTag(id) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        return await handleResponse(response, 'Tag deleted successfully');
    } catch (err) {
        console.error('Failed to delete tag:', err);
        throw err;
    }
}