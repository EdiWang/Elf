import { success, error } from './toastService.mjs';

const API_BASE = '/api/link';

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

export async function createLink(linkData) {
    try {
        const response = await apiRequest(`${API_BASE}/create`, {
            method: 'POST',
            body: JSON.stringify(linkData)
        });
        
        return await handleResponse(response, 'Link created successfully');
    } catch (err) {
        console.error('Failed to create link:', err);
        throw err;
    }
}

export async function editLink(id, linkData) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(linkData)
        });
        
        return await handleResponse(response, 'Link updated successfully');
    } catch (err) {
        console.error('Failed to edit link:', err);
        throw err;
    }
}

export async function setLinkEnabled(id, isEnabled) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}/enable?isEnabled=${isEnabled}`, {
            method: 'PUT'
        });
        
        const action = isEnabled ? 'enabled' : 'disabled';
        return await handleResponse(response, `Link ${action} successfully`);
    } catch (err) {
        console.error('Failed to set link enabled state:', err);
        throw err;
    }
}

export async function getLinks(term = '', take = 10, offset = 0) {
    try {
        const params = new URLSearchParams({
            term: term || '',
            take: take.toString(),
            offset: offset.toString()
        });
        
        const response = await apiRequest(`${API_BASE}/list?${params}`);
        return await handleResponse(response);
    } catch (err) {
        console.error('Failed to get links:', err);
        error('Failed to load links');
        throw err;
    }
}

export async function getLinksByTags(request) {
    try {
        const response = await apiRequest(`${API_BASE}/list/tags`, {
            method: 'POST',
            body: JSON.stringify(request)
        });
        
        return await handleResponse(response);
    } catch (err) {
        console.error('Failed to get links by tags:', err);
        error('Failed to load links by tags');
        throw err;
    }
}

export async function getLink(id) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}`);
        return await handleResponse(response);
    } catch (err) {
        console.error('Failed to get link:', err);
        error('Failed to load link');
        throw err;
    }
}

export async function deleteLink(id) {
    try {
        const response = await apiRequest(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        return await handleResponse(response, 'Link deleted successfully');
    } catch (err) {
        console.error('Failed to delete link:', err);
        throw err;
    }
}