import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { FocusGroup } from '@microsoft/focusgroup-polyfill/shadowless';
import { TreeItemAppearance, TreeItemSize } from '../tree-item/tree-item.options.js';
import { ArrayItemCollection } from '../utils/focusgroup.js';
import { BaseTree } from './tree.base.js';
/**
 * The Fluent Tree Element. Implements {@link @microsoft/fast-foundation#BaseTree}.
 *
 * @tag fluent-tree
 *
 */
export class Tree extends BaseTree {
    constructor() {
        super(...arguments);
        /**
         * The size of the tree item element
         * The size of the tree item element
         *
         * HTML Attribute: size
         *
         * @public
         */
        this.size = TreeItemSize.small;
        /**
         * The appearance variants of the tree item element
         * The appearance variants of the tree item element
         *
         * HTML Attribute: appearance
         *
         * @public
         */
        this.appearance = TreeItemAppearance.subtle;
    }
    sizeChanged() {
        this.updateSizeAndAppearance();
    }
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
        this.fgItems ??= new ArrayItemCollection(() => this.descendantTreeItems.filter(i => !i.isHidden), () => this.currentSelected ?? null);
        if (!this.fg) {
            this.fg = new FocusGroup(this, this.fgItems, {
                definition: {
                    behavior: 'menu',
                    axis: 'block',
                    memory: false,
                },
            });
        }
        else {
            this.fg.update();
        }
    }
    disconnectedCallback() {
        this.fg?.disconnect();
        super.disconnectedCallback();
    }
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
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
    /** @internal */
    itemToggleHandler() {
        this.fg?.update();
    }
}
__decorate([
    attr
], Tree.prototype, "size", void 0);
__decorate([
    attr
], Tree.prototype, "appearance", void 0);
//# sourceMappingURL=tree.js.map