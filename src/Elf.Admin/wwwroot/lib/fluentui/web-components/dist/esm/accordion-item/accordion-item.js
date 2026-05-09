import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { BaseAccordionItem } from './accordion-item.base.js';
/**
 * An Accordion Item Custom HTML Element.
 * Based on BaseAccordionItem and includes style and layout specific attributes
 *
 * @public
 */
export class AccordionItem extends BaseAccordionItem {
    constructor() {
        super(...arguments);
        /**
         * Sets the width of the focus state.
         *
         * @public
         * @remarks
         * HTML Attribute: block
         */
        this.block = false;
    }
}
__decorate([
    attr
], AccordionItem.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'marker-position' })
], AccordionItem.prototype, "markerPosition", void 0);
__decorate([
    attr({ mode: 'boolean' })
], AccordionItem.prototype, "block", void 0);
applyMixins(AccordionItem, StartEnd);
//# sourceMappingURL=accordion-item.js.map