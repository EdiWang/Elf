import { __decorate } from "tslib";
import { attr, FASTElement, Observable, observable } from '@microsoft/fast-element';
import { toggleState } from '../utils/element-internals.js';
/**
 * The base class for a component with a toggleable checked state.
 *
 * @public
 */
export class BaseCheckbox extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The initial value of the input.
         *
         * @public
         * @remarks
         * HTML Attribute: `value`
         */
        this.initialValue = 'on';
        /**
         * Tracks whether the space key was pressed down while the checkbox was focused.
         * This is used to prevent inadvertently checking a required, unchecked checkbox when the space key is pressed on a
         * submit button and field validation is triggered.
         *
         * @internal
         */
        this._keydownPressed = false;
        /**
         * Indicates that the checked state has been changed by the user.
         *
         * @internal
         */
        this.dirtyChecked = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The fallback validation message, taken from a native checkbox `<input>` element.
         *
         * @internal
         */
        this._validationFallbackMessage = '';
        /**
         * The internal value of the input.
         *
         * @internal
         */
        this._value = this.initialValue;
    }
    /**
     * The element's current checked state.
     *
     * @public
     */
    get checked() {
        Observable.track(this, 'checked');
        return !!this._checked;
    }
    set checked(next) {
        this._checked = next;
        this.setFormValue(next ? this.value : null);
        this.setValidity();
        this.setAriaChecked();
        toggleState(this.elementInternals, 'checked', next);
        Observable.notify(this, 'checked');
    }
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    disabledChanged(prev, next) {
        if (this.disabled) {
            this.removeAttribute('tabindex');
        }
        else {
            // If author sets tabindex to a non-positive value, the component should
            // respect it, otherwise set it to 0 to avoid the anti-pattern of setting
            // tabindex to a positive number. See details:
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
            this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
        }
        this.elementInternals.ariaDisabled = this.disabled ? 'true' : 'false';
        toggleState(this.elementInternals, 'disabled', this.disabled);
    }
    /**
     * Sets the disabled state when the `disabled` attribute changes.
     *
     * @param prev - the previous value
     * @param next - the current value
     * @internal
     */
    disabledAttributeChanged(prev, next) {
        this.disabled = !!next;
    }
    /**
     * Updates the checked state when the `checked` attribute is changed, unless the checked state has been changed by the user.
     *
     * @param prev - The previous initial checked state
     * @param next - The current initial checked state
     * @internal
     */
    initialCheckedChanged(prev, next) {
        if (!this.dirtyChecked) {
            this.checked = !!next;
        }
    }
    /**
     * Sets the value of the input when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    initialValueChanged(prev, next) {
        this._value = next;
    }
    /**
     * Sets the validity of the control when the required state changes.
     *
     * @param prev - The previous required state
     * @param next - The current required state
     * @internal
     */
    requiredChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.setValidity();
            this.elementInternals.ariaRequired = this.required ? 'true' : 'false';
        }
    }
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form() {
        return this.elementInternals.form;
    }
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
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        if (this.elementInternals.validationMessage) {
            return this.elementInternals.validationMessage;
        }
        if (!this._validationFallbackMessage) {
            const validationMessageFallbackControl = document.createElement('input');
            validationMessageFallbackControl.type = 'checkbox';
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
     * The current value of the input.
     *
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this.$fastController.isConnected) {
            this.setFormValue(value);
            this.setValidity();
            Observable.notify(this, 'value');
        }
    }
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
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
     * Toggles the checked state when the user clicks the element.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e) {
        if (this.disabled) {
            return;
        }
        this.dirtyChecked = true;
        const previousChecked = this.checked;
        this.toggleChecked();
        if (previousChecked !== this.checked) {
            this.$emit('change');
            this.$emit('input');
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.disabled = !!this.disabledAttribute;
        this.setAriaChecked();
        this.setValidity();
    }
    /**
     * Updates the form value when a user changes the `checked` state.
     *
     * @param e - the event object
     * @internal
     */
    inputHandler(e) {
        this.setFormValue(this.value);
        this.setValidity();
        return true;
    }
    /**
     * Prevents scrolling when the user presses the space key, and sets a flag to indicate that the space key was pressed
     * down while the checkbox was focused.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e) {
        if (e.key !== ' ') {
            return true;
        }
        this._keydownPressed = true;
    }
    /**
     * Toggles the checked state when the user releases the space key.
     *
     * @param e - the event object
     * @internal
     */
    keyupHandler(e) {
        if (!this._keydownPressed || e.key !== ' ') {
            return true;
        }
        this._keydownPressed = false;
        this.click();
    }
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.checked = this.initialChecked ?? false;
        this.dirtyChecked = false;
        this.setValidity();
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
     * Sets the ARIA checked state.
     *
     * @param value - The checked state
     * @internal
     */
    setAriaChecked(value = this.checked) {
        this.elementInternals.ariaChecked = value ? 'true' : 'false';
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
     * Sets a custom validity message.
     *
     * @param message - The message to set
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: true }, message);
        this.setValidity();
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
            if (this.disabled || !this.required) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity({ valueMissing: !!this.required && !this.checked, ...flags }, message ?? this.validationMessage, anchor);
        }
    }
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force = !this.checked) {
        this.checked = force;
    }
}
__decorate([
    attr({ mode: 'boolean' })
], BaseCheckbox.prototype, "autofocus", void 0);
__decorate([
    observable
], BaseCheckbox.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'disabled', mode: 'boolean' })
], BaseCheckbox.prototype, "disabledAttribute", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseCheckbox.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'checked', mode: 'boolean' })
], BaseCheckbox.prototype, "initialChecked", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], BaseCheckbox.prototype, "initialValue", void 0);
__decorate([
    attr
], BaseCheckbox.prototype, "name", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseCheckbox.prototype, "required", void 0);
//# sourceMappingURL=checkbox.base.js.map