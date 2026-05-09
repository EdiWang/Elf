import { __decorate } from "tslib";
import { attr, FASTElement, observable } from '@microsoft/fast-element';
import { ButtonType } from './button.options.js';
/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | `<button>`} element.
 *
 * @slot start - Content which can be provided before the button content
 * @slot end - Content which can be provided after the button content
 * @slot - The default slot for button content
 * @csspart content - The button content container
 *
 * @public
 */
export class BaseButton extends FASTElement {
    /**
     * Handles changes to the disabled attribute. If the button is disabled, it
     * should not be focusable.
     *
     * @param previous - the previous disabled value
     * @param next - the new disabled value
     * @internal
     */
    disabledChanged() {
        this.setTabIndex();
    }
    /**
     * Sets the element's internal disabled state when the element is focusable while disabled.
     *
     * @param previous - the previous disabledFocusable value
     * @param next - the current disabledFocusable value
     * @internal
     */
    disabledFocusableChanged(previous, next) {
        if (this.elementInternals) {
            this.elementInternals.ariaDisabled = `${!!next}`;
        }
    }
    /**
     * The associated form element.
     *
     * @public
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
     * A reference to all associated label elements.
     *
     * @public
     */
    get labels() {
        return Object.freeze(Array.from(this.elementInternals.labels));
    }
    /**
     * Removes the form submission fallback control when the type changes.
     *
     * @param previous - the previous type value
     * @param next - the new type value
     * @internal
     */
    typeChanged(previous, next) {
        if (next !== ButtonType.submit) {
            this.formSubmissionFallbackControl?.remove();
            this.shadowRoot?.querySelector('slot[name="internal"]')?.remove();
        }
    }
    /**
     * Handles the button click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e) {
        if (e && this.disabledFocusable) {
            e.stopImmediatePropagation();
            return;
        }
        this.press();
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.elementInternals.ariaDisabled = `${!!this.disabledFocusable}`;
        this.setTabIndex();
    }
    constructor() {
        super();
        /**
         * Indicates that the button is focusable while disabled.
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled-focusable`
         */
        this.disabledFocusable = false;
        /**
         * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'button';
    }
    /**
     * This fallback creates a new slot, then creates a submit button to mirror the custom element's
     * properties. The submit button is then appended to the slot and the form is submitted.
     *
     * @internal
     * @privateRemarks
     * This is a workaround until {@link https://github.com/WICG/webcomponents/issues/814 | WICG/webcomponents/issues/814} is resolved.
     */
    createAndInsertFormSubmissionFallbackControl() {
        const internalSlot = this.formSubmissionFallbackControlSlot ?? document.createElement('slot');
        internalSlot.setAttribute('name', 'internal');
        this.shadowRoot?.appendChild(internalSlot);
        this.formSubmissionFallbackControlSlot = internalSlot;
        const fallbackControl = this.formSubmissionFallbackControl ?? document.createElement('button');
        fallbackControl.style.display = 'none';
        fallbackControl.setAttribute('type', 'submit');
        fallbackControl.setAttribute('slot', 'internal');
        if (this.formNoValidate) {
            fallbackControl.toggleAttribute('formnovalidate', true);
        }
        if (this.elementInternals.form?.id) {
            fallbackControl.setAttribute('form', this.elementInternals.form.id);
        }
        if (this.name) {
            fallbackControl.setAttribute('name', this.name);
        }
        if (this.value) {
            fallbackControl.setAttribute('value', this.value);
        }
        if (this.formAction) {
            fallbackControl.setAttribute('formaction', this.formAction ?? '');
        }
        if (this.formEnctype) {
            fallbackControl.setAttribute('formenctype', this.formEnctype ?? '');
        }
        if (this.formMethod) {
            fallbackControl.setAttribute('formmethod', this.formMethod ?? '');
        }
        if (this.formTarget) {
            fallbackControl.setAttribute('formtarget', this.formTarget ?? '');
        }
        this.append(fallbackControl);
        this.formSubmissionFallbackControl = fallbackControl;
    }
    /**
     * Invoked when a connected component's form or fieldset has its disabled state changed.
     *
     * @param disabled - the disabled value of the form / fieldset
     *
     * @internal
     */
    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }
    /**
     * Handles keypress events for the button.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keypressHandler(e) {
        if (e && this.disabledFocusable) {
            e.stopImmediatePropagation();
            return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
            this.click();
            return;
        }
        return true;
    }
    /**
     * Presses the button.
     *
     * @public
     */
    press() {
        switch (this.type) {
            case ButtonType.reset: {
                this.resetForm();
                break;
            }
            case ButtonType.submit: {
                this.submitForm();
                break;
            }
        }
    }
    /**
     * Resets the associated form.
     *
     * @public
     */
    resetForm() {
        this.elementInternals.form?.reset();
    }
    /**
     * Sets the `tabindex` attribute based on the disabled state of the button.
     *
     * @internal
     */
    setTabIndex() {
        if (this.disabled) {
            this.removeAttribute('tabindex');
            return;
        }
        // If author sets tabindex to a non-positive value, the component should
        // respect it, otherwise set it to 0 to avoid the anti-pattern of setting
        // tabindex to a positive number. See details:
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
        this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
    }
    /**
     * Submits the associated form.
     *
     * @internal
     */
    submitForm() {
        if (!this.elementInternals.form || this.disabled || this.type !== ButtonType.submit) {
            return;
        }
        // workaround: if the button doesn't have any form overrides, the form can be submitted directly.
        if (!this.name &&
            !this.formAction &&
            !this.formEnctype &&
            !this.formAttribute &&
            !this.formMethod &&
            !this.formNoValidate &&
            !this.formTarget) {
            this.elementInternals.form.requestSubmit();
            return;
        }
        try {
            this.elementInternals.setFormValue(this.value ?? '');
            this.elementInternals.form.requestSubmit(this);
        }
        catch (e) {
            // `requestSubmit` throws an error since custom elements may not be able to submit the form.
            // This fallback creates a new slot, then creates a submit button to mirror the custom element's
            // properties. The submit button is then appended to the slot and the form is submitted.
            this.createAndInsertFormSubmissionFallbackControl();
            // workaround: the form value is reset since the fallback control will handle the form submission.
            this.elementInternals.setFormValue(null);
            this.elementInternals.form.requestSubmit(this.formSubmissionFallbackControl);
        }
    }
}
__decorate([
    attr({ mode: 'boolean' })
], BaseButton.prototype, "autofocus", void 0);
__decorate([
    observable
], BaseButton.prototype, "defaultSlottedContent", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseButton.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'disabled-focusable', mode: 'boolean' })
], BaseButton.prototype, "disabledFocusable", void 0);
__decorate([
    attr({ attribute: 'formaction' })
], BaseButton.prototype, "formAction", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseButton.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'formenctype' })
], BaseButton.prototype, "formEnctype", void 0);
__decorate([
    attr({ attribute: 'formmethod' })
], BaseButton.prototype, "formMethod", void 0);
__decorate([
    attr({ attribute: 'formnovalidate', mode: 'boolean' })
], BaseButton.prototype, "formNoValidate", void 0);
__decorate([
    attr({ attribute: 'formtarget' })
], BaseButton.prototype, "formTarget", void 0);
__decorate([
    attr
], BaseButton.prototype, "name", void 0);
__decorate([
    attr
], BaseButton.prototype, "type", void 0);
__decorate([
    attr
], BaseButton.prototype, "value", void 0);
//# sourceMappingURL=button.base.js.map