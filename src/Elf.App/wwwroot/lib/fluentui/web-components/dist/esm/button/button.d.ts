import { StartEnd } from '../patterns/start-end.js';
import { BaseButton } from './button.base.js';
import { ButtonAppearance, ButtonShape, ButtonSize } from './button.options.js';
/**
 * A Button Custom HTML Element.
 * Based on BaseButton and includes style and layout specific attributes
 *
 * @tag fluent-button
 *
 * @public
 */
export declare class Button extends BaseButton {
    /**
     * Indicates the styled appearance of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: ButtonAppearance;
    /**
     * The shape of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: ButtonShape;
    /**
     * The size of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: ButtonSize;
    /**
     * Indicates that the button should only display as an icon with no text content.
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-only`
     */
    iconOnly: boolean;
}
/**
 * @internal
 * @privateRemarks
 * Mark internal because exporting class and interface of the same name confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 */
export interface Button extends StartEnd {
}
