import { FASTElement } from '@microsoft/fast-element';
import type { MenuItem } from '../menu-item/menu-item.js';
/**
 * A Base MenuList Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export declare class BaseMenuList extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * @internal
     */
    items: HTMLElement[];
    protected itemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void;
    protected menuChildren: HTMLElement[] | undefined;
    protected menuItems: MenuItem[] | undefined;
    private static focusableElementRoles;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @internal
     */
    readonly isNestedMenu: () => boolean;
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus(): void;
    private static elementIndent;
    protected setItems(): void;
    /**
     * Method for Observable changes to the hidden attribute of child elements
     */
    handleChange(source: any, propertyName: string): void;
    /**
     * Handle change from child MenuItem element and set radio group behavior
     */
    private changedMenuItemHandler;
    /**
     * check if the item is a menu item
     */
    protected isMenuItemElement(el: Element): el is MenuItem;
}
