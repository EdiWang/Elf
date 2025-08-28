import { ApiClient } from './apiClient.base.mjs';

const tagClient = new ApiClient('/api/tag');

export async function getTags() {
    return tagClient.get('/list');
}

export async function createTag(tagData) {
    return tagClient.post('', tagData, 'Tag created successfully');
}

export async function updateTag(id, tagData) {
    return tagClient.put(`/${id}`, tagData, 'Tag updated successfully');
}

export async function deleteTag(id) {
    return tagClient.delete(`/${id}`, 'Tag deleted successfully');
}