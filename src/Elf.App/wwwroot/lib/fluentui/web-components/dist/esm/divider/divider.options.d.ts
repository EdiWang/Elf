import type { ValuesOf } from '../utils/typings.js';
/**
 * Divider roles
 * @public
 */
export declare const DividerRole: {
    /**
     * The divider semantically separates content
     */
    readonly separator: "separator";
    /**
     * The divider has no semantic value and is for visual presentation only.
     */
    readonly presentation: "presentation";
};
/**
 * The types for Divider roles
 * @public
 */
export type DividerRole = ValuesOf<typeof DividerRole>;
/**
 * Divider orientation
 * @public
 */
export declare const DividerOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};
/**
 * The types for Divider orientation
 * @public
 */
export type DividerOrientation = ValuesOf<typeof DividerOrientation>;
/**
 * Align content within divider
 * @public
 */
export declare const DividerAlignContent: {
    readonly center: "center";
    readonly start: "start";
    readonly end: "end";
};
/**
 * The types for DividerAlignContent
 * @public
 */
export type DividerAlignContent = ValuesOf<typeof DividerAlignContent>;
/**
 * DividerAppearance - divider color defined by a design token alias.
 * @public
 */
export declare const DividerAppearance: {
    readonly strong: "strong";
    readonly brand: "brand";
    readonly subtle: "subtle";
};
/**
 * The types for Appearance
 * @public
 */
export type DividerAppearance = ValuesOf<typeof DividerAppearance>;
/**
 * The tag name for the divider element.
 *
 * @public
 */
export declare const tagName: "fluent-divider";
