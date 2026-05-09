import { __decorate } from "tslib";
import { attr, css, FASTElement, observable, Observable, Updates } from '@microsoft/fast-element';
import { Direction } from '../utils/direction.js';
import { limit } from '../utils/numbers.js';
import { Orientation } from '../utils/orientation.js';
import { numberLikeStringConverter } from '../utils/converters.js';
import { getDirection } from '../utils/direction.js';
import { convertPixelToPercent } from './slider-utilities.js';
import { SliderMode, SliderOrientation } from './slider.options.js';
/**
 * The base class used for constructing a fluent-slider custom element
 *
 * @tag fluent-slider
 *
 * @slot thumb - The slot for a custom thumb element.
 * @csspart thumb-container - The container element of the thumb.
 * @csspart track-container - The container element of the track.
 * @fires change - Fires a custom 'change' event when the value changes.
 *
 * @public
 */
export class Slider extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * A reference to all associated `<label>` elements.
     *
     * @public
     */
    get labels() {
        return Object.freeze(Array.from(this.elementInternals.labels));
    }
    handleChange(_, propertyName) {
        switch (propertyName) {
            case 'min':
            case 'max':
                this.setSliderPosition();
            case 'step':
                this.handleStepStyles();
                break;
        }
    }
    /**
     * Handles changes to step styling based on the step value
     * NOTE: This function is not a changed callback, stepStyles is not observable
     */
    handleStepStyles() {
        if (this.step) {
            const totalSteps = (100 / Math.floor((this.maxAsNumber - this.minAsNumber) / this.stepAsNumber));
            if (this.stepStyles !== undefined) {
                this.$fastController.removeStyles(this.stepStyles);
            }
            this.stepStyles = css /**css*/ `
        :host {
          --step-rate: ${totalSteps}%;
        }
      `;
            this.$fastController.addStyles(this.stepStyles);
        }
        else if (this.stepStyles !== undefined) {
            this.$fastController.removeStyles(this.stepStyles);
        }
    }
    /**
     * Sets the value of the input when the value attribute changes.
     *
     * @param prev - The previous value
     * @param next - The current value
     * @internal
     */
    initialValueChanged(_, next) {
        if (this.$fastController.isConnected) {
            this.value = next;
        }
        else {
            this._value = next;
        }
    }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The element's validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validationMessage | `ElemenentInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage;
    }
    /**
     * Whether the element is a candidate for its owning form's constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/willValidate | `ElemenentInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
    }
    /**
     * Checks the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/checkValidity | `ElemenentInternals.checkValidity`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Reports the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/reportValidity | `ElemenentInternals.reportValidity`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Sets a custom validity message.
     * @public
     */
    setCustomValidity(message) {
        this.setValidity({ customError: !!message }, message);
    }
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected) {
            if (this.isDisabled) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity({ customError: !!message, ...flags }, message ?? this.validationMessage, anchor);
        }
    }
    /**
     * The current value of the input.
     *
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this._value?.toString() ?? '';
    }
    set value(value) {
        if (!this.$fastController.isConnected) {
            this._value = value.toString();
            return;
        }
        const nextAsNumber = parseFloat(value);
        const newValue = limit(this.minAsNumber, this.maxAsNumber, this.convertToConstrainedValue(nextAsNumber)).toString();
        if (newValue !== value) {
            this.value = newValue;
            return;
        }
        this._value = value.toString();
        this.elementInternals.ariaValueNow = this._value;
        this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
        this.setSliderPosition();
        this.$emit('change');
        this.setFormValue(value);
        Observable.notify(this, 'value');
    }
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.initialValue ?? this.midpoint;
    }
    /**
     * Disabled the component when its associated form is disabled.
     *
     * @internal
     *
     * @privateRemarks
     * DO NOT change the `disabled` property or attribute here, because if the
     * `disabled` attribute is present, reenabling an ancestor `<fieldset>`
     * element will not reenabling this component.
     */
    formDisabledCallback(disabled) {
        this.setDisabledSideEffect(disabled);
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    directionChanged() {
        this.setSliderPosition();
    }
    /**
     * The value property, typed as a number.
     *
     * @public
     */
    get valueAsNumber() {
        return parseFloat(this.value);
    }
    set valueAsNumber(next) {
        this.value = next.toString();
    }
    valueTextFormatterChanged() {
        if (typeof this.valueTextFormatter === 'function') {
            this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
        }
        else {
            this.elementInternals.ariaValueText = '';
        }
    }
    disabledChanged() {
        this.setDisabledSideEffect(this.disabled);
    }
    /**
     * Returns true if the component is disabled, taking into account the `disabled`
     * attribute, `aria-disabled` attribute, and the `:disabled` pseudo-class.
     *
     * @internal
     */
    get isDisabled() {
        return (this.disabled || this.elementInternals?.ariaDisabled === 'true' || (this.isConnected && this.matches(':disabled')));
    }
    minChanged() {
        this.elementInternals.ariaValueMin = `${this.minAsNumber}`;
        if (this.$fastController.isConnected && this.minAsNumber > this.valueAsNumber) {
            this.value = this.min;
        }
    }
    /**
     * Returns the min property or the default value
     *
     * @internal
     */
    get minAsNumber() {
        if (this.min !== undefined) {
            const parsed = parseFloat(this.min);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return 0;
    }
    maxChanged() {
        this.elementInternals.ariaValueMax = `${this.maxAsNumber}`;
        if (this.$fastController.isConnected && this.maxAsNumber < this.valueAsNumber) {
            this.value = this.max;
        }
    }
    /**
     * Returns the max property or the default value
     *
     * @internal
     */
    get maxAsNumber() {
        if (this.max !== undefined) {
            const parsed = parseFloat(this.max);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return 100;
    }
    stepChanged() {
        this.updateStepMultiplier();
        // Update value to align with the new step if needed.
        if (this.$fastController.isConnected) {
            this.value = this._value;
        }
    }
    /**
     * Returns the step property as a number.
     *
     * @internal
     */
    get stepAsNumber() {
        if (this.step !== undefined) {
            const parsed = parseFloat(this.step);
            if (!Number.isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        return 1;
    }
    orientationChanged(prev, next) {
        this.elementInternals.ariaOrientation = next ?? Orientation.horizontal;
        if (this.$fastController.isConnected) {
            this.setSliderPosition();
        }
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
         * @internal
         */
        this.direction = Direction.ltr;
        /**
         * @internal
         */
        this.isDragging = false;
        /**
         * @internal
         */
        this.trackWidth = 0;
        /**
         * @internal
         */
        this.trackMinWidth = 0;
        /**
         * @internal
         */
        this.trackHeight = 0;
        /**
         * @internal
         */
        this.trackLeft = 0;
        /**
         * @internal
         */
        this.trackMinHeight = 0;
        /**
         * Custom function that generates a string for the component's "ariaValueText" on element internals based on the current value.
         *
         * @public
         */
        this.valueTextFormatter = () => '';
        /**
         * The element's disabled state.
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * The minimum allowed value.
         *
         * @public
         * @remarks
         * HTML Attribute: min
         */
        this.min = '';
        /**
         * The maximum allowed value.
         *
         * @public
         * @remarks
         * HTML Attribute: max
         */
        this.max = '';
        /**
         * Value to increment or decrement via arrow keys, mouse click or drag.
         *
         * @public
         * @remarks
         * HTML Attribute: step
         */
        this.step = '';
        /**
         * The selection mode.
         *
         * @public
         * @remarks
         * HTML Attribute: mode
         */
        this.mode = SliderMode.singleValue;
        this.setupTrackConstraints = () => {
            const clientRect = this.track.getBoundingClientRect();
            this.trackWidth = this.track.clientWidth;
            this.trackMinWidth = this.track.clientLeft;
            this.trackHeight = clientRect.top;
            this.trackMinHeight = clientRect.bottom;
            this.trackLeft = this.getBoundingClientRect().left;
            if (this.trackWidth === 0) {
                this.trackWidth = 1;
            }
        };
        /**
         *  Handle mouse moves during a thumb drag operation
         *  If the event handler is null it removes the events
         */
        this.handleThumbPointerDown = (event) => {
            if (this.isDisabled) {
                return true;
            }
            const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
            windowFn('pointerup', this.handleWindowPointerUp);
            windowFn('pointermove', this.handlePointerMove, { passive: true });
            windowFn('touchmove', this.handlePointerMove, { passive: true });
            windowFn('touchend', this.handleWindowPointerUp);
            this.isDragging = event !== null;
            return true;
        };
        /**
         *  Handle mouse moves during a thumb drag operation
         */
        this.handlePointerMove = (event) => {
            if (this.isDisabled || event.defaultPrevented) {
                return;
            }
            // update the value based on current position
            const sourceEvent = window.TouchEvent && event instanceof TouchEvent ? event.touches[0] : event;
            const thumbWidth = this.thumb.getBoundingClientRect().width;
            const eventValue = this.orientation === Orientation.vertical
                ? sourceEvent.pageY - document.documentElement.scrollTop
                : sourceEvent.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
            this.value = `${this.calculateNewValue(eventValue)}`;
        };
        /**
         * Handle a window mouse up during a drag operation
         */
        this.handleWindowPointerUp = () => {
            this.stopDragging();
        };
        this.stopDragging = () => {
            this.isDragging = false;
            this.handlePointerDown(null);
            this.handleThumbPointerDown(null);
        };
        /**
         *
         * @param event - PointerEvent or null. If there is no event handler it will remove the events
         */
        this.handlePointerDown = (event) => {
            if (event === null || !this.isDisabled) {
                const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
                const documentFn = event !== null ? document.addEventListener : document.removeEventListener;
                windowFn('pointerup', this.handleWindowPointerUp);
                documentFn('mouseleave', this.handleWindowPointerUp);
                windowFn('pointermove', this.handlePointerMove);
                const thumbWidth = this.thumb.getBoundingClientRect().width;
                if (event) {
                    this.setupTrackConstraints();
                    const controlValue = this.orientation === Orientation.vertical
                        ? event.pageY - document.documentElement.scrollTop
                        : event.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
                    this.value = `${this.calculateNewValue(controlValue)}`;
                }
            }
            return true;
        };
        this.elementInternals.role = 'slider';
        this.elementInternals.ariaOrientation = this.orientation ?? SliderOrientation.horizontal;
    }
    connectedCallback() {
        super.connectedCallback();
        requestAnimationFrame(() => {
            if (!this.$fastController.isConnected) {
                // The component may have been disconnected between the connectedCallback and this frame.
                // This can happen during rapid DOM updates, framework-level element recycling, or SSR/DSD hydration teardown.
                // Bail out to avoid performing setup work on a detached element.
                return;
            }
            this.direction = getDirection(this);
            this.setDisabledSideEffect(this.disabled);
            this.updateStepMultiplier();
            this.setupTrackConstraints();
            this.setupDefaultValue();
            this.setSliderPosition();
            this.handleStepStyles();
            const notifier = Observable.getNotifier(this);
            notifier.subscribe(this, 'max');
            notifier.subscribe(this, 'min');
            notifier.subscribe(this, 'step');
        });
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        const notifier = Observable.getNotifier(this);
        notifier.unsubscribe(this, 'max');
        notifier.unsubscribe(this, 'min');
        notifier.unsubscribe(this, 'step');
    }
    /**
     * Increment the value by the step
     *
     * @public
     */
    increment() {
        const newVal = this.direction !== Direction.rtl
            ? Number(this.value) + this.stepAsNumber
            : Number(this.value) - this.stepAsNumber;
        const incrementedVal = this.convertToConstrainedValue(newVal);
        const incrementedValString = incrementedVal < this.maxAsNumber ? `${incrementedVal}` : `${this.maxAsNumber}`;
        this.value = incrementedValString;
    }
    /**
     * Decrement the value by the step
     *
     * @public
     */
    decrement() {
        const newVal = this.direction !== Direction.rtl
            ? Number(this.value) - Number(this.stepAsNumber)
            : Number(this.value) + Number(this.stepAsNumber);
        const decrementedVal = this.convertToConstrainedValue(newVal);
        const decrementedValString = decrementedVal > this.minAsNumber ? `${decrementedVal}` : `${this.minAsNumber}`;
        this.value = decrementedValString;
    }
    handleKeydown(event) {
        if (this.isDisabled) {
            return true;
        }
        switch (event.key) {
            case 'Home':
                event.preventDefault();
                this.value =
                    this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                        ? `${this.minAsNumber}`
                        : `${this.maxAsNumber}`;
                break;
            case 'End':
                event.preventDefault();
                this.value =
                    this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                        ? `${this.maxAsNumber}`
                        : `${this.minAsNumber}`;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                if (!event.shiftKey) {
                    event.preventDefault();
                    this.increment();
                }
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                if (!event.shiftKey) {
                    event.preventDefault();
                    this.decrement();
                }
                break;
        }
        return true;
    }
    /**
     * Places the thumb based on the current value
     */
    setSliderPosition() {
        const newPct = convertPixelToPercent(parseFloat(this.value), this.minAsNumber, this.maxAsNumber, this.orientation === Orientation.vertical ? undefined : this.direction);
        const percentage = newPct * 100;
        this.position = `--slider-thumb: ${percentage}%; --slider-progress: ${percentage}%`;
    }
    /**
     * Update the step multiplier used to ensure rounding errors from steps that
     * are not whole numbers
     */
    updateStepMultiplier() {
        const stepString = this.stepAsNumber + '';
        const decimalPlacesOfStep = !!(this.stepAsNumber % 1) ? stepString.length - stepString.indexOf('.') - 1 : 0;
        this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
    }
    get midpoint() {
        return `${this.convertToConstrainedValue((this.maxAsNumber + this.minAsNumber) / 2)}`;
    }
    setupDefaultValue() {
        if (!this._value) {
            this.value = this.initialValue ?? this.midpoint;
        }
        if (!Number.isNaN(this.valueAsNumber) &&
            (this.valueAsNumber < this.minAsNumber || this.valueAsNumber > this.maxAsNumber)) {
            this.value = this.midpoint;
        }
        this.elementInternals.ariaValueNow = this.value;
    }
    /**
     * Calculate the new value based on the given raw pixel value.
     *
     * @param rawValue - the value to be converted to a constrained value
     * @returns the constrained value
     *
     * @internal
     */
    calculateNewValue(rawValue) {
        this.setupTrackConstraints();
        // update the value based on current position
        const newPosition = convertPixelToPercent(rawValue, this.orientation === Orientation.vertical ? this.trackMinHeight : this.trackMinWidth, this.orientation === Orientation.vertical ? this.trackHeight : this.trackWidth, this.orientation === Orientation.vertical ? undefined : this.direction);
        const newValue = (this.maxAsNumber - this.minAsNumber) * newPosition + this.minAsNumber;
        return this.convertToConstrainedValue(newValue);
    }
    convertToConstrainedValue(value) {
        if (isNaN(value)) {
            value = this.minAsNumber;
        }
        /**
         * The following logic intends to overcome the issue with math in JavaScript with regards to floating point numbers.
         * This is needed as the `step` may be an integer but could also be a float. To accomplish this the step  is assumed to be a float
         * and is converted to an integer by determining the number of decimal places it represent, multiplying it until it is an
         * integer and then dividing it to get back to the correct number.
         */
        let constrainedValue = value - this.minAsNumber;
        const roundedConstrainedValue = Math.round(constrainedValue / this.stepAsNumber);
        const remainderValue = constrainedValue - (roundedConstrainedValue * (this.stepMultiplier * this.stepAsNumber)) / this.stepMultiplier;
        constrainedValue =
            remainderValue >= Number(this.stepAsNumber) / 2
                ? constrainedValue - remainderValue + Number(this.stepAsNumber)
                : constrainedValue - remainderValue;
        return constrainedValue + this.minAsNumber;
    }
    /**
     * Makes sure the side effects of set up when the disabled state changes.
     */
    setDisabledSideEffect(disabled = this.isDisabled) {
        Updates.enqueue(() => {
            this.elementInternals.ariaDisabled = disabled.toString();
            this.tabIndex = disabled ? -1 : 0;
        });
    }
}
__decorate([
    attr
], Slider.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], Slider.prototype, "initialValue", void 0);
__decorate([
    observable
], Slider.prototype, "direction", void 0);
__decorate([
    observable
], Slider.prototype, "isDragging", void 0);
__decorate([
    observable
], Slider.prototype, "position", void 0);
__decorate([
    observable
], Slider.prototype, "trackWidth", void 0);
__decorate([
    observable
], Slider.prototype, "trackMinWidth", void 0);
__decorate([
    observable
], Slider.prototype, "trackHeight", void 0);
__decorate([
    observable
], Slider.prototype, "trackLeft", void 0);
__decorate([
    observable
], Slider.prototype, "trackMinHeight", void 0);
__decorate([
    observable
], Slider.prototype, "valueTextFormatter", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Slider.prototype, "disabled", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "min", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "max", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "step", void 0);
__decorate([
    attr
], Slider.prototype, "orientation", void 0);
__decorate([
    attr
], Slider.prototype, "mode", void 0);
//# sourceMappingURL=slider.js.map