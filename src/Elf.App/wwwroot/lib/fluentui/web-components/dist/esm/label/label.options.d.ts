import type { ValuesOf } from '../utils/typings.js';
/**
 * A Labels font size can be small, medium, or large
 */
export declare const LabelSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * Applies font size to label
 * @public
 */
export type LabelSize = ValuesOf<typeof LabelSize>;
/**
 * A label can have a font weight of regular or strong
 */
export declare const LabelWeight: {
    readonly regular: "regular";
    readonly semibold: "semibold";
};
/**
 * Applies font weight to label
 * @public
 */
export type LabelWeight = ValuesOf<typeof LabelWeight>;
/**
 * The tag name for the label element.
 *
 * @public
 */
export declare const tagName: "fluent-label";
