import { BaseCheckbox } from './checkbox.base.js';
import { CheckboxShape, CheckboxSize } from './checkbox.options.js';
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
export declare class Checkbox extends BaseCheckbox {
    /**
     * Indicates that the element is in an indeterminate or mixed state.
     *
     * @public
     */
    indeterminate?: boolean;
    /**
     * Updates the indeterminate state when the `indeterminate` property changes.
     *
     * @param prev - the indeterminate state
     * @param next - the current indeterminate state
     * @internal
     */
    protected indeterminateChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * Indicates the shape of the checkbox.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: CheckboxShape;
    /**
     * Indicates the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: CheckboxSize;
    constructor();
    /**
     * Sets the ARIA checked state. If the `indeterminate` flag is true, the value will be 'mixed'.
     *
     * @internal
     * @override
     */
    protected setAriaChecked(value?: boolean): void;
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force?: boolean): void;
}
