import { TreeItemAppearance, TreeItemSize } from '../tree-item/tree-item.options.js';
import { BaseTree } from './tree.base.js';
/**
 * The Fluent Tree Element. Implements {@link @microsoft/fast-foundation#BaseTree}.
 *
 * @tag fluent-tree
 *
 */
export declare class Tree extends BaseTree {
    /**
     * The size of the tree item element
     * The size of the tree item element
     *
     * HTML Attribute: size
     *
     * @public
     */
    size: TreeItemSize;
    protected sizeChanged(): void;
    /**
     * The appearance variants of the tree item element
     * The appearance variants of the tree item element
     *
     * HTML Attribute: appearance
     *
     * @public
     */
    appearance: TreeItemAppearance;
    protected appearanceChanged(): void;
    private fg?;
    private fgItems?;
    /**
     * child tree items supered change event
     * @internal
     */
    childTreeItemsChanged(): void;
    disconnectedCallback(): void;
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
     */
    updateSizeAndAppearance(): void;
    /** @internal */
    itemToggleHandler(): void;
}
