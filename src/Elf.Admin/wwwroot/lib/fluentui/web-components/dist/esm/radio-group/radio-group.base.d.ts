import { FASTElement } from '@microsoft/fast-element';
import type { Radio } from '../radio/radio.js';
import { RadioGroupOrientation } from './radio-group.options.js';
/**
 * A Base Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @public
 */
export declare class BaseRadioGroup extends FASTElement {
    private isNavigating;
    /**
     * The index of the checked radio, scoped to the enabled radios.
     *
     * @internal
     */
    protected checkedIndex: number;
    /**
     * Sets the checked state of the nearest enabled radio when the `checkedIndex` changes.
     *
     * @param prev - the previous index
     * @param next - the current index
     * @internal
     */
    protected checkedIndexChanged(prev: number | undefined, next: number): void;
    /**
     * Indicates that the value has been changed by the user.
     */
    private dirtyState;
    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    /**
     * Sets the `disabled` attribute on all child radios when the `disabled` property changes.
     *
     * @param prev - the previous disabled value
     * @param next - the current disabled value
     * @internal
     */
    protected disabledChanged(prev?: boolean, next?: boolean): void;
    /**
     * The value of the checked radio.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue?: string;
    /**
     * Sets the matching radio to checked when the value changes. If no radio matches the value, no radio will be checked.
     *
     * @param prev - the previous value
     * @param next - the current value
     */
    initialValueChanged(prev: string | undefined, next: string | undefined): void;
    /**
     * The name of the radio group.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Sets the `name` attribute on all child radios when the `name` property changes.
     *
     * @internal
     */
    protected nameChanged(prev: string | undefined, next: string | undefined): void;
    /**
     * The orientation of the group.
     *
     * @public
     * @remarks
     * HTML Attribute: `orientation`
     */
    orientation?: RadioGroupOrientation;
    /**
     * Sets the ariaOrientation attribute when the orientation changes.
     *
     * @param prev - the previous orientation
     * @param next - the current orientation
     * @internal
     */
    orientationChanged(prev: RadioGroupOrientation | undefined, next: RadioGroupOrientation | undefined): void;
    /**
     * The collection of all child radios.
     *
     * @public
     */
    radios: Radio[];
    /**
     * Updates the enabled radios collection when properties on the child radios change.
     *
     * @param prev - the previous radios
     * @param next - the current radios
     */
    radiosChanged(prev: Radio[] | undefined, next: Radio[] | undefined): void;
    /**
     * Indicates whether the radio group is required.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     *
     * @param prev - the previous required value
     * @param next - the current required value
     */
    requiredChanged(prev: boolean, next: boolean): void;
    /**
     * The collection of radios that are slotted into the default slot.
     *
     * @internal
     */
    slottedRadios: Radio[];
    /**
     * Updates the radios collection when the slotted radios change.
     *
     * @param prev - the previous slotted radios
     * @param next - the current slotted radios
     */
    slottedRadiosChanged(prev: Radio[] | undefined, next: Radio[]): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * A collection of child radios that are not disabled.
     *
     * @internal
     */
    get enabledRadios(): Radio[];
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * The fallback validation message, taken from a native checkbox `<input>` element.
     *
     * @internal
     */
    private _validationFallbackMessage;
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @internal
     */
    get validationMessage(): string;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The current value of the checked radio.
     *
     * @public
     */
    get value(): string | null;
    set value(next: string | null);
    /**
     * Sets the checked state of all radios when any radio emits a `change` event.
     *
     * @param e - the change event
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Checks the radio at the specified index.
     *
     * @param index - the index of the radio to check
     * @internal
     */
    checkRadio(index?: number, shouldEmit?: boolean): void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Handles click events for the radio group.
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    constructor();
    /**
     * Focuses the checked radio or the first enabled radio.
     *
     * @internal
     */
    focus(): void;
    formResetCallback(): void;
    /**
     * Enables tabbing through the radio group when the group receives focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Handles keydown events for the radio group.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     *
     * @param e - the disabled event
     */
    disabledRadioHandler(e: CustomEvent): void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     * @remarks
     * RadioGroup validation is reported through the individual Radio elements rather than the RadioGroup itself.
     * This is necessary because:
     * 1. Each Radio is form-associated (extends BaseCheckbox which has `formAssociated = true`)
     * 2. Browser validation UIs and screen readers announce validation against individual form controls
     * 3. For groups like RadioGroup, the browser needs to report the error on a specific member of the group
     * 4. We anchor the error to the first Radio so it receives focus and announcement
     *
     * When the group is invalid (required but no selection):
     * - Only the first Radio gets the invalid state with the validation message
     * - Other Radios are kept valid since selecting any of them would satisfy the requirement
     *
     * When the group becomes valid (user selects any Radio):
     * - All Radios are cleared back to valid state
     * - This allows form submission to proceed
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
}
