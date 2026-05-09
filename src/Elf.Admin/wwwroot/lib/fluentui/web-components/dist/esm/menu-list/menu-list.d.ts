import { BaseMenuList } from './menu-list.base.js';
/**
 * A MenuList Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @tag fluent-menu-list
 *
 * @slot - The default slot for the menu items
 *
 * @public
 */
export declare class MenuList extends BaseMenuList {
    private fg?;
    private fgItems?;
    disconnectedCallback(): void;
    setItems(): void;
}
