import type { ValuesOf } from '../utils/typings.js';
/**
 * The Avatar "active" state
 */
export declare const AvatarActive: {
    readonly active: "active";
    readonly inactive: "inactive";
};
/**
 * The types of Avatar active state
 */
export type AvatarActive = ValuesOf<typeof AvatarActive>;
/**
 * The Avatar Shape
 */
export declare const AvatarShape: {
    readonly circular: "circular";
    readonly square: "square";
};
/**
 * The types of Avatar Shape
 */
export type AvatarShape = ValuesOf<typeof AvatarShape>;
/**
 * The Avatar Appearance when "active"
 */
export declare const AvatarAppearance: {
    readonly ring: "ring";
    readonly shadow: "shadow";
    readonly ringShadow: "ring-shadow";
};
/**
 * The appearance when "active"
 */
export type AvatarAppearance = ValuesOf<typeof AvatarAppearance>;
/**
 * A specific named color for the Avatar
 */
export declare const AvatarNamedColor: {
    readonly darkRed: "dark-red";
    readonly cranberry: "cranberry";
    readonly red: "red";
    readonly pumpkin: "pumpkin";
    readonly peach: "peach";
    readonly marigold: "marigold";
    readonly gold: "gold";
    readonly brass: "brass";
    readonly brown: "brown";
    readonly forest: "forest";
    readonly seafoam: "seafoam";
    readonly darkGreen: "dark-green";
    readonly lightTeal: "light-teal";
    readonly teal: "teal";
    readonly steel: "steel";
    readonly blue: "blue";
    readonly royalBlue: "royal-blue";
    readonly cornflower: "cornflower";
    readonly navy: "navy";
    readonly lavender: "lavender";
    readonly purple: "purple";
    readonly grape: "grape";
    readonly lilac: "lilac";
    readonly pink: "pink";
    readonly magenta: "magenta";
    readonly plum: "plum";
    readonly beige: "beige";
    readonly mink: "mink";
    readonly platinum: "platinum";
    readonly anchor: "anchor";
};
/**
 * An avatar can be one of named colors
 * @public
 */
export type AvatarNamedColor = ValuesOf<typeof AvatarNamedColor>;
/**
 * Supported Avatar colors
 */
export declare const AvatarColor: {
    readonly darkRed: "dark-red";
    readonly cranberry: "cranberry";
    readonly red: "red";
    readonly pumpkin: "pumpkin";
    readonly peach: "peach";
    readonly marigold: "marigold";
    readonly gold: "gold";
    readonly brass: "brass";
    readonly brown: "brown";
    readonly forest: "forest";
    readonly seafoam: "seafoam";
    readonly darkGreen: "dark-green";
    readonly lightTeal: "light-teal";
    readonly teal: "teal";
    readonly steel: "steel";
    readonly blue: "blue";
    readonly royalBlue: "royal-blue";
    readonly cornflower: "cornflower";
    readonly navy: "navy";
    readonly lavender: "lavender";
    readonly purple: "purple";
    readonly grape: "grape";
    readonly lilac: "lilac";
    readonly pink: "pink";
    readonly magenta: "magenta";
    readonly plum: "plum";
    readonly beige: "beige";
    readonly mink: "mink";
    readonly platinum: "platinum";
    readonly anchor: "anchor";
    readonly neutral: "neutral";
    readonly brand: "brand";
    readonly colorful: "colorful";
};
/**
 * The Avatar Color
 */
export type AvatarColor = ValuesOf<typeof AvatarColor>;
/**
 * The Avatar Sizes
 * @public
 */
export declare const AvatarSize: {
    readonly _16: 16;
    readonly _20: 20;
    readonly _24: 24;
    readonly _28: 28;
    readonly _32: 32;
    readonly _36: 36;
    readonly _40: 40;
    readonly _48: 48;
    readonly _56: 56;
    readonly _64: 64;
    readonly _72: 72;
    readonly _96: 96;
    readonly _120: 120;
    readonly _128: 128;
};
/**
 * A Avatar can be on of several preset sizes.
 * @public
 */
export type AvatarSize = ValuesOf<typeof AvatarSize>;
/**
 * The tag name for the avatar element.
 *
 * @public
 */
export declare const tagName: "fluent-avatar";
