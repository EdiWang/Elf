import type { BadgeOptions } from '../badge/badge.options.js';
import type { ValuesOf } from '../utils/typings.js';
/**
 * CounterBadge options
 * @public
 */
export type CounterBadgeOptions = BadgeOptions;
/**
 * CounterBadgeAppearance constants
 * @public
 */
export declare const CounterBadgeAppearance: {
    readonly filled: "filled";
    readonly ghost: "ghost";
};
/**
 * A CounterBadge can have an appearance of filled or ghost
 * @public
 */
export type CounterBadgeAppearance = ValuesOf<typeof CounterBadgeAppearance>;
/**
 * CounterBadgeColor constants
 * @public
 */
export declare const CounterBadgeColor: {
    readonly brand: "brand";
    readonly danger: "danger";
    readonly important: "important";
    readonly informative: "informative";
    readonly severe: "severe";
    readonly subtle: "subtle";
    readonly success: "success";
    readonly warning: "warning";
};
/**
 * A CounterBadge can be one of preset colors
 * @public
 */
export type CounterBadgeColor = ValuesOf<typeof CounterBadgeColor>;
/**
 * A CounterBadge shape can be circular or rounded.
 * @public
 */
export declare const CounterBadgeShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
};
/**
 * A CounterBadge can be one of preset colors
 * @public
 */
export type CounterBadgeShape = ValuesOf<typeof CounterBadgeShape>;
/**
 * A CounterBadge can be square, circular or rounded.
 * @public
 */
export declare const CounterBadgeSize: {
    readonly tiny: "tiny";
    readonly extraSmall: "extra-small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
};
/**
 * A CounterBadge can be on of several preset sizes.
 * @public
 */
export type CounterBadgeSize = ValuesOf<typeof CounterBadgeSize>;
/**
 * The tag name for the counter badge element.
 *
 * @public
 */
export declare const tagName: "fluent-counter-badge";
