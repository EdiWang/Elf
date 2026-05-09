import { FASTElement } from '@microsoft/fast-element';
/**
 * The base class for a component with a toggleable checked state.
 *
 * @public
 */
export declare class BaseCheckbox extends FASTElement {
    /**
     * Indicates that the element should get focus after the page finishes loading.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#autofocus | `autofocus`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autofocus`
     */
    autofocus: boolean;
    /**
     * The element's current checked state.
     *
     * @public
     */
    get checked(): boolean;
    set checked(next: boolean);
    /**
     * The disabled state of the control.
     *
     * @public
     */
    disabled?: boolean;
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    protected disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial disabled state of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabledAttribute?: boolean;
    /**
     * Sets the disabled state when the `disabled` attribute changes.
     *
     * @param prev - the previous value
     * @param next - the current value
     * @internal
     */
    protected disabledAttributeChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The id of a form to associate the element to.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#form | `form`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    formAttribute?: string;
    /**
     * The initial checked state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `checked`
     */
    initialChecked?: boolean;
    /**
     * Updates the checked state when the `checked` attribute is changed, unless the checked state has been changed by the user.
     *
     * @param prev - The previous initial checked state
     * @param next - The current initial checked state
     * @internal
     */
    protected initialCheckedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial value of the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the input when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    protected initialValueChanged(prev: string, next: string): void;
    /**
     * Tracks whether the space key was pressed down while the checkbox was focused.
     * This is used to prevent inadvertently checking a required, unchecked checkbox when the space key is pressed on a
     * submit button and field validation is triggered.
     *
     * @internal
     */
    private _keydownPressed;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * The element's required state.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * Sets the validity of the control when the required state changes.
     *
     * @param prev - The previous required state
     * @param next - The current required state
     * @internal
     */
    protected requiredChanged(prev: boolean, next: boolean): void;
    /**
     * The internal checked state of the control.
     *
     * @internal
     */
    private _checked?;
    /**
     * Indicates that the checked state has been changed by the user.
     *
     * @internal
     */
    private dirtyChecked;
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * A reference to all associated `<label>` elements.
     *
     * @public
     */
    get labels(): ReadonlyArray<HTMLLabelElement>;
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
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
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
     * The internal value of the input.
     *
     * @internal
     */
    private _value;
    /**
     * The current value of the input.
     *
     * @public
     */
    get value(): string;
    set value(value: string);
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Toggles the checked state when the user clicks the element.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    connectedCallback(): void;
    /**
     * Updates the form value when a user changes the `checked` state.
     *
     * @param e - the event object
     * @internal
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Prevents scrolling when the user presses the space key, and sets a flag to indicate that the space key was pressed
     * down while the checkbox was focused.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Toggles the checked state when the user releases the space key.
     *
     * @param e - the event object
     * @internal
     */
    keyupHandler(e: KeyboardEvent): boolean | void;
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Sets the ARIA checked state.
     *
     * @param value - The checked state
     * @internal
     */
    protected setAriaChecked(value?: boolean): void;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Sets a custom validity message.
     *
     * @param message - The message to set
     * @public
     */
    setCustomValidity(message: string): void;
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force?: boolean): void;
}
