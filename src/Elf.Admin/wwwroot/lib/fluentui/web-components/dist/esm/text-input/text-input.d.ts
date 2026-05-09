import { StartEnd } from '../patterns/start-end.js';
import { BaseTextInput } from './text-input.base.js';
import { TextInputAppearance, TextInputControlSize } from './text-input.options.js';
/**
 * A Text Input Custom HTML Element.
 * Based on BaseTextInput and includes style and layout specific attributes
 *
 * @tag fluent-text-input
 *
 * @public
 */
export declare class TextInput extends BaseTextInput {
    /**
     * Indicates the styled appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: TextInputAppearance;
    /**
     * Sets the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `control-size`
     */
    controlSize?: TextInputControlSize;
}
/**
 * @internal
 * @privateRemarks
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/rushstack/issues/1308
 */
export interface TextInput extends StartEnd {
}
