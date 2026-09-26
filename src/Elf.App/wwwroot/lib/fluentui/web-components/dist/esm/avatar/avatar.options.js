import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * The Avatar "active" state
 */
export const AvatarActive = {
    active: 'active',
    inactive: 'inactive',
};
/**
 * The Avatar Shape
 */
export const AvatarShape = {
    circular: 'circular',
    square: 'square',
};
/**
 * The Avatar Appearance when "active"
 */
export const AvatarAppearance = {
    ring: 'ring',
    shadow: 'shadow',
    ringShadow: 'ring-shadow',
};
/**
 * A specific named color for the Avatar
 */
export const AvatarNamedColor = {
    darkRed: 'dark-red',
    cranberry: 'cranberry',
    red: 'red',
    pumpkin: 'pumpkin',
    peach: 'peach',
    marigold: 'marigold',
    gold: 'gold',
    brass: 'brass',
    brown: 'brown',
    forest: 'forest',
    seafoam: 'seafoam',
    darkGreen: 'dark-green',
    lightTeal: 'light-teal',
    teal: 'teal',
    steel: 'steel',
    blue: 'blue',
    royalBlue: 'royal-blue',
    cornflower: 'cornflower',
    navy: 'navy',
    lavender: 'lavender',
    purple: 'purple',
    grape: 'grape',
    lilac: 'lilac',
    pink: 'pink',
    magenta: 'magenta',
    plum: 'plum',
    beige: 'beige',
    mink: 'mink',
    platinum: 'platinum',
    anchor: 'anchor',
};
/**
 * Supported Avatar colors
 */
export const AvatarColor = {
    neutral: 'neutral',
    brand: 'brand',
    colorful: 'colorful',
    ...AvatarNamedColor,
};
/**
 * The Avatar Sizes
 * @public
 */
export const AvatarSize = {
    _16: 16,
    _20: 20,
    _24: 24,
    _28: 28,
    _32: 32,
    _36: 36,
    _40: 40,
    _48: 48,
    _56: 56,
    _64: 64,
    _72: 72,
    _96: 96,
    _120: 120,
    _128: 128,
};
/**
 * The tag name for the avatar element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-avatar`;
//# sourceMappingURL=avatar.options.js.map