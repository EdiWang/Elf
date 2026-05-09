import { __decorate } from "tslib";
import { attr, FASTElement, Observable, observable } from '@microsoft/fast-element';
import { isRadio } from '../radio/radio.options.js';
import { RadioGroupOrientation } from './radio-group.options.js';
/**
 * A Base Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @public
 */
export class BaseRadioGroup extends FASTElement {
    /**
     * Sets the checked state of the nearest enabled radio when the `checkedIndex` changes.
     *
     * @param prev - the previous index
     * @param next - the current index
     * @internal
     */
    checkedIndexChanged(prev, next) {
        if (!this.enabledRadios) {
            return;
        }
        this.checkRadio(next);
    }
    /**
     * Sets the `disabled` attribute on all child radios when the `disabled` property changes.
     *
     * @param prev - the previous disabled value
     * @param next - the current disabled value
     * @internal
     */
    disabledChanged(prev, next) {
        if (this.radios) {
            this.checkedIndex = -1;
            this.radios?.forEach(radio => {
                radio.disabled = !!radio.disabledAttribute || !!this.disabled;
            });
        }
    }
    /**
     * Sets the matching radio to checked when the value changes. If no radio matches the value, no radio will be checked.
     *
     * @param prev - the previous value
     * @param next - the current value
     */
    initialValueChanged(prev, next) {
        this.value = next ?? '';
    }
    /**
     * Sets the `name` attribute on all child radios when the `name` property changes.
     *
     * @internal
     */
    nameChanged(prev, next) {
        if (this.isConnected && next) {
            this.radios?.forEach(radio => {
                radio.name = this.name;
            });
        }
    }
    /**
     * Sets the ariaOrientation attribute when the orientation changes.
     *
     * @param prev - the previous orientation
     * @param next - the current orientation
     * @internal
     */
    orientationChanged(prev, next) {
        this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
    }
    /**
     * Updates the enabled radios collection when properties on the child radios change.
     *
     * @param prev - the previous radios
     * @param next - the current radios
     */
    radiosChanged(prev, next) {
        const setSize = next?.length;
        if (!setSize) {
            return;
        }
        if (!this.name && next.every(x => x.name === next[0].name)) {
            this.name = next[0].name;
        }
        const checkedIndex = this.enabledRadios.findLastIndex(x => x.initialChecked);
        next.forEach((radio, index) => {
            radio.ariaPosInSet = `${index + 1}`;
            radio.ariaSetSize = `${setSize}`;
            if (this.initialValue && !this.dirtyState) {
                radio.checked = radio.value === this.initialValue;
            }
            else {
                radio.checked = index === checkedIndex;
            }
            radio.name = this.name ?? radio.name;
            radio.disabled = !!this.disabled || !!radio.disabledAttribute;
            radio.toggleAttribute('focusgroupstart', radio.checked && !radio.disabled);
        });
        if (!this.dirtyState && this.initialValue) {
            this.value = this.initialValue;
        }
        if (!this.value ||
            // This logic covers the case when the RadioGroup doesn't have a `value`
            (this.value && typeof this.checkedIndex !== 'number' && checkedIndex >= 0)) {
            this.checkedIndex = checkedIndex;
        }
        // prettier-ignore
        const radioIds = next.map(radio => radio.id).join(' ').trim();
        if (radioIds) {
            this.setAttribute('aria-owns', radioIds);
        }
    }
    /**
     *
     * @param prev - the previous required value
     * @param next - the current required value
     */
    requiredChanged(prev, next) {
        this.elementInternals.ariaRequired = next ? 'true' : null;
        this.setValidity();
    }
    /**
     * Updates the radios collection when the slotted radios change.
     *
     * @param prev - the previous slotted radios
     * @param next - the current slotted radios
     */
    slottedRadiosChanged(prev, next) {
        this.radios = [...this.querySelectorAll('*')].filter(x => isRadio(x));
    }
    /**
     * A collection of child radios that are not disabled.
     *
     * @internal
     */
    get enabledRadios() {
        if (this.disabled) {
            return [];
        }
        return this.radios?.filter(x => !x.disabled) ?? [];
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @internal
     */
    get validationMessage() {
        if (this.elementInternals.validationMessage) {
            return this.elementInternals.validationMessage;
        }
        if (this.enabledRadios?.[0]?.validationMessage) {
            return this.enabledRadios[0].validationMessage;
        }
        if (!this._validationFallbackMessage) {
            const validationMessageFallbackControl = document.createElement('input');
            validationMessageFallbackControl.type = 'radio';
            validationMessageFallbackControl.required = true;
            validationMessageFallbackControl.checked = false;
            this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
        }
        return this._validationFallbackMessage;
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
     * The current value of the checked radio.
     *
     * @public
     */
    get value() {
        Observable.notify(this, 'value');
        return this.enabledRadios.find(x => x.checked)?.value ?? null;
    }
    set value(next) {
        const index = this.enabledRadios.findIndex(x => x.value === next);
        this.checkedIndex = index;
        if (this.$fastController.isConnected) {
            this.setFormValue(next);
            this.setValidity();
        }
        Observable.track(this, 'value');
    }
    /**
     * Sets the checked state of all radios when any radio emits a `change` event.
     *
     * @param e - the change event
     */
    changeHandler(e) {
        if (this === e.target) {
            return true;
        }
        this.dirtyState = true;
        const radioIndex = this.enabledRadios.indexOf(e.target);
        this.checkRadio(radioIndex);
        this.radios
            ?.filter(x => x.disabled)
            ?.forEach(item => {
            item.checked = false;
        });
        return true;
    }
    /**
     * Checks the radio at the specified index.
     *
     * @param index - the index of the radio to check
     * @internal
     */
    checkRadio(index = this.checkedIndex, shouldEmit = false) {
        let checkedIndex = this.checkedIndex;
        this.enabledRadios.forEach((item, i) => {
            const shouldCheck = i === index;
            item.checked = shouldCheck;
            if (shouldCheck) {
                checkedIndex = i;
                if (shouldEmit) {
                    item.$emit('change');
                }
            }
        });
        this.checkedIndex = checkedIndex;
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Handles click events for the radio group.
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(e) {
        if (this === e.target) {
            this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
        }
        return true;
    }
    constructor() {
        super();
        this.isNavigating = false;
        /**
         * Indicates that the value has been changed by the user.
         */
        this.dirtyState = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'radiogroup';
        this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
    }
    /**
     * Focuses the checked radio or the first enabled radio.
     *
     * @internal
     */
    focus() {
        this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
    }
    formResetCallback() {
        this.dirtyState = false;
        this.checkedIndex = -1;
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * Enables tabbing through the radio group when the group receives focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e) {
        if (!this.disabled && (this.isNavigating || this.value)) {
            // Uncheck the checked disabled radio, if any.
            this.radios?.forEach(radio => {
                if (radio.disabled && radio.checked) {
                    radio.checked = false;
                }
            });
            const index = this.enabledRadios.indexOf(e.target);
            if (index > -1) {
                this.checkRadio(index, true);
            }
            this.isNavigating = false;
        }
        return true;
    }
    /**
     * Handles keydown events for the radio group.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'Home':
            case 'End':
                this.isNavigating = true;
                break;
            case ' ':
                this.checkRadio();
                break;
        }
        return true;
    }
    /**
     *
     * @param e - the disabled event
     */
    disabledRadioHandler(e) {
        if (e.detail === true && e.target.checked) {
            this.checkedIndex = -1;
        }
    }
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     * @remarks
     * RadioGroup validation is reported through the individual Radio elements rather than the RadioGroup itself.
     * This is necessary because:
     * 1. Each Radio is form-associated (extends BaseCheckbox which has `formAssociated = true`)
     * 2. Browser validation UIs and screen readers announce validation against individual form controls
     * 3. For groups like RadioGroup, the browser needs to report the error on a specific member of the group
     * 4. We anchor the error to the first Radio so it receives focus and announcement
     *
     * When the group is invalid (required but no selection):
     * - Only the first Radio gets the invalid state with the validation message
     * - Other Radios are kept valid since selecting any of them would satisfy the requirement
     *
     * When the group becomes valid (user selects any Radio):
     * - All Radios are cleared back to valid state
     * - This allows form submission to proceed
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected) {
            // Always check if still required and has no value
            const isInvalid = this.required && !this.value && !this.disabled;
            if (!isInvalid) {
                // Clear validity on all radios when group is valid
                this.enabledRadios?.forEach(radio => {
                    radio.elementInternals.setValidity({});
                });
                return;
            }
            // Group is invalid - set error only on first enabled radio for announcement
            const validationFlags = { valueMissing: true, ...flags };
            const validationMessage = message ?? this.validationMessage;
            this.enabledRadios?.forEach((radio, index) => {
                if (index === 0) {
                    // Only the first radio shows the validation error for screen reader announcement
                    radio.elementInternals.setValidity(validationFlags, validationMessage, radio);
                }
                else {
                    // Other radios are valid (they're just not selected yet)
                    radio.elementInternals.setValidity({});
                }
            });
        }
    }
}
__decorate([
    observable
], BaseRadioGroup.prototype, "checkedIndex", void 0);
__decorate([
    attr({ attribute: 'disabled', mode: 'boolean' })
], BaseRadioGroup.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], BaseRadioGroup.prototype, "initialValue", void 0);
__decorate([
    attr
], BaseRadioGroup.prototype, "name", void 0);
__decorate([
    attr
], BaseRadioGroup.prototype, "orientation", void 0);
__decorate([
    observable
], BaseRadioGroup.prototype, "radios", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseRadioGroup.prototype, "required", void 0);
__decorate([
    observable
], BaseRadioGroup.prototype, "slottedRadios", void 0);
//# sourceMappingURL=radio-group.base.js.map