import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, Observable, observable, Updates, } from '@microsoft/fast-element';
import { ImplicitSubmissionBlockingTypes, TextInputType } from './text-input.options.js';
/**
 * A Text Input Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | `<input>`} element.
 *
 * @slot start - Content which can be provided before the input
 * @slot end - Content which can be provided after the input
 * @slot - The default slot for button content
 * @csspart label - The internal `<label>` element
 * @csspart root - the root container for the internal control
 * @csspart control - The internal `<input>` control
 * @public
 */
export class BaseTextInput extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Allows setting a type or mode of text.
         *
         * @public
         * @remarks
         * HTML Attribute: `type`
         */
        this.type = TextInputType.text;
        /**
         * Indicates that the value has been changed by the user.
         *
         * @internal
         */
        this.dirtyValue = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
    }
    /**
     * Tracks the current value of the input.
     *
     * @param prev - the previous value
     * @param next - the next value
     *
     * @internal
     */
    currentValueChanged(prev, next) {
        this.value = next;
    }
    /**
     * Updates the control label visibility based on the presence of default slotted content.
     *
     * @internal
     */
    defaultSlottedNodesChanged(prev, next) {
        Updates.enqueue(() => {
            if (this.controlLabel) {
                this.controlLabel.hidden = !next?.some(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim()));
            }
        });
    }
    /**
     * Sets the value of the element to the initial value.
     *
     * @internal
     */
    initialValueChanged() {
        if (!this.dirtyValue) {
            this.value = this.initialValue;
        }
    }
    /**
     * Syncs the `ElementInternals.ariaReadOnly` property when the `readonly` property changes.
     *
     * @internal
     */
    readOnlyChanged() {
        if (this.$fastController.isConnected) {
            this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
        }
    }
    /**
     * Syncs the element's internal `aria-required` state with the `required` attribute.
     *
     * @param previous - the previous required state
     * @param next - the current required state
     *
     * @internal
     */
    requiredChanged(previous, next) {
        if (this.$fastController.isConnected) {
            this.elementInternals.ariaRequired = `${!!next}`;
        }
    }
    /**
     * Calls the `setValidity` method when the control reference changes.
     *
     * @param prev - the previous control reference
     * @param next - the current control reference
     *
     * @internal
     */
    controlChanged(prev, next) {
        Updates.enqueue(() => {
            if (this.$fastController.isConnected) {
                this.setValidity();
            }
        });
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
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
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage || this.control.validationMessage;
    }
    /**
     * The current value of the input.
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this.currentValue;
    }
    set value(value) {
        this.currentValue = value;
        if (this.$fastController.isConnected) {
            this.control.value = value ?? '';
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
     * The associated form element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * Handles the internal control's `keypress` event.
     *
     * @internal
     */
    beforeinputHandler(e) {
        if (e.inputType === 'insertLineBreak') {
            this.implicitSubmit();
        }
        return true;
    }
    /**
     * Change event handler for inner control.
     *
     * @internal
     * @privateRemarks
     * "Change" events are not `composable` so they will not permeate the shadow DOM boundary. This function effectively
     * proxies the change event, emitting a `change` event whenever the internal control emits a `change` event.
     */
    changeHandler(e) {
        this.setValidity();
        this.$emit('change', e, {
            bubbles: true,
            composed: true,
        });
        return true;
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
     * Clicks the inner control when the component is clicked.
     *
     * @param e - the event object
     */
    clickHandler(e) {
        if (e.target === this) {
            this.control?.click();
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * Focuses the inner control when the component is focused.
     *
     * @param e - the event object
     * @public
     */
    focusinHandler(e) {
        if (e.target === this) {
            this.control?.focus();
        }
        return true;
    }
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.initialValue;
        this.dirtyValue = false;
    }
    /**
     * Handles implicit form submission when the user presses the "Enter" key.
     *
     * @internal
     */
    implicitSubmit() {
        if (!this.elementInternals.form) {
            return;
        }
        if (this.elementInternals.form.elements.length === 1) {
            this.elementInternals.form.requestSubmit();
            return;
        }
        const formElements = [...this.elementInternals.form.elements];
        // Try submitting with the first submit button, if any
        const submitButton = formElements.find(x => x.getAttribute('type') === 'submit');
        if (submitButton) {
            submitButton.click();
            return;
        }
        // Determine if there is only one implicit submission blocking element
        const filteredElements = formElements.filter(x => ImplicitSubmissionBlockingTypes.includes(x.getAttribute('type') ?? ''));
        if (filteredElements.length > 1) {
            return;
        }
        this.elementInternals.form.requestSubmit();
    }
    /**
     * Handles the internal control's `input` event.
     *
     * @internal
     */
    inputHandler(e) {
        this.dirtyValue = true;
        this.value = this.control.value;
        return true;
    }
    /**
     * Handles the internal control's `keydown` event.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e) {
        if (e.key === 'Enter') {
            this.implicitSubmit();
        }
        return true;
    }
    /**
     * Selects all the text in the text field.
     *
     * @public
     * @privateRemarks
     * The `select` event does not permeate the shadow DOM boundary. This function effectively proxies the event,
     * emitting a `select` event whenever the internal control emits a `select` event
     *
     */
    select() {
        this.control.select();
        this.$emit('select');
    }
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: true }, message);
        this.reportValidity();
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
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected && this.control) {
            if (this.disabled) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity(flags ?? this.control.validity, message ?? this.validationMessage, anchor ?? this.control);
        }
    }
}
__decorate([
    attr
], BaseTextInput.prototype, "autocomplete", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "autofocus", void 0);
__decorate([
    attr({ attribute: 'current-value' })
], BaseTextInput.prototype, "currentValue", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "defaultSlottedNodes", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "dirname", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseTextInput.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], BaseTextInput.prototype, "initialValue", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "list", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "maxlength", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "minlength", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "multiple", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "name", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "pattern", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "placeholder", void 0);
__decorate([
    attr({ attribute: 'readonly', mode: 'boolean' })
], BaseTextInput.prototype, "readOnly", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "required", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "size", void 0);
__decorate([
    attr({
        converter: {
            fromView: value => (typeof value === 'string' ? ['true', ''].includes(value.trim().toLowerCase()) : null),
            toView: value => value.toString(),
        },
    })
], BaseTextInput.prototype, "spellcheck", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "type", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "control", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "controlLabel", void 0);
//# sourceMappingURL=text-input.base.js.map