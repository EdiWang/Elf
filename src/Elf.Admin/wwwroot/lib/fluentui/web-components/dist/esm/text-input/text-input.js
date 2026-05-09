import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { BaseTextInput } from './text-input.base.js';
/**
 * A Text Input Custom HTML Element.
 * Based on BaseTextInput and includes style and layout specific attributes
 *
 * @tag fluent-text-input
 *
 * @public
 */
export class TextInput extends BaseTextInput {
}
__decorate([
    attr
], TextInput.prototype, "appearance", void 0);
__decorate([
    attr({ attribute: 'control-size' })
], TextInput.prototype, "controlSize", void 0);
applyMixins(TextInput, StartEnd);
//# sourceMappingURL=text-input.js.map