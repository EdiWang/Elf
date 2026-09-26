import { FASTElement } from '@microsoft/fast-element';
import type { BaseTreeItem } from '../tree-item/tree-item.base.js';
export declare class BaseTree extends FASTElement {
    /**
     * The currently selected tree item
     * @public
     */
    currentSelected: HTMLElement | null;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /** @internal */
    defaultSlot: HTMLSlotElement;
    /**
     * Calls the slot change handler when the `defaultSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    defaultSlotChanged(): void;
    constructor();
    /** @internal */
    childTreeItems: BaseTreeItem[];
    /** @internal */
    childTreeItemsChanged(): void;
    /**
     * Updates current selected when slottedTreeItems changes
     */
    private updateCurrentSelected;
    /**
     * KeyDown handler
     *
     *  @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Handles click events bubbling up
     *
     *  @internal
     */
    clickHandler(e: Event): boolean | void;
    /**
     * Handles the selected-changed events bubbling up
     * from child tree items
     *
     *  @internal
     */
    changeHandler(e: Event): boolean | void;
    /** @internal */
    handleDefaultSlotChange(): void;
    /**
     * All descendant tree items in DOM order, recursively flattened from
     * `childTreeItems`.
     */
    protected get descendantTreeItems(): BaseTreeItem[];
}
