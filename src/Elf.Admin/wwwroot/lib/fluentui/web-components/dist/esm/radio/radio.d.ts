import { BaseCheckbox } from '../checkbox/checkbox.base.js';
/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radio | ARIA `radio` role}.
 *
 * @tag fluent-radio
 *
 * @slot checked-indicator - The checked indicator slot
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
export declare class Radio extends BaseCheckbox {
    constructor();
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @param prev - the previous value of the `disabled` property
     * @param next - the current value of the `disabled` property
     * @internal
     * @override
     */
    protected disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * To make a group of radio controls required, see `RadioGroup.required`.
     */
    protected requiredChanged(): void;
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * The radio form value is controlled by the `RadioGroup` component.
     */
    setFormValue(): void;
    /**
     * Sets the validity of the control.
     *
     * @internal
     * @override
     * @remarks
     * The radio component does not have a `required` attribute, so this method always sets the validity to `true`.
     */
    setValidity(): void;
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     * @override
     * @remarks
     * The radio checked state is controlled by the `RadioGroup` component, so the `force` parameter defaults to `true`.
     */
    toggleChecked(force?: boolean): void;
}
