import type { ValuesOf } from '../utils/typings.js';
/**
 * TextSize constants
 * @public
 */
export declare const TextSize: {
    readonly _100: "100";
    readonly _200: "200";
    readonly _300: "300";
    readonly _400: "400";
    readonly _500: "500";
    readonly _600: "600";
    readonly _700: "700";
    readonly _800: "800";
    readonly _900: "900";
    readonly _1000: "1000";
};
/**
 * The type for TextSize
 * The font size and line height based on the theme tokens
 * @public
 */
export type TextSize = ValuesOf<typeof TextSize>;
/**
 * TextFont Constants
 * @public
 */
export declare const TextFont: {
    readonly base: "base";
    readonly numeric: "numeric";
    readonly monospace: "monospace";
};
/**
 * Applies font family to the content
 * @public
 */
export type TextFont = ValuesOf<typeof TextFont>;
/**
 * TextWeight Constants
 * @public
 */
export declare const TextWeight: {
    readonly medium: "medium";
    readonly regular: "regular";
    readonly semibold: "semibold";
    readonly bold: "bold";
};
/**
 * Applies font weight to the content
 * @public
 */
export type TextWeight = ValuesOf<typeof TextWeight>;
/**
 * TextAlign Constants
 * @public
 */
export declare const TextAlign: {
    readonly start: "start";
    readonly end: "end";
    readonly center: "center";
    readonly justify: "justify";
};
/**
 * Aligns the content
 * @public
 */
export type TextAlign = ValuesOf<typeof TextAlign>;
/**
 * The tag name for the text element.
 *
 * @public
 */
export declare const tagName: "fluent-text";
