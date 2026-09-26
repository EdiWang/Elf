import { __decorate } from "tslib";
import { attr, FASTElement } from '@microsoft/fast-element';
import { swapStates } from '../utils/element-internals.js';
import { DividerOrientation, DividerRole } from './divider.options.js';
/**
 * A Divider Custom HTML Element.
 * A divider groups sections of content to create visual rhythm and hierarchy. Use dividers along with spacing and headers to organize content in your layout.
 *
 * @public
 */
export class BaseDivider extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
    }
    connectedCallback() {
        super.connectedCallback();
        this.elementInternals.role = this.role ?? DividerRole.separator;
        if (this.role !== DividerRole.presentation) {
            this.elementInternals.ariaOrientation = this.orientation ?? DividerOrientation.horizontal;
        }
    }
    /**
     * Sets the element's internal role when the role attribute changes.
     *
     * @param previous - the previous role value
     * @param next - the current role value
     * @internal
     */
    roleChanged(previous, next) {
        if (this.$fastController.isConnected) {
            this.elementInternals.role = `${next ?? DividerRole.separator}`;
        }
        if (next === DividerRole.presentation) {
            this.elementInternals.ariaOrientation = null;
        }
    }
    /**
     * Sets the element's internal orientation when the orientation attribute changes.
     *
     * @param previous - the previous orientation value
     * @param next - the current orientation value
     * @internal
     */
    orientationChanged(previous, next) {
        this.elementInternals.ariaOrientation = this.role !== DividerRole.presentation ? next ?? null : null;
        swapStates(this.elementInternals, previous, next, DividerOrientation);
    }
}
__decorate([
    attr
], BaseDivider.prototype, "role", void 0);
__decorate([
    attr
], BaseDivider.prototype, "orientation", void 0);
//# sourceMappingURL=divider.base.js.map