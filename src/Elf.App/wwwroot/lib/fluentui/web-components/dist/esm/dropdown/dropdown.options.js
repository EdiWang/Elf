import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Predicate function that determines if the element should be considered a dropdown.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export function isDropdown(element, tagName = '-dropdown') {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return element.tagName.toLowerCase().endsWith(tagName);
}
/**
 * Values for the `appearance` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export const DropdownAppearance = {
    filledDarker: 'filled-darker',
    filledLighter: 'filled-lighter',
    outline: 'outline',
    transparent: 'transparent',
};
/**
 * Values for the `size` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export const DropdownSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
};
/**
 * Values  for the `type` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export const DropdownType = {
    combobox: 'combobox',
    dropdown: 'dropdown',
    select: 'select',
};
/**
 * The tag name for the dropdown element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-dropdown`;
//# sourceMappingURL=dropdown.options.js.map