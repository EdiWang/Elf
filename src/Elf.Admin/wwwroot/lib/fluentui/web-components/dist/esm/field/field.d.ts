import { BaseField } from './field.base.js';
import { LabelPosition } from './field.options.js';
/**
 * A Field Custom HTML Element.
 * Based on BaseField and includes style and layout specific attributes
 *
 * @tag fluent-field
 *
 * @public
 */
export declare class Field extends BaseField {
    /**
     * The position of the label relative to the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `label-position`
     */
    labelPosition: LabelPosition;
}
