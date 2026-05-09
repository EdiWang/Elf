import { FASTElement } from '@microsoft/fast-element';
import type { Start } from '../patterns/start-end.js';
/**
 * A DropdownOption Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#option | ARIA option } role.
 *
 * @tag fluent-dropdown-option
 *
 * @slot - The default slot for the option's content.
 * @slot checked-indicator - The checked indicator.
 * @slot description - Optional description content.
 *
 * @remarks
 * To support single and multiple selection modes with the {@link (BaseDropdown:class)} element, the Option element
 * itself handles form association and value submission, rather than its parent Dropdown element. In this way, the
 * Option element is a variation of the Checkbox element that is specifically designed for use in the Dropdown element.
 *
 * This class is named `DropdownOption` to avoid conflicts with the native `Option` global. Related constructs are also
 * titled with `DropdownOption` to maintain consistency.
 *
 * @public
 */
export declare class DropdownOption extends FASTElement implements Start {
    /**
     * Indicates that the option is active.
     *
     * @public
     */
    active: boolean;
    /**
     * Changes the active state of the option when the active property changes.
     *
     * @param prev - the previous active state
     * @param next - the current active state
     * @internal
     */
    protected activeChanged(prev: boolean, next: boolean): void;
    /**
     * The current selected state of the option.
     *
     * @internal
     */
    currentSelected?: boolean;
    /**
     * Sets the selected property to match the currentSelected state.
     *
     * @param prev - the previous selected state
     * @param next - the current selected state
     * @internal
     */
    currentSelectedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial selected state of the option.
     *
     * @public
     * @remarks
     * HTML Attribute: `checked`
     */
    defaultSelected?: boolean;
    /**
     * Updates the selected state when the `selected` attribute is changed, unless the selected state has been changed by the user.
     *
     * @param prev - The previous initial selected state
     * @param next - The current initial selected state
     * @internal
     */
    protected defaultSelectedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The collection of slotted description elements.
     *
     * @internal
     */
    descriptionSlot: Node[];
    /**
     * Changes the description state of the option when the description slot changes.
     *
     * @param prev - the previous collection of description elements
     * @param next - the current collection of description elements
     * @internal
     */
    descriptionSlotChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /**
     * The current disabled state of the option.
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
     * The initial disabled state of the option.
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
     * Indicates that the option value should sync with the value of the dropdown's control.
     *
     * @public
     * @remarks
     * HTML Attribute: `freeform`
     */
    freeform?: boolean;
    /**
     * The id of the option. If not provided, a unique id will be assigned.
     *
     * @override
     * @public
     * @remarks
     * HTML Attribute: `id`
     */
    id: string;
    /**
     * The initial value of the option.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the option when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    protected initialValueChanged(prev: string, next: string): void;
    /**
     * Indicates that the option is in a multiple selection mode context.
     * @public
     */
    multiple: boolean;
    /**
     * Updates the multiple state of the option when the multiple property changes.
     *
     * @param prev - the previous multiple state
     * @param next - the current multiple state
     */
    multipleChanged(prev: boolean, next: boolean): void;
    /**
     * The name of the option. This option's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Reference to the start slot element.
     *
     * @internal
     */
    start: HTMLSlotElement;
    /**
     * The text to display in the dropdown control when the option is selected.
     *
     * @public
     * @remarks
     * HTML Attribute: `text`
     */
    textAttribute?: string;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
    /**
     * The collection of slotted `output` elements, used to display the value when the option is freeform.
     *
     * @internal
     */
    freeformOutputs?: HTMLOutputElement[];
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
     * The option's current selected state.
     *
     * @public
     */
    get selected(): boolean;
    set selected(next: boolean);
    /**
     * The display text of the option.
     *
     * @public
     * @remarks
     * When the option is freeform, the text is the value of the option.
     */
    get text(): string;
    /**
     * The internal value of the option.
     *
     * @internal
     */
    private _value;
    /**
     * The current value of the option.
     *
     * @public
     */
    get value(): string;
    set value(value: string);
    connectedCallback(): void;
    constructor();
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Toggles the selected state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleSelected(force?: boolean): void;
}
