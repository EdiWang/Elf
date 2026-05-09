import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Menu items roles.
 * @public
 */
export const MenuItemRole = {
    /**
     * The menu item has a "menuitem" role
     */
    menuitem: 'menuitem',
    /**
     * The menu item has a "menuitemcheckbox" role
     */
    menuitemcheckbox: 'menuitemcheckbox',
    /**
     * The menu item has a "menuitemradio" role
     */
    menuitemradio: 'menuitemradio',
};
/**
 * @internal
 */
export const roleForMenuItem = {
    [MenuItemRole.menuitem]: 'menuitem',
    [MenuItemRole.menuitemcheckbox]: 'menuitemcheckbox',
    [MenuItemRole.menuitemradio]: 'menuitemradio',
};
/**
 * Predicate function that determines if the element should be considered a menu-item.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export function isMenuItem(element, tagName = '-menu-item') {
    if (element?.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    return element.tagName.toLowerCase().endsWith(tagName);
}
/**
 * The tag name for the menu item element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-menu-item`;
//# sourceMappingURL=menu-item.options.js.map