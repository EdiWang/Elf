import type { ValuesOf } from '../utils/typings.js';
/**
 * The color of the Rating Display items can be `neutral`, `brand`, or `marigold`.
 * @public
 */
export declare const RatingDisplayColor: {
    readonly neutral: "neutral";
    readonly brand: "brand";
    readonly marigold: "marigold";
};
/**
 * The size of a Rating Display can be `small`, `medium`, or `large`.
 * @public
 */
export declare const RatingDisplaySize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * The Rating Display items can be one of several colors.
 * @public
 */
export type RatingDisplayColor = ValuesOf<typeof RatingDisplayColor>;
/**
 * A Rating Display can be one of several preset sizes.
 * @public
 */
export type RatingDisplaySize = ValuesOf<typeof RatingDisplaySize>;
/**
 * The tag name for the rating display element.
 *
 * @public
 */
export declare const tagName: "fluent-rating-display";
