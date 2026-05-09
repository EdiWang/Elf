import type { ValuesOf } from '../utils/typings.js';
/**
 * The TooltipPositioning options and their corresponding CSS values
 * @public
 */
export declare const TooltipPositioningOption: {
    readonly 'above-start': "block-start span-inline-end";
    readonly above: "block-start";
    readonly 'above-end': "block-start span-inline-start";
    readonly 'below-start': "block-end span-inline-end";
    readonly below: "block-end";
    readonly 'below-end': "block-end span-inline-start";
    readonly 'before-top': "inline-start span-block-end";
    readonly before: "inline-start";
    readonly 'before-bottom': "inline-start span-block-start";
    readonly 'after-top': "inline-end span-block-end";
    readonly after: "inline-end";
    readonly 'after-bottom': "inline-end span-block-start";
};
/**
 * The TooltipPositioning type
 * @public
 */
export type TooltipPositioningOption = ValuesOf<typeof TooltipPositioningOption>;
/**
 * The tag name for the tooltip element.
 *
 * @public
 */
export declare const tagName: "fluent-tooltip";
