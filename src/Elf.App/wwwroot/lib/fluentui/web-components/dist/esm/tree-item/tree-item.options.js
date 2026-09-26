import { FluentDesignSystem } from '../fluent-design-system.js';
export const TreeItemAppearance = {
    subtle: 'subtle',
    subtleAlpha: 'subtle-alpha',
    transparent: 'transparent',
};
export const TreeItemSize = {
    small: 'small',
    medium: 'medium',
};
/**
 * Predicate function that determines if the element should be considered an tree-item.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export function isTreeItem(element, tagName = '-tree-item') {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return element.tagName.toLowerCase().endsWith(tagName);
}
/**
 * The tag name for the tree item element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-tree-item`;
//# sourceMappingURL=tree-item.options.js.map