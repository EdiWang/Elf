import { FASTElement } from '@microsoft/fast-element';
import { ProgressBarValidationState } from './progress-bar.options.js';
/**
 * A Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @public
 */
export declare class BaseProgressBar extends FASTElement {
    /**
     * Reference to the indicator element which visually represents the progress.
     *
     * @internal
     */
    indicator?: HTMLElement;
    /**
     * Updates the indicator width after the element is connected to the DOM via the template.
     * @internal
     */
    protected indicatorChanged(): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The validation state of the progress bar
     * The validation state of the progress bar
     *
     * HTML Attribute: `validation-state`
     *
     * @public
     */
    validationState: ProgressBarValidationState | null;
    /**
     * Handles changes to validation-state attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    validationStateChanged(prev: ProgressBarValidationState | undefined, next: ProgressBarValidationState | undefined): void;
    /**
     * The value of the progress
     * The value of the progress
     *
     * HTML Attribute: `value`
     *
     * @internal
     */
    value?: number;
    /**
     * Updates the percent complete when the `value` property changes.
     *
     * @internal
     */
    protected valueChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The minimum value
     * The minimum value
     *
     * HTML Attribute: `min`
     *
     * @internal
     */
    min?: number;
    /**
     * Updates the percent complete when the `min` property changes.
     *
     * @param prev - The previous min value
     * @param next - The current min value
     */
    protected minChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The maximum value
     * The maximum value
     *
     * HTML Attribute: `max`
     *
     * @internal
     */
    max?: number;
    /**
     * Updates the percent complete when the `max` property changes.
     *
     * @param prev - The previous max value
     * @param next - The current max value
     * @internal
     */
    protected maxChanged(prev: number | undefined, next: number | undefined): void;
    constructor();
    /**
     * Sets the width of the indicator element based on the value, min, and max
     * properties. If the browser supports `width: attr(value)`, this method does
     * nothing and allows CSS to handle the width.
     *
     * @internal
     */
    protected setIndicatorWidth(): void;
}
