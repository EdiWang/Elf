import { __decorate } from "tslib";
import { attr, FASTElement } from '@microsoft/fast-element';
import { applyMixins } from '../utils/apply-mixins.js';
import { StartEnd } from '../patterns/start-end.js';
import { BadgeAppearance, BadgeColor } from './badge.options.js';
/**
 * The base class used for constructing a fluent-badge custom element
 * @tag fluent-badge
 *
 * @slot - Content which can be provided inside the badge.
 * @slot start - Content which can be provided before the badge content.
 * @slot end - Content which can be provided after the badge content.
 *
 * @public
 */
export class Badge extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The appearance the badge should have.
         *
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