import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { BaseTreeItem } from './tree-item.base.js';
import { TreeItemAppearance, TreeItemSize } from './tree-item.options.js';
/**
 * The Fluent Tree Item Element. Implements {@link @microsoft/fast-foundation#BaseTreeItem}.
 *
 * @tag fluent-tree-item
 *
 */
export class TreeItem extends BaseTreeItem {
    constructor() {
        super(...arguments);
        /**
         * The size of the tree item element
         * @public
         */
        this.size = TreeItemSize.small;
        /**
         * The size of the tree item element
         * @public
         */
        this.appearance = TreeItemAppearance.subtle;
    }
    /**
     * Handles changes to the size attribute
     * we update the child tree items' size based on the size
     *  @internal
     */
    sizeChanged() {
        this.updateSizeAndAppearance();
    }
    /**
     * Handles changes to the appearance attribute
     *
     * @internal
     */
    appearanceChanged() {
        this.updateSizeAndAppearance();
    }
    /**
     * child tree items supered change event
     * @internal
     */
    childTreeItemsChanged() {
        super.childTreeItemsChanged();
        this.updateSizeAndAppearance();
    }
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
     *
     * @public
     */
    updateSizeAndAppearance() {
        if (!this.childTreeItems?.length) {
            return;
        }
        this.childTreeItems.forEach(item => {
            item.size = this.size;
            item.appearance = this.appearance;
        });
    }
}
__decorate([
    attr
], TreeItem.prototype, "size", void 0);
__decorate([
    attr
], TreeItem.prototype, "appearance", void 0);
//# sourceMappingURL=tree-item.js.map