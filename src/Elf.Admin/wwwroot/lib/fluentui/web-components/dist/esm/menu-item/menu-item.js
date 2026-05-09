import { __decorate } from "tslib";
import { attr, FASTElement, observable } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { toggleState } from '../utils/element-internals.js';
import { MenuItemRole, roleForMenuItem } from './menu-item.options.js';
export { MenuItemRole, roleForMenuItem };
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
export class MenuItem extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The role of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: role
         */
        this.role = MenuItemRole.menuitem;
        /**
         * The checked value of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: checked
         */
        this.checked = false;
        /**
         * @internal
         */
        this.handleMenuItemKeyDown = (e) => {
            if (e.defaultPrevented) {
                return false;
            }
            switch (e.key) {
                case 'Enter':
                case ' ':
                    this.invoke();
                    return false;
                case 'ArrowRight':
                    //open/focus on submenu
                    if (!this.disabled) {
                        this.submenu?.togglePopover(true);
                        this.submenu?.focus();
                    }
                    return false;
                case 'ArrowLeft':
                    //close submenu
                    if (this.parentElement?.hasAttribute('popover')) {
                        this.parentElement.togglePopover(false);
                        // focus the menu item containing the submenu
                        this.parentElement.parentElement?.focus();
                    }
                    return false;
            }
            return true;
        };
        /**
         * @internal
         */
        this.handleMenuItemClick = (e) => {
            if (e.defaultPrevented || this.disabled) {
                return false;
            }
            this.invoke();
            return false;
        };
        /**
         * @internal
         */
        this.handleMouseOver = (e) => {
            if (this.disabled) {
                return false;
            }
            this.submenu?.togglePopover(true);
            return false;
        };
        /**
         * @internal
         */
        this.handleMouseOut = (e) => {
            if (this.contains(document.activeElement)) {
                return false;
            }
            this.submenu?.togglePopover(false);
            return false;
        };
        /**
         * Setup required ARIA on open/close
         * @internal
         */
        this.handleToggle = (e) => {
            if (!(e instanceof ToggleEvent)) {
                return;
            }
            if (e.newState === 'open') {
                this.elementInternals.ariaExpanded = 'true';
                this.setSubmenuPosition();
            }
            if (e.newState === 'closed') {
                this.elementInternals.ariaExpanded = 'false';
            }
            this.submenu?.setAttribute('focusgroup', e.newState === 'open' ? 'menu' : 'none');
        };
        /** @internal */
        this.handleSubmenuFocusOut = (e) => {
            if (e.relatedTarget && this.submenu?.contains(e.relatedTarget)) {
                return;
            }
            this.submenu?.togglePopover(false);
        };
        /**
         * @internal
         */
        this.invoke = () => {
            if (this.disabled) {
                return;
            }
            switch (this.role) {
                case MenuItemRole.menuitemcheckbox:
                    this.checked = !this.checked;
                    break;
                case MenuItemRole.menuitem:
                    if (!!this.submenu) {
                        this.submenu.togglePopover(true);
                        this.submenu.focus();
                        break;
                    }
                    this.$emit('change');
                    break;
                case MenuItemRole.menuitemradio:
                    if (!this.checked) {
                        this.checked = true;
                    }
                    break;
            }
        };
        /**
         * Set fallback position of menu on open when CSS anchor not supported
         * @internal
         */
        this.setSubmenuPosition = () => {
            if (!CSS.supports('anchor-name', '--anchor') && !!this.submenu) {
                const thisRect = this.getBoundingClientRect();
                const thisSubmenuRect = this.submenu.getBoundingClientRect();
                const inlineEnd = getComputedStyle(this).direction === 'ltr' ? 'right' : 'left';
                // If an open submenu is too wide for the viewport, move it above.
                if (thisRect.width + thisSubmenuRect.width > window.innerWidth * 0.75) {
                    this.submenu.style.translate = '0 -100%';
                    return;
                }
                // If the open submenu is overflows the inline-end of the window (e.g. justify-content: end),
                // move to inline-start of menu item
                if (thisRect[inlineEnd] + thisSubmenuRect.width > window.innerWidth) {
                    this.submenu.style.translate = '-100% 0';
                    return;
                }
                // Default to inline-end of menu item
                this.submenu.style.translate = `${thisRect.width - 8}px 0`;
            }
        };
    }
    /**
     * Handles changes to disabled attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    disabledChanged(prev, next) {
        this.elementInternals.ariaDisabled = !!next ? `${next}` : null;
        toggleState(this.elementInternals, 'disabled', next);
    }
    /**
     * Handles changes to role attribute element internals properties
     * @param prev - the previous state
     * @param next - the next state
     */
    roleChanged(prev, next) {
        this.elementInternals.role = next ?? MenuItemRole.menuitem;
    }
    /**
     * Handles changes to checked attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    checkedChanged(prev, next) {
        const checkableMenuItem = this.role !== MenuItemRole.menuitem;
        this.elementInternals.ariaChecked = checkableMenuItem ? `${!!next}` : null;
        toggleState(this.elementInternals, 'checked', checkableMenuItem ? next : false);
        if (this.$fastController.isConnected) {
            this.$emit('change', next, { bubbles: true });
        }
    }
    /**
     * Sets the submenu and updates its position.
     *
     * @internal
     */
    slottedSubmenuChanged(prev, next) {
        this.submenu?.removeEventListener('toggle', this.handleToggle);
        this.submenu?.removeEventListener('focusout', this.handleSubmenuFocusOut);
        if (next.length) {
            this.submenu = next[0];
            this.submenu.toggleAttribute('popover', true);
            this.submenu.setAttribute('focusgroup', 'none');
            this.submenu.addEventListener('toggle', this.handleToggle);
            this.submenu.addEventListener('focusout', this.handleSubmenuFocusOut);
            this.elementInternals.ariaHasPopup = 'menu';
            toggleState(this.elementInternals, 'submenu', true);
        }
        else {
            this.elementInternals.ariaHasPopup = null;
            toggleState(this.elementInternals, 'submenu', false);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.elementInternals.role = this.role ?? MenuItemRole.menuitem;
        this.elementInternals.ariaChecked = this.role !== MenuItemRole.menuitem ? `${!!this.checked}` : null;
    }
}
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "disabled", void 0);
__decorate([
    attr
], MenuItem.prototype, "role", void 0);
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "checked", void 0);
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "hidden", void 0);
__decorate([
    observable
], MenuItem.prototype, "slottedSubmenu", void 0);
__decorate([
    observable
], MenuItem.prototype, "submenu", void 0);
applyMixins(MenuItem, StartEnd);
//# sourceMappingURL=menu-item.js.map