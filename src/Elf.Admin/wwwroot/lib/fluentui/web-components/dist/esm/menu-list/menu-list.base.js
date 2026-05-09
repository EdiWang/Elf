import { __decorate } from "tslib";
import { FASTElement, observable, Updates } from '@microsoft/fast-element';
import { isHTMLElement } from '../utils/typings.js';
import { isMenuItem, MenuItemRole } from '../menu-item/menu-item.options.js';
/**
 * A Base MenuList Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export class BaseMenuList extends FASTElement {
    itemsChanged(oldValue, newValue) {
        // only update children after the component is connected and
        // the setItems has run on connectedCallback
        // (menuItems is undefined until then)
        if (this.$fastController.isConnected && this.menuChildren !== undefined) {
            this.setItems();
        }
    }
    static { this.focusableElementRoles = MenuItemRole; }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * @internal
         */
        this.isNestedMenu = () => {
            return (this.parentElement !== null &&
                isHTMLElement(this.parentElement) &&
                this.parentElement.getAttribute('role') === 'menuitem');
        };
        /**
         * Handle change from child MenuItem element and set radio group behavior
         */
        this.changedMenuItemHandler = (e) => {
            if (this.menuChildren === undefined) {
                return;
            }
            const changedMenuItem = e.target;
            const changeItemIndex = this.menuChildren.indexOf(changedMenuItem);
            if (changeItemIndex === -1) {
                return;
            }
            if (changedMenuItem.role === 'menuitemradio' && changedMenuItem.checked === true) {
                for (let i = changeItemIndex - 1; i >= 0; --i) {
                    const item = this.menuChildren[i];
                    const role = item.role;
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === 'separator') {
                        break;
                    }
                }
                const maxIndex = this.menuChildren.length - 1;
                for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
                    const item = this.menuChildren[i];
                    const role = item.role;
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === 'separator') {
                        break;
                    }
                }
            }
        };
        this.elementInternals.role = 'menu';
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => {
            // wait until children have had a chance to
            // connect before setting/checking their props/attributes
            this.setItems();
        });
        this.addEventListener('change', this.changedMenuItemHandler);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.menuChildren = undefined;
        this.removeEventListener('change', this.changedMenuItemHandler);
    }
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus() {
        this.menuItems?.find(item => !item.disabled)?.focus();
    }
    static elementIndent(el) {
        const role = el.role;
        const startSlot = el.querySelector('[slot=start]');
        if (role && role !== MenuItemRole.menuitem) {
            return startSlot ? 2 : 1;
        }
        return startSlot ? 1 : 0;
    }
    setItems() {
        const children = Array.from(this.children);
        this.menuChildren = children.filter(child => !child.hasAttribute('hidden'));
        /**
         * Set the indent attribute on MenuItem elements based on their
         * position in the MenuList. Each MenuItem element has a data-indent attribute that is
         * used to set the indent of the element's start slot content.
         */
        this.menuItems = this.menuChildren?.filter(this.isMenuItemElement);
        const indent = this.menuItems?.reduce((accum, current) => {
            const elementValue = BaseMenuList.elementIndent(current);
            return Math.max(accum, elementValue);
        }, 0);
        this.menuItems?.forEach((item) => {
            item.dataset.indent = `${indent}`;
        });
    }
    /**
     * Method for Observable changes to the hidden attribute of child elements
     */
    handleChange(source, propertyName) {
        if (propertyName === 'hidden') {
            this.setItems();
        }
    }
    /**
     * check if the item is a menu item
     */
    isMenuItemElement(el) {
        return isMenuItem(el) || (isHTMLElement(el) && !!el.role && el.role in BaseMenuList.focusableElementRoles);
    }
}
__decorate([
    observable
], BaseMenuList.prototype, "items", void 0);
//# sourceMappingURL=menu-list.base.js.map