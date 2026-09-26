import type { ValuesOf } from '../utils/typings.js';
import type { AnchorOptions } from './anchor-button.js';
/**
 * Anchor Button Appearance constants
 * @public
 */
export declare const AnchorButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * An Anchor Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export type AnchorButtonAppearance = ValuesOf<typeof AnchorButtonAppearance>;
/**
 * An Anchor Button can be square, circular or rounded.
 * @public
 */
export declare const AnchorButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * An Anchor Button can be square, circular or rounded
 * @public
 */
export type AnchorButtonShape = ValuesOf<typeof AnchorButtonShape>;
/**
 * An Anchor Button can be a size of small, medium or large.
 * @public
 */
export declare const AnchorButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * An Anchor Button can be on of several preset sizes.
 * @public
 */
export type AnchorButtonSize = ValuesOf<typeof AnchorButtonSize>;
export type { AnchorOptions as AnchorButtonOptions };
/**
 * Anchor target values.
 *
 * @public
 */
export declare const AnchorTarget: {
    readonly _self: "_self";
    readonly _blank: "_blank";
    readonly _parent: "_parent";
    readonly _top: "_top";
};
/**
 * Type for anchor target values.
 *
 * @public
 */
export type AnchorTarget = ValuesOf<typeof AnchorTarget>;
/**
 * Reflected anchor attributes.
 *
 * @public
 */
export declare const AnchorAttributes: {
    readonly download: "download";
    readonly href: "href";
    readonly hreflang: "hreflang";
    readonly ping: "ping";
    readonly referrerpolicy: "referrerpolicy";
    readonly rel: "rel";
    readonly target: "target";
    readonly type: "type";
};
/**
 * Type for anchor attributes.
 *
 * @public
 */
export type AnchorAttributes = ValuesOf<typeof AnchorAttributes>;
/**
 * The tag name for the anchor button element.
 *
 * @public
 */
export declare const tagName: "fluent-anchor-button";
