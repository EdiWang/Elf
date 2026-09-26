import type { ValuesOf } from '../utils/typings.js';
/**
 * The appearance of the component
 * @public
 */
export declare const TablistAppearance: {
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * The types for the Tablist appearance
 * @public
 */
export type TablistAppearance = ValuesOf<typeof TablistAppearance>;
/**
 * The size of the component
 * @public
 */
export declare const TablistSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * The types for the Tablist size
 * @public
 */
export type TablistSize = ValuesOf<typeof TablistSize>;
/**
 * The orientation of the component
 * @public
 */
export declare const TablistOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};
/**
 * The types for the Tablist orientation
 * @public
 */
export type TablistOrientation = ValuesOf<typeof TablistOrientation>;
/**
 * The tag name for the tablist element.
 *
 * @public
 */
export declare const tagName: "fluent-tablist";
