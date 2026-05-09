import { __decorate } from "tslib";
import { attr, FASTElement } from '@microsoft/fast-element';
/**
 * The base class used for constructing a fluent-label custom element
 *
 * @tag fluent-label
 *
 * @public
 */
export class Label extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * 	Specifies styles for label when associated input is disabled
         *
         * @public
         * @remarks
         * HTML Attribute: disabled
         */
        this.disabled = false;
        /**
         * 	Specifies styles for label when associated input is a required field
         *
         * @public
         * @remarks
         * HTML Attribute: required
         */
        this.required = false;
    }
}
__decorate([
    attr
], Label.prototype, "size", void 0);
__decorate([
    attr
], Label.prototype, "weight", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Label.prototype, "disabled", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Label.prototype, "required", void 0);
//# sourceMappingURL=label.js.map