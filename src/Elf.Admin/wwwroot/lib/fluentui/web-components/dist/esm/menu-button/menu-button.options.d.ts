import type { ButtonOptions } from '../button/button.options.js';
import type { ValuesOf } from '../utils/typings.js';
/**
 * Menu Button Appearance constants
 * @public
 */
export declare const MenuButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};
/**
 * A Menu Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export type MenuButtonAppearance = ValuesOf<typeof MenuButtonAppearance>;
/**
 * A Menu Button can be square, circular or rounded.
 * @public
 */
export declare const MenuButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * A Menu Button can be square, circular or rounded
 * @public
 */
export type MenuButtonShape = ValuesOf<typeof MenuButtonShape>;
/**
 * A Menu Button can be a size of small, medium or large.
 * @public
 */
export declare const MenuButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/**
 * A Menu Button can be on of several preset sizes.
 * @public
 */
export type MenuButtonSize = ValuesOf<typeof MenuButtonSize>;
export type { ButtonOptions as MenuButtonOptions };
/**
 * The tag name for the menu button element.
 *
 * @public
 */
export declare const tagName: "fluent-menu-button";
