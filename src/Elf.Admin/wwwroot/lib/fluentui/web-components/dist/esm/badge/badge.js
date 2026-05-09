import { __decorate } from "tslib";
import { attr, FASTElement } from '@microsoft/fast-element';
import { applyMixins } from '../utils/apply-mixins.js';
import { StartEnd } from '../patterns/start-end.js';
import { BadgeAppearance, BadgeColor } from './badge.options.js';
/**
 * The base class used for constructing a fluent-badge custom element
 * @public
 */
export class Badge extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The appearance the badge should have.
         *
         * @tag fluent-badge
         *
         * @public
         * @remarks
         * HTML Attribute: appearance
         */
        this.appearance = BadgeAppearance.filled;
        /**
         * The color the badge should have.
         *
         * @public
         * @remarks
         * HTML Attribute: color
         */
        this.color = BadgeColor.brand;
    }
}
__decorate([
    attr
], Badge.prototype, "appearance", void 0);
__decorate([
    attr
], Badge.prototype, "color", void 0);
__decorate([
    attr
], Badge.prototype, "shape", void 0);
__decorate([
    attr
], Badge.prototype, "size", void 0);
applyMixins(Badge, StartEnd);
//# sourceMappingURL=badge.js.map