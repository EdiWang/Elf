import { Button } from '../button/button.js';
/**
 * The base class used for constructing a `<fluent-toggle-button>` custom element.
 *
 * @tag fluent-toggle-button
 *
 * @public
 */
export declare class ToggleButton extends Button {
    /**
     * Indicates the pressed state of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `pressed`
     */
    pressed: boolean;
    /**
     * Updates the pressed state when the `pressed` property changes.
     *
     * @internal
     */
    protected pressedChanged(): void;
    /**
     * Indicates the mixed state of the control. This property takes precedence over `pressed`.
     *
     * @public
     * @remarks
     * HTML Attribute: `mixed`
     */
    mixed?: boolean;
    /**
     * Updates the pressed state when the `mixed` property changes.
     *
     * @param previous - the previous mixed state
     * @param next - the current mixed state
     * @internal
     */
    protected mixedChanged(): void;
    /**
     * Toggles the pressed state of the button.
     *
     * @override
     */
    protected press(): void;
    connectedCallback(): void;
    /**
     * Sets the `aria-pressed` attribute based on the `pressed` and `mixed` properties.
     *
     * @internal
     */
    private setPressedState;
}
