import { ApiClient } from './apiClient.base.mjs';

const accountClient = new ApiClient('/api/account');

export async function getAccount() {
    return accountClient.get('');
}

export async function updateAccount(accountData) {
    return accountClient.put('', accountData, 'Account updated successfully');
}

export async function resetAuthenticator(resetData) {
    return accountClient.post('/reset-authenticator', resetData, 'Authenticator reset successfully');
}
