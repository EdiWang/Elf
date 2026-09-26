import type { ValuesOf } from '../utils/typings.js';
/**
 * SwitchLabelPosition Constants
 * @public
 */
export declare const SwitchLabelPosition: {
    readonly above: "above";
    readonly after: "after";
    readonly before: "before";
};
/**
 * Applies label position
 * @public
 */
export type SwitchLabelPosition = ValuesOf<typeof SwitchLabelPosition>;
/**
 * The tag name for the switch element.
 *
 * @public
 */
export declare const tagName: "fluent-switch";
