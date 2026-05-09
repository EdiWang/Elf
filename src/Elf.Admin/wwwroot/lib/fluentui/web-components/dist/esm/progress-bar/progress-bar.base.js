import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, observable, Updates } from '@microsoft/fast-element';
import { swapStates } from '../utils/element-internals.js';
import { ProgressBarValidationState } from './progress-bar.options.js';
/**
 * A Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @public
 */
export class BaseProgressBar extends FASTElement {
    /**
     * Updates the indicator width after the element is connected to the DOM via the template.
     * @internal
     */
    indicatorChanged() {
        this.setIndicatorWidth();
    }
    /**
     * Handles changes to validation-state attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    validationStateChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, ProgressBarValidationState);
    }
    /**
     * Updates the percent complete when the `value` property changes.
     *
     * @internal
     */
    valueChanged(prev, next) {
        if (this.elementInternals) {
            this.elementInternals.ariaValueNow = typeof next === 'number' ? `${next}` : null;
        }
        this.setIndicatorWidth();
    }
    /**
     * Updates the percent complete when the `min` property changes.
     *
     * @param prev - The previous min value
     * @param next - The current min value
     */
    minChanged(prev, next) {
        if (this.elementInternals) {
            this.elementInternals.ariaValueMin = typeof next === 'number' ? `${next}` : null;
        }
        this.setIndicatorWidth();
    }
    /**
     * Updates the percent complete when the `max` property changes.
     *
     * @param prev - The previous max value
     * @param next - The current max value
     * @internal
     */
    maxChanged(prev, next) {
        if (this.elementInternals) {
            this.elementInternals.ariaValueMax = typeof next === 'number' ? `${next}` : null;
        }
        this.setIndicatorWidth();
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The validation state of the progress bar
         * The validation state of the progress bar
         *
         * HTML Attribute: `validation-state`
         *
         * @public
         */
        this.validationState = null;
        this.elementInternals.role = 'progressbar';
    }
    /**
     * Sets the width of the indicator element based on the value, min, and max
     * properties. If the browser supports `width: attr(value)`, this method does
     * nothing and allows CSS to handle the width.
     *
     * @internal
     */
    setIndicatorWidth() {
        if (CSS.supports('width: attr(value type(<number>))')) {
            return;
        }
        Updates.enqueue(() => {
            if (typeof this.value !== 'number') {
                this.indicator?.style.removeProperty('width');
                return;
            }
            const min = this.min ?? 0;
            const max = this.max ?? 100;
            const value = this.value ?? 0;
            const range = max - min;
            const width = range === 0 ? 0 : Math.fround(((value - min) / range) * 100);
            this.indicator?.style.setProperty('width', `${width}%`);
        });
    }
}
__decorate([
    observable
], BaseProgressBar.prototype, "indicator", void 0);
__decorate([
    attr({ attribute: 'validation-state' })
], BaseProgressBar.prototype, "validationState", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "value", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "min", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseProgressBar.prototype, "max", void 0);
//# sourceMappingURL=progress-bar.base.js.map