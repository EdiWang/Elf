import { DividerAlignContent, DividerAppearance } from './divider.options.js';
import { BaseDivider } from './divider.base.js';
/**
 * A Divider Custom HTML Element.
 * Based on BaseDivider and includes style and layout specific attributes
 *
 * @tag fluent-divider
 *
 * @public
 */
export declare class Divider extends BaseDivider {
    /**
     * @public
     * @remarks
     * Determines the alignment of the content within the divider. Select from start or end. When not specified, the content will be aligned to the center.
     */
    alignContent?: DividerAlignContent;
    /**
     * @public
     * @remarks
     * A divider can have one of the preset appearances. Select from strong, brand, subtle. When not specified, the divider has its default appearance.
     */
    appearance?: DividerAppearance;
    /**
     * @public
     * @remarks
     * Adds padding to the beginning and end of the divider.
     */
    inset?: boolean;
}
