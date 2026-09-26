import type { ButtonOptions } from '../button/button.options.js';
import type { ValuesOf } from '../utils/typings.js';
/**
 * Compound Button Appearance constants
 * @public
 */
export declare const CompoundButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * A Compound Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export type CompoundButtonAppearance = ValuesOf<typeof CompoundButtonAppearance>;
/**
 * A Compound Button can be square, circular or rounded.
 * @public
 */
export declare const CompoundButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * A Compound Button can be square, circular or rounded
 * @public
 */
export type CompoundButtonShape = ValuesOf<typeof CompoundButtonShape>;
/**
 * A Compound Button can be a size of small, medium or large.
 * @public
 */
export declare const CompoundButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * A Compound Button can be on of several preset sizes.
 * @public
 */
export type CompoundButtonSize = ValuesOf<typeof CompoundButtonSize>;
export type { ButtonOptions as CompoundButtonOptions };
/**
 * The tag name for the compound button element.
 *
 * @public
 */
export declare const tagName: "fluent-compound-button";
