import type { StartEndOptions } from '../patterns/start-end.js';
import type { ValuesOf } from '../utils/typings.js';
import type { Button } from './button.js';
/**
 * ButtonAppearance constants
 * @public
 */
export declare const ButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * A Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export type ButtonAppearance = ValuesOf<typeof ButtonAppearance>;
/**
 * A Button can be square, circular or rounded.
 * @public
 */
export declare const ButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * A Button can be square, circular or rounded
 * @public
 */
export type ButtonShape = ValuesOf<typeof ButtonShape>;
/**
 * A Button can be a size of small, medium or large.
 * @public
 */
export declare const ButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * A Button can be on of several preset sizes.
 * @public
 */
export type ButtonSize = ValuesOf<typeof ButtonSize>;
/**
 * Button type values.
 *
 * @public
 */
export declare const ButtonType: {
    readonly submit: "submit";
    readonly reset: "reset";
    readonly button: "button";
};
/**
 * Type for button type values.
 *
 * @public
 */
export type ButtonType = ValuesOf<typeof ButtonType>;
/**
 * Button configuration options.
 * @public
 */
export type ButtonOptions = StartEndOptions<Button>;
/**
 * Button `formtarget` attribute values.
 * @public
 */
export declare const ButtonFormTarget: {
    readonly blank: "_blank";
    readonly self: "_self";
    readonly parent: "_parent";
    readonly top: "_top";
};
/**
 * Types for the `formtarget` attribute values.
 * @public
 */
export type ButtonFormTarget = ValuesOf<typeof ButtonFormTarget>;
/**
 * The tag name for the button element.
 *
 * @public
 */
export declare const tagName: "fluent-button";
