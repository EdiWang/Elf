import type { ButtonOptions } from '../button/button.options.js';
import type { ValuesOf } from '../utils/typings.js';
/**
 * Toggle Button Appearance constants
 * @public
 */
export declare const ToggleButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * A Toggle Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export type ToggleButtonAppearance = ValuesOf<typeof ToggleButtonAppearance>;
/**
 * A Toggle Button can be square, circular or rounded.
 * @public
 */
export declare const ToggleButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * A Toggle Button can be square, circular or rounded
 * @public
 */
export type ToggleButtonShape = ValuesOf<typeof ToggleButtonShape>;
/**
 * A Toggle Button can be a size of small, medium or large.
 * @public
 */
export declare const ToggleButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * A Toggle Button can be on of several preset sizes.
 * @public
 */
export type ToggleButtonSize = ValuesOf<typeof ToggleButtonSize>;
export type { ButtonOptions as ToggleButtonOptions };
/**
 * The tag name for the toggle button element.
 *
 * @public
 */
export declare const tagName: "fluent-toggle-button";
