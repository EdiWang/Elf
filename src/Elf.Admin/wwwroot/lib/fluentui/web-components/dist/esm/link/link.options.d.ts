import { AnchorTarget } from '../anchor-button/anchor-button.options.js';
import type { ValuesOf } from '../utils/typings.js';
/**
 * Link Appearance constants
 * @public
 */
export declare const LinkAppearance: {
    readonly subtle: "subtle";
};
/**
 * An Link can be subtle or the default appearance
 * @public
 */
export type LinkAppearance = ValuesOf<typeof LinkAppearance>;
/**
 * Link target values.
 *
 * @public
 */
export declare const LinkTarget: {
    readonly _self: "_self";
    readonly _blank: "_blank";
    readonly _parent: "_parent";
    readonly _top: "_top";
};
/**
 * Type for link target values.
 *
 * @public
 */
export type LinkTarget = ValuesOf<typeof AnchorTarget>;
/**
 * Reflected link attributes.
 *
 * @public
 */
export declare const LinkAttributes: {
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
 * Type for link attributes.
 *
 * @public
 */
export type LinkAttributes = ValuesOf<typeof LinkAttributes>;
/**
 * The tag name for the link element.
 *
 * @public
 */
export declare const tagName: "fluent-link";
