import type { ValuesOf } from '../utils/typings.js';
/**
 * The `layout` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarLayout: {
    readonly multiline: "multiline";
    readonly singleline: "singleline";
};
export type MessageBarLayout = ValuesOf<typeof MessageBarLayout>;
/**
 * The `shape` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarShape: {
    readonly rounded: "rounded";
    readonly square: "square";
};
export type MessageBarShape = ValuesOf<typeof MessageBarShape>;
/**
 * The `intent` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarIntent: {
    readonly success: "success";
    readonly warning: "warning";
    readonly error: "error";
    readonly info: "info";
};
export type MessageBarIntent = ValuesOf<typeof MessageBarIntent>;
/**
 * The tag name for the message bar element.
 *
 * @public
 */
export declare const tagName: "fluent-message-bar";
