import type { ValuesOf } from '../utils/typings.js';
import type { MenuItem } from './menu-item.js';
/**
 * Menu items roles.
 * @public
 */
export declare const MenuItemRole: {
    /**
     * The menu item has a "menuitem" role
     */
    readonly menuitem: "menuitem";
    /**
     * The menu item has a "menuitemcheckbox" role
     */
    readonly menuitemcheckbox: "menuitemcheckbox";
    /**
     * The menu item has a "menuitemradio" role
     */
    readonly menuitemradio: "menuitemradio";
};
/**
 * The types for menu item roles
 * @public
 */
export type MenuItemRole = ValuesOf<typeof MenuItemRole>;
/**
 * @internal
 */
export declare const roleForMenuItem: {
    [value in keyof typeof MenuItemRole]: (typeof MenuItemRole)[value];
};
/**
 * Predicate function that determines if the element should be considered a menu-item.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export declare function isMenuItem(element?: Node | null, tagName?: string): element is MenuItem;
/**
 * The tag name for the menu item element.
 *
 * @public
 */
export declare const tagName: "fluent-menu-item";
