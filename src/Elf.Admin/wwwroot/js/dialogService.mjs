export function createDialogController(dialogElement) {
    if (!dialogElement) {
        return {
            element: null,
            show() { },
            hide() { }
        };
    }

    if (!dialogElement.dataset.dialogControllerInitialized) {
        dialogElement.addEventListener('toggle', event => {
            if (event.detail?.newState === 'open') {
                dialogElement.dataset.dialogOpen = 'true';
            }

            if (event.detail?.newState === 'closed') {
                dialogElement.dataset.dialogOpen = 'false';
                dialogElement.dispatchEvent(new CustomEvent('close'));
            }
        });
        dialogElement.dataset.dialogControllerInitialized = 'true';
    }

    return {
        element: dialogElement,
        show() {
            if (dialogElement.dataset.dialogOpen === 'true') return;

            dialogElement.show();
            dialogElement.dataset.dialogOpen = 'true';
            dialogElement.dispatchEvent(new CustomEvent('shown.elf.dialog'));
        },
        hide() {
            if (dialogElement.dataset.dialogOpen === 'false') return;

            dialogElement.hide();
            dialogElement.dataset.dialogOpen = 'false';
            dialogElement.dispatchEvent(new CustomEvent('close'));
        }
    };
}
