import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { Button } from '../button/button.js';
import { toggleState } from '../utils/element-internals.js';
/**
 * The base class used for constructing a `<fluent-toggle-button>` custom element.
 *
 * @tag fluent-toggle-button
 *
 * @public
 */
export class ToggleButton extends Button {
    /**
     * Updates the pressed state when the `pressed` property changes.
     *
     * @internal
     */
    pressedChanged() {
        this.setPressedState();
    }
    /**
     * Updates the pressed state when the `mixed` property changes.
     *
     * @param previous - the previous mixed state
     * @param next - the current mixed state
     * @internal
     */
    mixedChanged() {
        this.setPressedState();
    }
    /**
     * Toggles the pressed state of the button.
     *
     * @override
     */
    press() {
        this.pressed = !this.pressed;
    }
    connectedCallback() {
        super.connectedCallback();
        this.setPressedState();
    }
    /**
     * Sets the `aria-pressed` attribute based on the `pressed` and `mixed` properties.
     *
     * @internal
     */
    setPressedState() {
        if (this.$fastController.isConnected) {
            const ariaPressed = `${this.mixed ? 'mixed' : !!this.pressed}`;
            this.elementInternals.ariaPressed = ariaPressed;
            toggleState(this.elementInternals, 'pressed', !!this.pressed || !!this.mixed);
        }
    }
}
__decorate([
    attr({ mode: 'boolean' })
], ToggleButton.prototype, "pressed", void 0);
__decorate([
    attr({ mode: 'boolean' })
], ToggleButton.prototype, "mixed", void 0);
//# sourceMappingURL=toggle-button.js.map