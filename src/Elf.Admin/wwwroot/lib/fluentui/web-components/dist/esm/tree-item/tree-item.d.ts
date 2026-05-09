import { BaseTreeItem } from './tree-item.base.js';
import { TreeItemAppearance, TreeItemSize } from './tree-item.options.js';
/**
 * The Fluent Tree Item Element. Implements {@link @microsoft/fast-foundation#BaseTreeItem}.
 *
 * @tag fluent-tree-item
 *
 */
export declare class TreeItem extends BaseTreeItem {
    /**
     * The size of the tree item element
     * @public
     */
    size: TreeItemSize;
    /**
     * Handles changes to the size attribute
     * we update the child tree items' size based on the size
     *  @internal
     */
    protected sizeChanged(): void;
    /**
     * The size of the tree item element
     * @public
     */
    appearance: TreeItemAppearance;
    /**
     * Handles changes to the appearance attribute
     *
     * @internal
     */
    protected appearanceChanged(): void;
    /**
     * child tree items supered change event
     * @internal
     */
    childTreeItemsChanged(): void;
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
     *
     * @public
     */
    updateSizeAndAppearance(): void;
}
