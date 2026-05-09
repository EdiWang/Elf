import { FluentDesignSystem } from '../fluent-design-system.js';
import { isCustomElement } from '../utils/typings.js';
/**
 * Predicate function that determines if the element should be considered a radio element.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check against, defaults to '-radio'.
 * @returns True if the element is a radio element, false otherwise.
 * @public
 */
export function isRadio(element, tagName = '-radio') {
    return isCustomElement(tagName)(element);
}
/**
 * The tag name for the radio element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-radio`;
//# sourceMappingURL=radio.options.js.map