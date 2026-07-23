import { Alpine } from './alpine-init.mjs';
import { getAccount, updateAccount, resetAuthenticator } from './account.apiclient.mjs';
import { createDialogController } from './dialogService.mjs';
import { error } from './toastService.mjs';

Alpine.data('accountManager', () => ({
    profile: {
        username: '',
        isTotpConfigured: false
    },
    isSaving: false,
    isResetting: false,
    resetDialog: null,
    validation: {
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        resetCurrentPassword: ''
    },

    async init() {
        this.resetDialog = createDialogController(this.$refs.resetAuthenticatorDialog);
        this.$refs.credentialsForm?.addEventListener('submit', event => {
            event.preventDefault();
            void this.saveCredentials();
        });
        this.$refs.showResetAuthenticatorButton?.addEventListener('click', () => this.showResetDialog());
        this.$refs.confirmResetAuthenticatorButton?.addEventListener('click', () => {
            void this.confirmResetAuthenticator();
        });
        this.$refs.resetAuthenticatorForm?.addEventListener('submit', event => {
            event.preventDefault();
            void this.confirmResetAuthenticator();
        });

        this.bindValidationClearEvents();
        await this.loadProfile();
    },

    get totpStatus() {
        return this.profile.isTotpConfigured ? 'Configured' : 'Setup required';
    },

    async loadProfile() {
        try {
            const profile = await getAccount();
            this.profile = profile ?? this.profile;
            this.syncProfileInputs();
        } catch (err) {
            console.error('Error loading account profile:', err);
            error('Failed to load account profile.');
        }
    },

    async saveCredentials() {
        if (this.isSaving) return;

        const request = this.readCredentialsForm();
        if (!this.validateCredentials(request)) return;

        this.isSaving = true;
        this.syncSavingState();

        try {
            await updateAccount({
                username: request.username,
                currentPassword: request.currentPassword,
                newPassword: request.newPassword || null
            });
            this.profile.username = request.username;
            this.clearCredentialPasswords();
        } catch (err) {
            console.error('Error updating local account:', err);
        } finally {
            this.isSaving = false;
            this.syncSavingState();
        }
    },

    showResetDialog() {
        this.validation.resetCurrentPassword = '';
        this.setInvalid(this.$refs.resetCurrentPassword, false);
        if (this.$refs.resetCurrentPassword) {
            this.$refs.resetCurrentPassword.value = '';
        }
        this.resetDialog.show();
        this.$nextTick(() => this.$refs.resetCurrentPassword?.focus());
    },

    async confirmResetAuthenticator() {
        if (this.isResetting) return;

        const currentPassword = this.$refs.resetCurrentPassword?.value ?? '';
        if (!this.validateReset(currentPassword)) return;

        this.isResetting = true;
        this.syncResettingState();

        try {
            await resetAuthenticator({ currentPassword });
            window.location.assign('/auth/signin');
        } catch (err) {
            console.error('Error resetting authenticator:', err);
            this.isResetting = false;
            this.syncResettingState();
        }
    },

    readCredentialsForm() {
        return {
            username: this.$refs.username?.value?.trim() ?? '',
            currentPassword: this.$refs.currentPassword?.value ?? '',
            newPassword: this.$refs.newPassword?.value ?? '',
            confirmPassword: this.$refs.confirmPassword?.value ?? ''
        };
    },

    validateCredentials(request) {
        this.clearValidation(['username', 'currentPassword', 'newPassword', 'confirmPassword']);

        if (request.username.length < 2 || request.username.length > 64) {
            this.validation.username = 'Username must be between 2 and 64 characters.';
        }

        if (!request.currentPassword) {
            this.validation.currentPassword = 'Current password is required.';
        }

        if (request.newPassword && request.newPassword.length < 8) {
            this.validation.newPassword = 'New password must be at least 8 characters.';
        }

        if (request.newPassword !== request.confirmPassword) {
            this.validation.confirmPassword = 'Passwords do not match.';
        }

        this.syncValidationState();
        return !this.hasValidationErrors(['username', 'currentPassword', 'newPassword', 'confirmPassword']);
    },

    validateReset(currentPassword) {
        this.clearValidation(['resetCurrentPassword']);

        if (!currentPassword) {
            this.validation.resetCurrentPassword = 'Current password is required.';
        }

        this.syncValidationState();
        return !this.validation.resetCurrentPassword;
    },

    bindValidationClearEvents() {
        [
            ['username', this.$refs.username],
            ['currentPassword', this.$refs.currentPassword],
            ['newPassword', this.$refs.newPassword],
            ['confirmPassword', this.$refs.confirmPassword],
            ['resetCurrentPassword', this.$refs.resetCurrentPassword]
        ].forEach(([key, element]) => {
            element?.addEventListener('input', () => {
                this.validation[key] = '';
                this.setInvalid(element, false);
            });
        });
    },

    clearValidation(keys) {
        keys.forEach(key => {
            this.validation[key] = '';
        });
    },

    hasValidationErrors(keys) {
        return keys.some(key => Boolean(this.validation[key]));
    },

    syncValidationState() {
        this.setInvalid(this.$refs.username, Boolean(this.validation.username));
        this.setInvalid(this.$refs.currentPassword, Boolean(this.validation.currentPassword));
        this.setInvalid(this.$refs.newPassword, Boolean(this.validation.newPassword));
        this.setInvalid(this.$refs.confirmPassword, Boolean(this.validation.confirmPassword));
        this.setInvalid(this.$refs.resetCurrentPassword, Boolean(this.validation.resetCurrentPassword));
    },

    setInvalid(element, isInvalid) {
        if (!element) return;

        if (isInvalid) {
            element.setAttribute('aria-invalid', 'true');
        } else {
            element.removeAttribute('aria-invalid');
        }
    },

    syncProfileInputs() {
        this.$nextTick(() => {
            if (this.$refs.username) {
                this.$refs.username.value = this.profile.username ?? '';
            }
        });
    },

    clearCredentialPasswords() {
        if (this.$refs.currentPassword) this.$refs.currentPassword.value = '';
        if (this.$refs.newPassword) this.$refs.newPassword.value = '';
        if (this.$refs.confirmPassword) this.$refs.confirmPassword.value = '';
    },

    syncSavingState() {
        if (this.$refs.saveCredentialsButton) {
            this.$refs.saveCredentialsButton.disabled = this.isSaving;
        }
    },

    syncResettingState() {
        if (this.$refs.confirmResetAuthenticatorButton) {
            this.$refs.confirmResetAuthenticatorButton.disabled = this.isResetting;
        }
    }
}));
