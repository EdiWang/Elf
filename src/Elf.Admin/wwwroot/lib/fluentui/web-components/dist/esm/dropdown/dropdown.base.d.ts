import { FASTElement } from '@microsoft/fast-element';
import type { Listbox } from '../listbox/listbox.js';
import type { DropdownOption } from '../option/option.js';
import { DropdownType } from './dropdown.options.js';
/**
 * A Dropdown Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#combobox | ARIA combobox } role.
 *
 * @remarks
 * The Dropdown element does not provide a form association value. Instead, the slotted Option elements handle form
 * association the same way as {@link (Checkbox:class)} elements. See the {@link (DropdownOption:class)} element for
 * more details.
 *
 * @slot - The default slot. Accepts a {@link (Listbox:class)} element.
 * @slot indicator - The indicator slot.
 * @slot control - The control slot. This slot is automatically populated and should not be manually manipulated.
 *
 * @public
 */
export declare class BaseDropdown extends FASTElement {
    /**
     * Static property for the anchor positioning fallback observer. The observer is used to flip the listbox when it is
     * out of view.
     * @remarks This is only used when the browser does not support CSS anchor positioning.
     * @internal
     */
    private static AnchorPositionFallbackObserver;
    /**
     * The ID of the current active descendant.
     *
     * @public
     */
    get activeDescendant(): string | undefined;
    /**
     * The index of the currently active option.
     *
     * @internal
     */
    activeIndex: number;
    /**
     * Sets the active index when the active index property changes.
     *
     * @param prev - the previous active index
     * @param next - the current active index
     * @internal
     */
    activeIndexChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The `aria-labelledby` attribute value of the dropdown.
     *
     * @public
     */
    ariaLabelledBy: string;
    /**
     * Reference to the control element.
     * @internal
     */
    control: HTMLInputElement;
    /**
     * Updates properties on the control element when the control slot changes.
     *
     * @param prev - the previous control element
     * @param next - the current control element
     * @internal
     * @remarks
     * The control element is assigned to the dropdown via the control slot with manual slot assignment.
     */
    controlChanged(prev: HTMLInputElement | undefined, next: HTMLInputElement | undefined): void;
    /**
     * The disabled state of the dropdown.
     * @public
     */
    disabled?: boolean;
    /**
     * Updates the disabled state of the options when the disabled property changes.
     *
     * @param prev - the previous disabled state
     * @param next - the current disabled state
     */
    disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The display value for the control.
     *
     * @public
     */
    get displayValue(): string;
    /**
     * Sets the listbox ID to a unique value if one is not provided.
     *
     * @override
     * @public
     * @remarks
     * HTML Attribute: `id`
     */
    id: string;
    /**
     * Reference to the indicator button element.
     *
     * @internal
     */
    indicator: HTMLDivElement;
    /**
     * Reference to the indicator slot element.
     *
     * @internal
     */
    indicatorSlot?: HTMLSlotElement;
    /**
     * The value of the selected option.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue?: string;
    /**
     * Reference to the slotted listbox element.
     *
     * @internal
     */
    listbox: Listbox;
    /**
     * Updates properties on the listbox element when the listbox reference changes.
     *
     * @param prev - the previous listbox element
     * @param next - the current listbox element
     * @internal
     *
     * @remarks
     * The listbox element is assigned to the dropdown via the default slot with manual slot assignment.
     */
    listboxChanged(prev: Listbox | undefined, next: Listbox | undefined): void;
    /**
     * Indicates whether the dropdown allows multiple options to be selected.
     *
     * @public
     * @remarks
     * HTML Attribute: `multiple`
     */
    multiple?: boolean;
    /**
     * Toggles between single and multiple selection modes when the `multiple` property changes.
     *
     * @param prev - the previous multiple state
     * @param next - the next multiple state
     * @internal
     */
    protected multipleChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The name of the dropdown.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Updates the name of the options when the name property changes.
     *
     * @param prev - the previous name
     * @param next - the current name
     */
    nameChanged(prev: string, next: string): void;
    /**
     * Indicates whether the dropdown is open.
     *
     * @public
     * @remarks
     * HTML Attribute: `open`
     */
    open: boolean;
    /**
     * Handles the open state of the dropdown.
     *
     * @param prev - the previous open state
     * @param next - the current open state
     *
     * @internal
     */
    openChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The placeholder text of the dropdown.
     *
     * @public
     */
    placeholder: string;
    /**
     * The required state of the dropdown.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * The dropdown type.
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type: DropdownType;
    /**
     * Changes the slotted control element based on the dropdown type.
     *
     * @param prev - the previous dropdown type
     * @param next - the current dropdown type
     * @internal
     */
    typeChanged(prev: DropdownType | undefined, next: DropdownType | undefined): void;
    /**
     * The initial value of the control. When the control is a combobox, this value is used to set the value of the
     * control when the dropdown is initialized.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    valueAttribute: string;
    /**
     * The slot element for the control.
     * @internal
     */
    controlSlot: HTMLSlotElement;
    /**
     * An abort controller to remove scroll and resize event listeners when the dropdown is closed or disconnected. Used
     * when the browser does not support CSS anchor positioning.
     *
     * @internal
     */
    private debounceController?;
    /**
     * Repositions the listbox to align with the control element. Used when the browser does not support CSS anchor
     * positioning.
     *
     * @internal
     */
    private repositionListbox;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The collection of enabled options.
     * @public
     */
    get enabledOptions(): DropdownOption[];
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * The ID of the frame used for repositioning the listbox when the browser does not support CSS anchor positioning.
     *
     * @internal
     */
    private frameId?;
    /**
     * A reference to the first freeform option, if present.
     *
     * @internal
     */
    private get freeformOption();
    /**
     * Indicates whether the dropdown is a combobox.
     *
     * @internal
     */
    private get isCombobox();
    /**
     * A reference to all associated label elements.
     *
     * @public
     */
    get labels(): ReadonlyArray<Node>;
    /**
     * The list formatter for the dropdown. Used to format the display value when the dropdown is in multiple selection mode.
     *
     * @internal
     */
    private listFormatter?;
    /**
     * The list collator for the dropdown. Used to filter options based on the input value.
     *
     * @internal
     */
    private listCollator?;
    /**
     * The collection of all child options.
     *
     * @public
     */
    get options(): DropdownOption[];
    /**
     * The index of the first selected option, scoped to the enabled options.
     *
     * @internal
     * @remarks
     * This property is a reflection of {@link Listbox.selectedIndex}.
     */
    get selectedIndex(): number;
    /**
     * The collection of selected options.
     *
     * @public
     * @remarks
     * This property is a reflection of {@link Listbox.selectedOptions}.
     */
    get selectedOptions(): DropdownOption[];
    /**
     * The fallback validation message, taken from a native `<input>` element.
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
     * The current value of the selected option.
     *
     * @public
     */
    get value(): string | null;
    set value(next: string | null);
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * Handles the change events for the dropdown.
     *
     * @param e - the event object
     *
     * @public
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Handles the click events for the dropdown.
     *
     * @param e - the event object
     *
     * @public
     */
    clickHandler(e: PointerEvent): boolean | void;
    constructor();
    /**
     * Filters the options based on the input value.
     *
     * @param value - the input value to filter the options by
     * @param collection - the collection of options to filter
     * @returns the filtered options
     * @internal
     */
    filterOptions(value: string, collection?: DropdownOption[]): DropdownOption[];
    /**
     * Focuses the control when the dropdown receives focus.
     *
     * @internal
     */
    focus(options?: FocusOptions): void;
    /**
     * Toggles the listbox when the control element loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e: FocusEvent): boolean | void;
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Ensures the active index is within bounds of the enabled options. Out-of-bounds indices are wrapped to the opposite
     * end of the range.
     *
     * @param index - the desired index
     * @param upperBound - the upper bound of the range
     * @returns the index in bounds
     * @internal
     */
    private getEnabledIndexInBounds;
    /**
     * Handles the input events for the dropdown from the control element.
     *
     * @param e - the input event
     * @public
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Guard flag to prevent reentrant calls to `insertControl`.
     * @internal
     */
    private _insertingControl;
    /**
     * Inserts the control element based on the dropdown type.
     *
     * @public
     * @remarks
     * This method can be overridden in derived classes to provide custom control elements, though this is not recommended.
     */
    protected insertControl(): void;
    /**
     * Handles the keydown events for the dropdown.
     *
     * @param e - the keyboard event
     * @public
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Prevents the default behavior of the mousedown event. This is necessary to prevent the input from losing focus
     * when the dropdown is open.
     *
     * @param e - the mouse event
     *
     * @internal
     */
    mousedownHandler(e: MouseEvent): boolean | void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Selects an option by index.
     *
     * @param index - The index of the option to select.
     * @public
     */
    selectOption(index?: number, shouldEmit?: boolean): void;
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
    /**
     * Handles the `slotchange` event for the dropdown.
     * Sets the `listbox` property when a valid listbox is assigned to the default slot.
     *
     * @param e - the slot change event
     * @internal
     */
    slotchangeHandler(e: Event): boolean | void;
    /**
     * Updates the freeform option with the provided value.
     *
     * @param value - the value to update the freeform option with
     * @internal
     */
    protected updateFreeformOption(value?: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * When anchor positioning isn't supported, an intersection observer is used to flip the listbox when it hits the
     * viewport bounds. One static observer is used for all dropdowns.
     *
     * @internal
     */
    private anchorPositionFallback;
}
