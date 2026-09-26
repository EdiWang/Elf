import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { BaseDivider } from './divider.base.js';
/**
 * A Divider Custom HTML Element.
 * Based on BaseDivider and includes style and layout specific attributes
 *
 * @tag fluent-divider
 *
 * @public
 */
export class Divider extends BaseDivider {
}
__decorate([
    attr({ attribute: 'align-content' })
], Divider.prototype, "alignContent", void 0);
__decorate([
    attr
], Divider.prototype, "appearance", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Divider.prototype, "inset", void 0);
//# sourceMappingURL=divider.js.map