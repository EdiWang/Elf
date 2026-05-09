import { FASTElement } from '@microsoft/fast-element';
export declare class BaseTreeItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /** @internal */
    itemSlot: HTMLSlotElement;
    /**
     * Calls the slot change handler when the `itemSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    itemSlotChanged(): void;
    constructor();
    /**
     * When true, the control will be appear expanded by user interaction.
     * When true, the control will be appear expanded by user interaction.
     *
     * HTML Attribute: `expanded`
     *
     * @public
     */
    expanded: boolean;
    /**
     * Handles changes to the expanded attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @public
     */
    expandedChanged(prev: boolean, next: boolean): void;
    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    selected: boolean;
    /**
     * Handles changes to the selected attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @internal
     */
    protected selectedChanged(prev: boolean, next: boolean): void;
    /**
     * When true, the control has no child tree items
     * When true, the control has no child tree items
     *
     * HTML Attribute: empty
     *
     * @public
     */
    empty: boolean;
    private styles;
    /**
     * The indent of the tree item element.
     * This is not needed once css attr() is supported (--indent: attr(data-indent type(<number>)));
     * @public
     */
    dataIndent: number | undefined;
    protected dataIndentChanged(prev: number, next: number): void;
    /** @internal */
    childTreeItems: BaseTreeItem[] | undefined;
    /**
     * Handles changes to the child tree items
     *
     * @public
     */
    childTreeItemsChanged(): void;
    /**
     * Updates the childrens indent
     *
     * @public
     */
    updateChildTreeItems(): void;
    /**
     * Sets the indent for each item
     */
    private setIndent;
    /**
     * Toggle the expansion state of the tree item
     *
     * @public
     */
    toggleExpansion(): void;
    /**
     * Whether the tree item is nested
     * @internal
     */
    get isNestedItem(): boolean;
    /**
     * Whether the tree item is nested in a collapsed tree item.
     * @internal
     */
    get isHidden(): boolean;
    /** @internal */
    handleItemSlotChange(): void;
}
