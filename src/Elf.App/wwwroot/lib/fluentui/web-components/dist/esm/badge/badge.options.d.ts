import type { StartEndOptions } from '../patterns/start-end.js';
import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import type { ValuesOf } from '../utils/typings.js';
import type { Badge } from './badge.js';
/**
 * - marking as internal update when Badge PR for start/end is in
 *
 * @internal
 */
export type BadgeOptions = StartEndOptions<Badge> & {
    defaultContent?: StaticallyComposableHTML;
};
/**
 * BadgeAppearance constants
 * @public
 */
export declare const BadgeAppearance: {
    readonly filled: "filled";
    readonly ghost: "ghost";
    readonly outline: "outline";
    readonly tint: "tint";
};
/**
 * A Badge can be filled, outline, ghost, inverted
 * @public
 */
export type BadgeAppearance = ValuesOf<typeof BadgeAppearance>;
/**
 * BadgeColor constants
 * @public
 */
export declare const BadgeColor: {
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
 * A Badge can be one of preset colors
 * @public
 */
export type BadgeColor = ValuesOf<typeof BadgeColor>;
/**
 * A Badge can be square, circular or rounded.
 * @public
 */
export declare const BadgeShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
/**
 * A Badge can be one of preset colors
 * @public
 */
export type BadgeShape = ValuesOf<typeof BadgeShape>;
/**
 * A Badge can be square, circular or rounded.
 * @public
 */
export declare const BadgeSize: {
    readonly tiny: "tiny";
    readonly extraSmall: "extra-small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
};
/**
 * A Badge can be on of several preset sizes.
 * @public
 */
export type BadgeSize = ValuesOf<typeof BadgeSize>;
/**
 * The tag name for the badge element.
 *
 * @public
 */
export declare const tagName: "fluent-badge";
