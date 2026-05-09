import { __decorate } from "tslib";
import { attr, observable } from '@microsoft/fast-element';
import { toggleState } from '../utils/element-internals.js';
import { BaseCheckbox } from './checkbox.base.js';
/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#checkbox | ARIA checkbox }.
 *
 * @tag fluent-checkbox
 *
 * @slot checked-indicator - The checked indicator
 * @slot indeterminate-indicator - The indeterminate indicator
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
export class Checkbox extends BaseCheckbox {
    /**
     * Updates the indeterminate state when the `indeterminate` property changes.
     *
     * @param prev - the indeterminate state
     * @param next - the current indeterminate state
     * @internal
     */
    indeterminateChanged(prev, next) {
        this.setAriaChecked();
        toggleState(this.elementInternals, 'indeterminate', next);
    }
    constructor() {
        super();
        this.elementInternals.role = 'checkbox';
    }
    /**
     * Sets the ARIA checked state. If the `indeterminate` flag is true, the value will be 'mixed'.
     *
     * @internal
     * @override
     */
    setAriaChecked(value = this.checked) {
        if (this.indeterminate) {
            this.elementInternals.ariaChecked = 'mixed';
            return;
        }
        super.setAriaChecked(value);
    }
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force = !this.checked) {
        this.indeterminate = false;
        super.toggleChecked(force);
    }
}
__decorate([
    observable
], Checkbox.prototype, "indeterminate", void 0);
__decorate([
    attr
], Checkbox.prototype, "shape", void 0);
__decorate([
    attr
], Checkbox.prototype, "size", void 0);
//# sourceMappingURL=checkbox.js.map