import { FASTElement } from '@microsoft/fast-element';
import { type SlottableInput } from './field.options.js';
/**
 * A Field Custom HTML Element.
 *
 * @public
 */
export declare class BaseField extends FASTElement {
    private slottedInputObserver;
    /**
     * The slotted label elements.
     *
     * @internal
     */
    labelSlot: Node[];
    /**
     * Updates attributes on the slotted label elements.
     *
     * @param prev - the previous list of slotted label elements
     * @param next - the current list of slotted label elements
     */
    protected labelSlotChanged(prev: Node[], next: Node[]): void;
    /**
     * The slotted message elements. Filtered to only include elements with a `flag` attribute.
     *
     * @internal
     */
    messageSlot: Element[];
    /**
     * Adds or removes the `invalid` event listener based on the presence of slotted message elements.
     *
     * @param prev - the previous list of slotted message elements
     * @param next - the current list of slotted message elements
     * @internal
     */
    messageSlotChanged(prev: Element[], next: Element[]): void;
    /**
     * The slotted inputs.
     *
     * @internal
     * @privateRemarks
     * This field is populated with the `children` directive in the template rather than `slotted`.
     */
    slottedInputs: SlottableInput[];
    /**
     * Sets the `input` property to the first slotted input.
     *
     * @param prev - The previous collection of inputs.
     * @param next - The current collection of inputs.
     * @internal
     */
    slottedInputsChanged(prev: SlottableInput[] | undefined, next: SlottableInput[] | undefined): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Reference to the first slotted input.
     *
     * @public
     */
    input: SlottableInput;
    /**
     * Updates the field's states and label properties when the assigned input changes.
     *
     * @param prev - the previous input
     * @param next - the current input
     */
    inputChanged(prev: SlottableInput | undefined, next: SlottableInput | undefined): void;
    /**
     * Calls the `setStates` method when a `change` event is emitted from the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Redirects `click` events to the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Applies the `focus-visible` state to the element when the slotted input receives visible focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Removes the `focus-visible` state from the field when a slotted input loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e: FocusEvent): boolean | void;
    /**
     * Toggles validity state flags on the element when the slotted input emits an `invalid` event (if slotted validation messages are present).
     *
     * @param e - the event object
     * @internal
     */
    invalidHandler(e: Event): boolean | void;
    /**
     * Sets ARIA and form-related attributes on slotted label elements.
     *
     * @internal
     */
    private setLabelProperties;
    /**
     * Toggles the field's states based on the slotted input.
     *
     * @internal
     */
    setStates(): void;
    setValidationStates(): void;
}
