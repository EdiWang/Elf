import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { BaseRatingDisplay } from './rating-display.base.js';
/**
 * A Rating Display Custom HTML Element.
 * Based on BaseRatingDisplay and includes style and layout specific attributes
 *
 * @tag fluent-rating-display
 *
 * @public
 */
export class RatingDisplay extends BaseRatingDisplay {
    constructor() {
        super(...arguments);
        /**
         * Renders a single filled icon with a label next to it.
         *
         * @public
         * @remarks
         * HTML Attribute: `compact`
         */
        this.compact = false;
    }
}
__decorate([
    attr
], RatingDisplay.prototype, "color", void 0);
__decorate([
    attr
], RatingDisplay.prototype, "size", void 0);
__decorate([
    attr({ mode: 'boolean' })
], RatingDisplay.prototype, "compact", void 0);
//# sourceMappingURL=rating-display.js.map