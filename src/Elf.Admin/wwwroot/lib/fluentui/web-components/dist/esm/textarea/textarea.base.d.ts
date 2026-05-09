import { FASTElement } from '@microsoft/fast-element';
import type { Label } from '../label/label.js';
import { TextAreaAutocomplete, TextAreaResize } from './textarea.options.js';
/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | `<textarea>`} element.
 *
 * @slot - The default content/value of the component.
 * @slot label - The content for the `<label>`, it should be a `<fluent-label>` element.
 * @csspart label - The `<label>` element.
 * @csspart root - The container element of the `<textarea>` element.
 * @csspart control - The internal `<textarea>` element.
 * @fires change - Fires after the control loses focus, if the content has changed.
 * @fires select - Fires when the `select()` method is called.
 *
 * @public
 */
export declare class BaseTextArea extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static readonly formAssociated = true;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The `<label>` element.
     * @internal
     */
    labelEl: HTMLLabelElement;
    /**
     * The root container element.
     * @internal
     */
    rootEl: HTMLDivElement;
    /**
     * The `<textarea>` element.
     * @internal
     */
    controlEl: HTMLTextAreaElement;
    /**
     * Sets up a mutation observer to watch for changes to the control element's
     * attributes that could affect validity, and binds an input event listener to detect user interaction.
     *
     * @internal
     */
    protected controlElChanged(): void;
    /**
     * @internal
     */
    autoSizerEl?: HTMLDivElement;
    /**
     * The list of nodes that are assigned to the default slot.
     * @internal
     */
    defaultSlottedNodes: Node[];
    protected defaultSlottedNodesChanged(): void;
    private filteredLabelSlottedNodes;
    /**
     * The list of nodes that are assigned to the `label` slot.
     * @internal
     */
    labelSlottedNodes: Label[];
    protected labelSlottedNodesChanged(): void;
    private userInteracted;
    private autoSizerObserver?;
    private controlElAttrObserver;
    private preConnectControlEl;
    /**
     * Indicates the element's autocomplete state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete | `autocomplete`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autocomplete`
     */
    autocomplete?: TextAreaAutocomplete;
    /**
     * Indicates whether the element’s block size (height) should be automatically changed based on the content.
     * Note: When this property’s value is set to be `true`, the element should not have a fixed block-size
     * defined in CSS. Instead, use `min-height` or `min-block-size`.
     *
     * @public
     * @remarks
     * HTML Attribute: `auto-resize`
     */
    autoResize: boolean;
    protected autoResizeChanged(): void;
    /**
     * Sets the name of the value directionality to be submitted with form data.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/dirname | `dirname`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `dirname`
     */
    dirName?: string;
    /**
     * Sets the element's disabled state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    protected disabledChanged(): void;
    /**
     * Indicates whether the element displays a box shadow. This only has effect when `appearance` is set to be `filled-darker` or `filled-lighter`.
     *
     * @public
     * @remarks
     * HTML Attribute: `display-shadow`
     */
    displayShadow: boolean;
    /**
     * The id of a form to associate the element to.
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    initialForm?: string;
    /**
     * The form element that’s associated to the element, or `null` if no form is associated.
     *
     * @public
     */
    get form(): HTMLFormElement | null;
    /**
     * A `NodeList` of `<label>` element associated with the element.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels | `labels`} property
     *
     * @public
     */
    get labels(): NodeList;
    /**
     * The maximum number of characters a user can enter.
     *
     * @public
     * @remarks
     * HTML Attribute: `maxlength`
     */
    maxLength?: number;
    /**
     * The minimum number of characters a user can enter.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/minlength | `minlength`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `minlength`
     */
    minLength?: number;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/placeholder | `placeholder`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `placeholder`
     * This attribute is not a valid substitute for a label.
     */
    placeholder?: string;
    /**
     * When true, the control will be immutable by user interaction.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `readonly`
     */
    readOnly: boolean;
    protected readOnlyChanged(): void;
    /**
     * The element's required attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    protected requiredChanged(): void;
    /**
     * Indicates whether the element can be resized by end users.
     *
     * @public
     * @remarks
     * HTML Attribute: `resize`
     */
    resize: TextAreaResize;
    protected resizeChanged(prev: TextAreaResize | undefined, next: TextAreaResize | undefined): void;
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
     * The length of the current value.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#textLength | 'textLength'} property
     *
     * @public
     */
    get textLength(): number;
    /**
     * The type of the element, which is always "textarea".
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/type | `type`} property
     *
     * @public
     */
    get type(): 'textarea';
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
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * The text content of the element before user interaction.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#defaultvalue | `defaultValue`} property
     *
     * @public
     * @remarks
     * In order to set the initial/default value, an author should either add the default value in the HTML as the children
     * of the component, or setting this property in JavaScript. Setting `innerHTML`, `innerText`, or `textContent` on this
     * component will not change the default value or the content displayed inside the component.
     */
    get defaultValue(): string;
    set defaultValue(next: string);
    /**
     * The value of the element.
     *
     * @public
     * @remarks
     * Reflects the `value` property.
     */
    get value(): string;
    set value(next: string);
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * @internal
     */
    formDisabledCallback(disabled: boolean): void;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message: string | null): void;
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
    /**
     * Selects the content in the element.
     *
     * @public
     */
    select(): void;
    /**
     * Gets the content inside the light DOM, if any HTML element is present, use its `outerHTML` value.
     */
    private getContent;
    private setDisabledSideEffect;
    private toggleUserValidityState;
    private maybeCreateAutoSizerEl;
    /**
     * @internal
     */
    handleControlInput(): void;
    /**
     * @internal
     */
    handleControlChange(): void;
    /**
     * @internal
     */
    handleControlSelect(): void;
}
