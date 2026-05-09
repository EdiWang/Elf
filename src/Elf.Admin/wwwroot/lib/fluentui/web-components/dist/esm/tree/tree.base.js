import { __decorate } from "tslib";
import { FASTElement, observable } from '@microsoft/fast-element';
import { isTreeItem } from '../tree-item/tree-item.options.js';
export class BaseTree extends FASTElement {
    /**
     * Calls the slot change handler when the `defaultSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    defaultSlotChanged() {
        this.handleDefaultSlotChange();
    }
    constructor() {
        super();
        /**
         * The currently selected tree item
         * @public
         */
        this.currentSelected = null;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'tree';
    }
    /** @internal */
    childTreeItemsChanged() {
        this.updateCurrentSelected();
    }
    /**
     * Updates current selected when slottedTreeItems changes
     */
    updateCurrentSelected() {
        // force single selection
        // defaults to first one found
        const selectedItem = this.querySelector(`[selected]`);
        this.currentSelected = selectedItem;
    }
    /**
     * KeyDown handler
     *
     *  @internal
     */
    keydownHandler(e) {
        if (e.defaultPrevented) {
            return;
        }
        const item = e.target;
        if (!isTreeItem(item) || this.childTreeItems.length < 1) {
            return true;
        }
        switch (e.key) {
            case 'ArrowLeft': {
                if (item?.childTreeItems?.length && item.expanded) {
                    item.expanded = false;
                }
                else if (isTreeItem(item.parentElement)) {
                    item.parentElement.focus();
                }
                return;
            }
            case 'ArrowRight': {
                if (item?.childTreeItems?.length) {
                    if (!item.expanded) {
                        item.expanded = true;
                    }
                }
                return;
            }
            case 'Enter': {
                // In single-select trees where selection does not follow focus (see note below),
                // the default action is typically to select the focused node.
                this.clickHandler(e);
                return;
            }
            case ' ': {
                item.selected = true;
                return;
            }
        }
        // don't prevent default if we took no action
        return true;
    }
    /**
     * Handles click events bubbling up
     *
     *  @internal
     */
    clickHandler(e) {
        if (e.defaultPrevented) {
            // handled, do nothing
            return;
        }
        if (!isTreeItem(e.target)) {
            // not a tree item, ignore
            // return true, do not prevent default
            return true;
        }
        const item = e.target;
        item.toggleExpansion();
        item.selected = true;
    }
    /**
     * Handles the selected-changed events bubbling up
     * from child tree items
     *
     *  @internal
     */
    changeHandler(e) {
        if (e.defaultPrevented) {
            return;
        }
        if (!isTreeItem(e.target)) {
            return true;
        }
        const item = e.target;
        if (item.selected) {
            // Deselect the previously selected item
            if (this.currentSelected && this.currentSelected !== item && isTreeItem(this.currentSelected)) {
                this.currentSelected.selected = false;
            }
            // New selected item
            this.currentSelected = item;
        }
        else if (!item.selected && this.currentSelected === item) {
            // Selected item deselected
            this.currentSelected = null;
        }
    }
    /** @internal */
    handleDefaultSlotChange() {
        this.childTreeItems = this.defaultSlot.assignedElements().filter(el => isTreeItem(el));
    }
    /**
     * All descendant tree items in DOM order, recursively flattened from
     * `childTreeItems`.
     */
    get descendantTreeItems() {
        const result = [];
        const visit = (items) => {
            if (!items) {
                return;
            }
            for (const item of items) {
                result.push(item);
                visit(item.childTreeItems);
            }
        };
        visit(this.childTreeItems);
        return result;
    }
}
__decorate([
    observable
], BaseTree.prototype, "currentSelected", void 0);
__decorate([
    observable
], BaseTree.prototype, "defaultSlot", void 0);
__decorate([
    observable
], BaseTree.prototype, "childTreeItems", void 0);
//# sourceMappingURL=tree.base.js.map