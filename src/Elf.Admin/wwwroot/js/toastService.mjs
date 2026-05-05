const toastKinds = ['success', 'warning', 'danger', 'info'];

// Cache DOM elements
const liveToast = document.getElementById('liveToast');
const blogtoastMessage = document.getElementById('blogtoast-message');
const toastCloseBtn = document.getElementById('toastCloseBtn');
let hideTimer = null;

function clearToastKind(toastElement) {
    toastKinds.forEach(kind => toastElement.classList.remove(kind));
}

function showToast(message, kind) {
    if (!liveToast || !blogtoastMessage) return;

    if (!toastKinds.includes(kind)) kind = 'info';

    clearToastKind(liveToast);
    liveToast.classList.add(kind);
    blogtoastMessage.textContent = message;
    liveToast.hidden = false;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => liveToast.hidden = true, 4000);
}

toastCloseBtn?.addEventListener('click', () => {
    if (liveToast) liveToast.hidden = true;
});

export function success(message) {
    showToast(message, 'success');
}

export function info(message) {
    showToast(message, 'info');
}

export function warning(message) {
    showToast(message, 'warning');
}

export function error(message) {
    showToast(message, 'danger');
}
