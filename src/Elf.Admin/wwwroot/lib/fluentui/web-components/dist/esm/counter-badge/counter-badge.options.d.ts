import type { StartEndOptions } from '../patterns/start-end.js';
import type { ValuesOf } from '../utils/typings.js';
import type { CounterBadge } from './counter-badge.js';
/**
 * Template options for CounterBadge component.
 *
 * @public
 */
export type CounterBadgeOptions = StartEndOptions<CounterBadge>;
/**
 * Values for the `appearance` attribute on CounterBadge elements.
 *
 * @public
 */
export declare const CounterBadgeAppearance: {
    readonly filled: "filled";
    readonly ghost: "ghost";
};
/**
 * Type for the `appearance` attribute on CounterBadge elements, based on the CounterBadgeAppearance constants.
 * @public
 */
export type CounterBadgeAppearance = ValuesOf<typeof CounterBadgeAppearance>;
/**
 * Values for the `color` attribute on CounterBadge elements.
 *
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
 * Type for the `color` attribute on CounterBadge elements, based on the CounterBadgeColor constants.
 * @public
 */
export type CounterBadgeColor = ValuesOf<typeof CounterBadgeColor>;
/**
 * Values for the `shape` attribute on CounterBadge elements.
 *
 * @public
 */
export declare const CounterBadgeShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
};
/**
 * Type for the `shape` attribute on CounterBadge elements, based on the CounterBadgeShape constants.
 *
 * @public
 */
export type CounterBadgeShape = ValuesOf<typeof CounterBadgeShape>;
/**
 * Values for the `size` attribute on CounterBadge elements.
 *
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
 * Type for the `size` attribute on CounterBadge elements, based on the CounterBadgeSize constants.
 *
 * @public
 */
export type CounterBadgeSize = ValuesOf<typeof CounterBadgeSize>;
/**
 * The tag name for the counter badge element.
 *
 * @public
 */
export declare const tagName: "fluent-counter-badge";
