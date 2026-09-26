import { ValuesOf } from '../utils/typings.js';
import { BaseTreeItem } from './tree-item.base.js';
export declare const TreeItemAppearance: {
    readonly subtle: "subtle";
    readonly subtleAlpha: "subtle-alpha";
    readonly transparent: "transparent";
};
export type TreeItemAppearance = ValuesOf<typeof TreeItemAppearance>;
export declare const TreeItemSize: {
    readonly small: "small";
    readonly medium: "medium";
};
export type TreeItemSize = ValuesOf<typeof TreeItemSize>;
/**
 * Predicate function that determines if the element should be considered an tree-item.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export declare function isTreeItem(element?: Node | null, tagName?: string): element is BaseTreeItem;
/**
 * The tag name for the tree item element.
 *
 * @public
 */
export declare const tagName: "fluent-tree-item";
