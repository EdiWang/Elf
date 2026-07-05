import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { BaseCounterBadge } from './counter-badge.base.js';
/**
 * A CounterBadge Custom HTML Element.
 * Based on BaseCounterBadge and includes style and layout specific attributes.
 *
 * @tag fluent-counter-badge
 *
 * @slot start - Content which can be provided before the badge content.
 * @slot end - Content which can be provided after the badge content.
 *
 * @public
 */
export class CounterBadge extends BaseCounterBadge {
}
__decorate([
    attr
], CounterBadge.prototype, "appearance", void 0);
__decorate([
    attr
], CounterBadge.prototype, "color", void 0);
__decorate([
    attr
], CounterBadge.prototype, "shape", void 0);
__decorate([
    attr
], CounterBadge.prototype, "size", void 0);
applyMixins(CounterBadge, StartEnd);
//# sourceMappingURL=counter-badge.js.map