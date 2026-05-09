import { FASTElement } from '@microsoft/fast-element';
import type { StartEndOptions } from '../patterns/start-end.js';
import { StartEnd } from '../patterns/start-end.js';
import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import { MenuItemRole, roleForMenuItem } from './menu-item.options.js';
export type MenuItemColumnCount = 0 | 1 | 2;
export { MenuItemRole, roleForMenuItem };
/**
 * Menu Item configuration options
 * @public
 */
export type MenuItemOptions = StartEndOptions<MenuItem> & {
    indicator?: StaticallyComposableHTML<MenuItem>;
    submenuGlyph?: StaticallyComposableHTML<MenuItem>;
};
/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @tag fluent-menu-item
 *
 * @slot indicator - The checkbox or radio indicator
 * @slot start - Content which can be provided before the menu item content
 * @slot - The default slot for menu item content
 * @slot end - Content which can be provided after the menu item content
 * @slot submenu-glyph - The submenu expand/collapse indicator
 * @slot submenu - Used to nest menu's within menu items
 * @csspart content - The element wrapping the menu item content
 * @fires change - Fires a custom 'change' event when a non-submenu item with a role of `menuitemcheckbox`, `menuitemradio`, or `menuitem` is invoked
 *
 * @public
 */
export declare class MenuItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The disabled state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * Handles changes to disabled attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: MenuItemRole;
    /**
     * Handles changes to role attribute element internals properties
     * @param prev - the previous state
     * @param next - the next state
     */
    roleChanged(prev: MenuItemRole | undefined, next: MenuItemRole | undefined): void;
    /**
     * The checked value of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    checked: boolean;
    /**
     * Handles changes to checked attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    protected checkedChanged(prev: boolean, next: boolean): void;
    /**
     * The hidden attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: hidden
     */
    hidden: boolean;
    /**
     * The submenu slotted content.
     *
     * @internal
     */
    slottedSubmenu: HTMLElement[];
    /**
     * Sets the submenu and updates its position.
     *
     * @internal
     */
    protected slottedSubmenuChanged(prev: HTMLElement[] | undefined, next: HTMLElement[]): void;
    /**
     * @internal
     */
    submenu: HTMLElement | undefined;
    connectedCallback(): void;
    /**
     * @internal
     */
    handleMenuItemKeyDown: (e: KeyboardEvent) => boolean;
    /**
     * @internal
     */
    handleMenuItemClick: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    handleMouseOver: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    handleMouseOut: (e: MouseEvent) => boolean;
    /**
     * Setup required ARIA on open/close
     * @internal
     */
    handleToggle: (e: Event) => void;
    /** @internal */
    handleSubmenuFocusOut: (e: FocusEvent) => void;
    /**
     * @internal
     */
    private invoke;
    /**
     * Set fallback position of menu on open when CSS anchor not supported
     * @internal
     */
    setSubmenuPosition: () => void;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface MenuItem extends StartEnd {
}
