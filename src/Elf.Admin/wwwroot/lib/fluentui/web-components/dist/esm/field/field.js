import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
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
export class Field extends BaseField {
    constructor() {
        super(...arguments);
        /**
         * The position of the label relative to the input.
         *
         * @public
         * @remarks
         * HTML Attribute: `label-position`
         */
        this.labelPosition = LabelPosition.above;
    }
}
__decorate([
    attr({ attribute: 'label-position' })
], Field.prototype, "labelPosition", void 0);
//# sourceMappingURL=field.js.map