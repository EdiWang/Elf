import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
import { swapStates, toggleState } from '../utils/element-internals.js';
import { BaseAnchor } from './anchor-button.base.js';
import { AnchorButtonAppearance, AnchorButtonShape, AnchorButtonSize } from './anchor-button.options.js';
/**
 * An Anchor Custom HTML Element.
 * Based on BaseAnchor and includes style and layout specific attributes
 *
 * @public
 */
export class AnchorButton extends BaseAnchor {
    constructor() {
        super(...arguments);
        /**
         * The anchor button has an icon only, no text content
         *
         * @public
         * @remarks
         * HTML Attribute: `icon-only`
         */
        this.iconOnly = false;
    }
    /**
     * Handles changes to appearance attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    appearanceChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, AnchorButtonAppearance);
    }
    /**
     * Handles changes to shape attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    shapeChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, AnchorButtonShape);
    }
    /**
     * Handles changes to size attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    sizeChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, AnchorButtonSize);
    }
    /**
     * Handles changes to icon only custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    iconOnlyChanged(prev, next) {
        toggleState(this.elementInternals, 'icon', !!next);
    }
}
__decorate([
    attr
], AnchorButton.prototype, "appearance", void 0);
__decorate([
    attr
], AnchorButton.prototype, "shape", void 0);
__decorate([
    attr
], AnchorButton.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'icon-only', mode: 'boolean' })
], AnchorButton.prototype, "iconOnly", void 0);
applyMixins(AnchorButton, StartEnd);
//# sourceMappingURL=anchor-button.js.map