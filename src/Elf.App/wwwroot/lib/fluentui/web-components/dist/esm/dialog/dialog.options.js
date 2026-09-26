import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Dialog modal type
 * @public
 */
export const DialogType = {
    modal: 'modal',
    nonModal: 'non-modal',
    alert: 'alert',
};
/**
 * Predicate function that determines if the element should be considered a dialog.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dialog.
 * @public
 */
export function isDialog(element, tagName = '-dialog') {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return element.tagName.toLowerCase().endsWith(tagName);
}
/**
 * The tag name for the dialog element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-dialog`;
//# sourceMappingURL=dialog.options.js.map