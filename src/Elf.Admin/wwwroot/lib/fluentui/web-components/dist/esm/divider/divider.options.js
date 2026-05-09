import { Orientation } from '../utils/orientation.js';
import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Divider roles
 * @public
 */
export const DividerRole = {
    /**
     * The divider semantically separates content
     */
    separator: 'separator',
    /**
     * The divider has no semantic value and is for visual presentation only.
     */
    presentation: 'presentation',
};
/**
 * Divider orientation
 * @public
 */
export const DividerOrientation = Orientation;
/**
 * Align content within divider
 * @public
 */
export const DividerAlignContent = {
    center: 'center',
    start: 'start',
    end: 'end',
};
/**
 * DividerAppearance - divider color defined by a design token alias.
 * @public
 */
export const DividerAppearance = {
    strong: 'strong',
    brand: 'brand',
    subtle: 'subtle',
};
/**
 * The tag name for the divider element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-divider`;
//# sourceMappingURL=divider.options.js.map