import type { ValuesOf } from '../utils/typings.js';
/**
 * Values for the `size` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
export type TextAreaSize = ValuesOf<typeof TextAreaSize>;
/**
 * Values for the `appearance` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaAppearance: {
    readonly outline: "outline";
    readonly filledLighter: "filled-lighter";
    readonly filledDarker: "filled-darker";
};
export type TextAreaAppearance = ValuesOf<typeof TextAreaAppearance>;
/**
 * Allowed values for `appearance` when `display-shadow` is set to true.
 *
 * @public
 */
export declare const TextAreaAppearancesForDisplayShadow: Partial<TextAreaAppearance[]>;
/**
 * Values for the `autocomplete` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaAutocomplete: {
    readonly on: "on";
    readonly off: "off";
};
export type TextAreaAutocomplete = ValuesOf<typeof TextAreaAutocomplete>;
/**
 * Values for the `resize` attribute on TextArea elements.
 */
export declare const TextAreaResize: {
    readonly none: "none";
    readonly both: "both";
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};
export type TextAreaResize = ValuesOf<typeof TextAreaResize>;
/**
 * The tag name for the textarea element.
 *
 * @public
 */
export declare const tagName: "fluent-textarea";
