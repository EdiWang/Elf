/**
 * Expose ltr and rtl strings
 * @public
 */
export declare const Direction: {
    readonly ltr: "ltr";
    readonly rtl: "rtl";
};
/**
 * The direction type
 * @public
 */
export type Direction = (typeof Direction)[keyof typeof Direction];
/**
 * Determines the current localization direction of an element.
 *
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @returns the localization direction of the element
 *
 * @public
 */
export declare const getDirection: (rootNode: HTMLElement) => Direction;
