import type { ValuesOf } from '../utils/typings.js';
/**
 * A drawer can be positioned on the left or right side of the viewport.
 */
export declare const DrawerPosition: {
    readonly start: "start";
    readonly end: "end";
};
/**
 * The position of the drawer.
 * @public
 */
export type DrawerPosition = ValuesOf<typeof DrawerPosition>;
/**
 * A drawer can be different sizes
 */
export declare const DrawerSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly full: "full";
};
/**
 * The size of the drawer.
 * @public
 */
export type DrawerSize = ValuesOf<typeof DrawerSize>;
/**
 * A drawer can be different sizes
 */
export declare const DrawerType: {
    readonly nonModal: "non-modal";
    readonly modal: "modal";
    readonly inline: "inline";
};
/**
 * The size of the drawer.
 * @public
 */
export type DrawerType = ValuesOf<typeof DrawerType>;
/**
 * The tag name for the drawer element.
 *
 * @public
 */
export declare const tagName: "fluent-drawer";
