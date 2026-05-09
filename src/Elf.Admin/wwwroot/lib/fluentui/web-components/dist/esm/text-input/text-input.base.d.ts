import { FASTElement } from '@microsoft/fast-element';
import { TextInputType } from './text-input.options.js';
/**
 * A Text Input Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | `<input>`} element.
 *
 * @slot start - Content which can be provided before the input
 * @slot end - Content which can be provided after the input
 * @slot - The default slot for button content
 * @csspart label - The internal `<label>` element
 * @csspart root - the root container for the internal control
 * @csspart control - The internal `<input>` control
 * @public
 */
export declare class BaseTextInput extends FASTElement {
    /**
     * Indicates the element's autocomplete state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete | `autocomplete`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autocomplete`
     */
    autocomplete?: string;
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
     * The current value of the input.
     * @public
     * @remarks
     * HTML Attribute: `current-value`
     */
    currentValue: string;
    /**
     * Tracks the current value of the input.
     *
     * @param prev - the previous value
     * @param next - the next value
     *
     * @internal
     */
    currentValueChanged(prev: string, next: string): void;
    /**
     * The default slotted content. This is the content that appears in the text field label.
     *
     * @internal
     */
    defaultSlottedNodes: Node[];
    /**
     * Updates the control label visibility based on the presence of default slotted content.
     *
     * @internal
     */
    defaultSlottedNodesChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /**
     * Sets the directionality of the element to be submitted with form data.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/dirname | `dirname`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `dirname`
     */
    dirname?: string;
    /**
     * Sets the element's disabled state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled?: boolean;
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
     * The initial value of the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the element to the initial value.
     *
     * @internal
     */
    initialValueChanged(): void;
    /**
     * Allows associating a `<datalist>` to the element by ID.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#list | `list`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `list`
     */
    list: string;
    /**
     * The maximum number of characters a user can enter.
     *
     * @public
     * @remarks
     * HTML Attribute: `maxlength`
     */
    maxlength: number;
    /**
     * The minimum number of characters a user can enter.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/minlength | `minlength`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `minlength`
     */
    minlength: number;
    /**
     * Indicates that a comma-separated list of email addresses can be entered. This attribute is only valid when `type="email"`.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/multiple | `multiple`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `multiple`
     */
    multiple: boolean;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * A regular expression that the value must match to pass validation.
     *
     * @public
     * @remarks
     * HTML Attribute: `pattern`
     */
    pattern: string;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/placeholder | `placeholder`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `placeholder`
     * This attribute is not a valid substitute for a label.
     */
    placeholder: string;
    /**
     * When true, the control will be immutable by user interaction.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `readonly`
     */
    readOnly?: boolean;
    /**
     * Syncs the `ElementInternals.ariaReadOnly` property when the `readonly` property changes.
     *
     * @internal
     */
    readOnlyChanged(): void;
    /**
     * The element's required attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * Syncs the element's internal `aria-required` state with the `required` attribute.
     *
     * @param previous - the previous required state
     * @param next - the current required state
     *
     * @internal
     */
    requiredChanged(previous: boolean, next: boolean): void;
    /**
     * Sets the width of the element to a specified number of characters.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size: number;
    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck | `spellcheck`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `spellcheck`
     */
    spellcheck: boolean;
    /**
     * Allows setting a type or mode of text.
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type: TextInputType;
    /**
     * A reference to the internal input element.
     *
     * @internal
     */
    control: HTMLInputElement;
    /**
     * Calls the `setValidity` method when the control reference changes.
     *
     * @param prev - the previous control reference
     * @param next - the current control reference
     *
     * @internal
     */
    controlChanged(prev: HTMLInputElement | undefined, next: HTMLInputElement | undefined): void;
    /**
     * A reference to the internal label element.
     *
     * @internal
     */
    controlLabel: HTMLLabelElement;
    /**
     * Indicates that the value has been changed by the user.
     *
     * @internal
     */
    private dirtyValue;
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
    static readonly formAssociated = true;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage(): string;
    /**
     * The current value of the input.
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
     * The associated form element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
    /**
     * Handles the internal control's `keypress` event.
     *
     * @internal
     */
    beforeinputHandler(e: InputEvent): boolean | void;
    /**
     * Change event handler for inner control.
     *
     * @internal
     * @privateRemarks
     * "Change" events are not `composable` so they will not permeate the shadow DOM boundary. This function effectively
     * proxies the change event, emitting a `change` event whenever the internal control emits a `change` event.
     */
    changeHandler(e: InputEvent): boolean | void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Clicks the inner control when the component is clicked.
     *
     * @param e - the event object
     */
    clickHandler(e: MouseEvent): boolean | void;
    connectedCallback(): void;
    /**
     * Focuses the inner control when the component is focused.
     *
     * @param e - the event object
     * @public
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Handles implicit form submission when the user presses the "Enter" key.
     *
     * @internal
     */
    private implicitSubmit;
    /**
     * Handles the internal control's `input` event.
     *
     * @internal
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Handles the internal control's `keydown` event.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Selects all the text in the text field.
     *
     * @public
     * @privateRemarks
     * The `select` event does not permeate the shadow DOM boundary. This function effectively proxies the event,
     * emitting a `select` event whenever the internal control emits a `select` event
     *
     */
    select(): void;
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message: string): void;
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
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
}
