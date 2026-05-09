import { __decorate } from "tslib";
import { attr, css, FASTElement, observable } from '@microsoft/fast-element';
import { toggleState } from '../utils/element-internals.js';
import { isTreeItem } from './tree-item.options.js';
export class BaseTreeItem extends FASTElement {
    /**
     * Calls the slot change handler when the `itemSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    itemSlotChanged() {
        this.handleItemSlotChange();
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * When true, the control will be appear expanded by user interaction.
         * When true, the control will be appear expanded by user interaction.
         *
         * HTML Attribute: `expanded`
         *
         * @public
         */
        this.expanded = false;
        /**
         * When true, the control has no child tree items
         * When true, the control has no child tree items
         *
         * HTML Attribute: empty
         *
         * @public
         */
        this.empty = false;
        /** @internal */
        this.childTreeItems = [];
        this.elementInternals.role = 'treeitem';
    }
    /**
     * Handles changes to the expanded attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @public
     */
    expandedChanged(prev, next) {
        this.$emit('toggle', {
            oldState: prev ? 'open' : 'closed',
            newState: next ? 'open' : 'closed',
        });
        toggleState(this.elementInternals, 'expanded', next);
        if (this.childTreeItems && this.childTreeItems.length > 0) {
            this.elementInternals.ariaExpanded = next ? 'true' : 'false';
            // Update focusgroup attributes after subtree show/hide rendering is done.
            requestAnimationFrame(() => {
                const walker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT, node => isTreeItem(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP);
                while (walker.nextNode()) {
                    const item = walker.currentNode;
                    if (next) {
                        item.removeAttribute('focusgroup');
                    }
                    else {
                        if (item.selected) {
                            item.selected = false;
                        }
                        item.setAttribute('focusgroup', 'none');
                    }
                }
            });
        }
    }
    /**
     * Handles changes to the selected attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @internal
     */
    selectedChanged(prev, next) {
        this.$emit('change');
        toggleState(this.elementInternals, 'selected', next);
        this.elementInternals.ariaSelected = next ? 'true' : 'false';
    }
    dataIndentChanged(prev, next) {
        if (this.styles !== undefined) {
            this.$fastController.removeStyles(this.styles);
        }
        this.styles = css `
      :host {
        --indent: ${next};
      }
    `;
        this.$fastController.addStyles(this.styles);
    }
    /**
     * Handles changes to the child tree items
     *
     * @public
     */
    childTreeItemsChanged() {
        this.empty = this.childTreeItems?.length === 0;
        this.updateChildTreeItems();
    }
    /**
     * Updates the childrens indent
     *
     * @public
     */
    updateChildTreeItems() {
        if (!this.childTreeItems?.length) {
            return;
        }
        //If a tree item is nested and initially set to selected expand the tree items so the selected item is visible
        if (!this.expanded) {
            this.expanded = Array.from(this.querySelectorAll('[selected]')).some(el => isTreeItem(el));
        }
        this.childTreeItems.forEach(item => {
            this.setIndent(item);
        });
    }
    /**
     * Sets the indent for each item
     */
    setIndent(item) {
        const indent = this.dataIndent ?? 0;
        item.dataIndent = indent + 1;
    }
    /**
     * Toggle the expansion state of the tree item
     *
     * @public
     */
    toggleExpansion() {
        if (this.childTreeItems?.length) {
            this.expanded = !this.expanded;
        }
    }
    /**
     * Whether the tree item is nested
     * @internal
     */
    get isNestedItem() {
        return isTreeItem(this.parentElement);
    }
    /**
     * Whether the tree item is nested in a collapsed tree item.
     * @internal
     */
    get isHidden() {
        let parent = this.parentElement;
        while (isTreeItem(parent)) {
            if (!parent.expanded) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }
    /** @internal */
    handleItemSlotChange() {
        this.childTreeItems = this.itemSlot.assignedElements().filter(el => isTreeItem(el));
    }
}
__decorate([
    observable
], BaseTreeItem.prototype, "itemSlot", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTreeItem.prototype, "expanded", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTreeItem.prototype, "selected", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTreeItem.prototype, "empty", void 0);
__decorate([
    attr({ attribute: 'data-indent' })
], BaseTreeItem.prototype, "dataIndent", void 0);
__decorate([
    observable
], BaseTreeItem.prototype, "childTreeItems", void 0);
//# sourceMappingURL=tree-item.base.js.map