export function createDialogController(dialogElement) {
    return {
        element: dialogElement,
        show() {
            if (!dialogElement.open) {
                dialogElement.showModal();
                dialogElement.dispatchEvent(new CustomEvent('shown.elf.dialog'));
            }
        },
        hide() {
            if (dialogElement.open) {
                dialogElement.close();
            }
        }
    };
}
