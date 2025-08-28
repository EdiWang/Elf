import { ApiClient, apiOperation, apiRequest, handleResponse } from './apiClient.base.mjs';

const linkClient = new ApiClient('/api/link');

export async function createLink(linkData) {
    return linkClient.post('/create', linkData, 'Link created successfully');
}

export async function editLink(id, linkData) {
    return linkClient.put(`/${id}`, linkData, 'Link updated successfully');
}

export async function setLinkEnabled(id, isEnabled) {
    return apiOperation(async () => {
        const response = await apiRequest(`/api/link/${id}/enable?isEnabled=${isEnabled}`, {
            method: 'PUT'
        });
        
        const action = isEnabled ? 'enabled' : 'disabled';
        return await handleResponse(response, `Link ${action} successfully`);
    }, 'Failed to set link enabled state');
}

export async function getLinks(term = '', take = 10, offset = 0) {
    return apiOperation(async () => {
        const params = {
            term: term || '',
            take: take.toString(),
            offset: offset.toString()
        };
        
        const result = await linkClient.get('/list', params);
        return result;
    }, 'Failed to get links');
}

export async function getLinksByTags(request) {
    return apiOperation(async () => {
        const result = await linkClient.post('/list/tags', request);
        return result;
    }, 'Failed to get links by tags');
}

export async function getLink(id) {
    return apiOperation(async () => {
        const result = await linkClient.get(`/${id}`);
        return result;
    }, 'Failed to get link');
}

export async function deleteLink(id) {
    return linkClient.delete(`/${id}`, 'Link deleted successfully');
}