import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Predicate function that determines if the element should be considered an option.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is an option.
 * @public
 */
export function isDropdownOption(value, tagName = '-option') {
    if (value?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return value.tagName.toLowerCase().endsWith(tagName);
}
/**
 * The tag name for the option element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-option`;
//# sourceMappingURL=option.options.js.map