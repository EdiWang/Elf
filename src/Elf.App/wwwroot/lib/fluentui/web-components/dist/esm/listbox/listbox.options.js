import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Predicate function that determines if the element should be considered a listbox.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a listbox.
 * @public
 */
export function isListbox(element, tagName = '-listbox') {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return element.tagName.toLowerCase().endsWith(tagName);
}
/**
 * The tag name for the listbox element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-listbox`;
//# sourceMappingURL=listbox.options.js.map