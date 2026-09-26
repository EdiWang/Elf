import { FASTElement } from '@microsoft/fast-element';
import type { BaseDropdown } from '../dropdown/dropdown.base.js';
import type { DropdownOption } from '../option/option.js';
/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox } role.
 *
 * @tag fluent-listbox
 *
 * @slot - The default slot for the options.
 *
 * @remarks
 * The listbox component represents a list of options that can be selected.
 * It is intended to be used in conjunction with the {@link BaseDropdown | Dropdown} component.
 *
 * @public
 */
export declare class Listbox extends FASTElement {
    /**
     * A reference to the default slot element.
     *
     * @internal
     */
    defaultSlot: HTMLSlotElement;
    /**
     * Calls the `slotchangeHandler` when the `defaultSlot` element is assigned
     * via the `ref` directive in the template.
     *
     * @internal
     */
    protected defaultSlotChanged(): void;
    /**
     * Indicates whether the listbox allows multiple selection.
     *
     * @public
     */
    multiple?: boolean;
    /**
     * Updates the multiple selection state of the listbox and its options.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     */
    multipleChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The collection of all child options.
     *
     * @public
     */
    options: DropdownOption[];
    /**
     * Updates the enabled options collection when properties on the child options change.
     *
     * @param prev - the previous options
     * @param next - the current options
     *
     * @internal
     */
    optionsChanged(prev: DropdownOption[] | undefined, next: DropdownOption[] | undefined): void;
    /**
     * The index of the first selected and enabled option.
     * @internal
     */
    selectedIndex: number;
    /**
     * Reference to the parent dropdown element.
     * @internal
     */
    dropdown?: BaseDropdown;
    /**
     * Handles the `beforetoggle` event on the listbox.
     *
     * @param e - the toggle event
     * @returns true to allow the default popover behavior, undefined to prevent it
     * @internal
     */
    beforetoggleHandler(e: ToggleEvent): boolean | undefined;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The collection of child options that are not disabled.
     *
     * @internal
     */
    get enabledOptions(): DropdownOption[];
    /**
     * The collection of child options that are selected.
     *
     * @public
     */
    get selectedOptions(): DropdownOption[];
    /**
     * Sets the `selected` state on a target option when clicked.
     *
     * @param e - The pointer event
     * @public
     */
    clickHandler(e: PointerEvent): boolean | void;
    constructor();
    connectedCallback(): void;
    /**
     * Handles observable subscriptions for the listbox.
     *
     * @param source - The source of the observed change
     * @param propertyName - The name of the property that changed
     *
     * @internal
     */
    handleChange(source: any, propertyName?: string): void;
    /**
     * Selects an option by index.
     *
     * @param index - The index of the option to select.
     * @public
     */
    selectOption(index?: number): void;
    /**
     * Handles the `slotchange` event for the default slot.
     * Sets the `options` property to the list of slotted options.
     *
     * @param e - The slotchange event
     * @public
     */
    slotchangeHandler(e?: Event): void;
}
