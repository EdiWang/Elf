import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { BaseButton } from './button.base.js';
/**
 * A Button Custom HTML Element.
 * Based on BaseButton and includes style and layout specific attributes
 *
 * @tag fluent-button
 *
 * @public
 */
export class Button extends BaseButton {
    constructor() {
        super(...arguments);
        /**
         * Indicates that the button should only display as an icon with no text content.
         *
         * @public
         * @remarks
         * HTML Attribute: `icon-only`
         */
        this.iconOnly = false;
    }
}
__decorate([
    attr
], Button.prototype, "appearance", void 0);
__decorate([
    attr
], Button.prototype, "shape", void 0);
__decorate([
    attr
], Button.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'icon-only', mode: 'boolean' })
], Button.prototype, "iconOnly", void 0);
applyMixins(Button, StartEnd);
//# sourceMappingURL=button.js.map