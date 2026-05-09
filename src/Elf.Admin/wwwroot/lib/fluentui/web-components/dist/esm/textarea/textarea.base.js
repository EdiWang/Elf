import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, observable } from '@microsoft/fast-element';
import { whitespaceFilter } from '../utils/whitespace-filter.js';
import { hasMatchingState, swapStates, toggleState } from '../utils/element-internals.js';
import { TextAreaResize } from './textarea.options.js';
/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | `<textarea>`} element.
 *
 * @slot - The default content/value of the component.
 * @slot label - The content for the `<label>`, it should be a `<fluent-label>` element.
 * @csspart label - The `<label>` element.
 * @csspart root - The container element of the `<textarea>` element.
 * @csspart control - The internal `<textarea>` element.
 * @fires change - Fires after the control loses focus, if the content has changed.
 * @fires select - Fires when the `select()` method is called.
 *
 * @public
 */
export class BaseTextArea extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * Sets up a mutation observer to watch for changes to the control element's
     * attributes that could affect validity, and binds an input event listener to detect user interaction.
     *
     * @internal
     */
    controlElChanged() {
        this.controlElAttrObserver = new MutationObserver(() => {
            this.setValidity();
        });
        this.controlElAttrObserver.observe(this.controlEl, {
            attributes: true,
            attributeFilter: ['disabled', 'required', 'readonly', 'maxlength', 'minlength'],
        });
        this.controlEl.addEventListener('input', () => (this.userInteracted = true), { once: true });
    }
    defaultSlottedNodesChanged() {
        const next = this.getContent();
        this.defaultValue = next;
        this.value = next;
    }
    labelSlottedNodesChanged() {
        this.filteredLabelSlottedNodes = this.labelSlottedNodes.filter(whitespaceFilter);
        if (this.labelEl) {
            this.labelEl.hidden = !this.filteredLabelSlottedNodes.length;
        }
        this.filteredLabelSlottedNodes.forEach(node => {
            node.disabled = this.disabled;
            node.required = this.required;
        });
    }
    autoResizeChanged() {
        this.maybeCreateAutoSizerEl();
        toggleState(this.elementInternals, 'auto-resize', this.autoResize);
    }
    disabledChanged() {
        this.setDisabledSideEffect(this.disabled);
    }
    /**
     * The form element that’s associated to the element, or `null` if no form is associated.
     *
     * @public
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * A `NodeList` of `<label>` element associated with the element.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels | `labels`} property
     *
     * @public
     */
    get labels() {
        return this.elementInternals.labels;
    }
    readOnlyChanged() {
        this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
        if (this.$fastController.isConnected) {
            this.setValidity();
        }
    }
    requiredChanged() {
        this.elementInternals.ariaRequired = `${!!this.required}`;
        if (this.filteredLabelSlottedNodes?.length) {
            this.filteredLabelSlottedNodes.forEach(node => (node.required = this.required));
        }
    }
    resizeChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, TextAreaResize, 'resize-');
        toggleState(this.elementInternals, 'resize', hasMatchingState(TextAreaResize, next) && next !== TextAreaResize.none);
    }
    /**
     * The length of the current value.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#textLength | 'textLength'} property
     *
     * @public
     */
    get textLength() {
        return this.controlEl.textLength;
    }
    /**
     * The type of the element, which is always "textarea".
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/type | `type`} property
     *
     * @public
     */
    get type() {
        return 'textarea';
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
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage || this.controlEl.validationMessage;
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
     * The text content of the element before user interaction.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#defaultvalue | `defaultValue`} property
     *
     * @public
     * @remarks
     * In order to set the initial/default value, an author should either add the default value in the HTML as the children
     * of the component, or setting this property in JavaScript. Setting `innerHTML`, `innerText`, or `textContent` on this
     * component will not change the default value or the content displayed inside the component.
     */
    get defaultValue() {
        return this.controlEl?.defaultValue ?? this.preConnectControlEl.defaultValue;
    }
    set defaultValue(next) {
        const controlEl = this.controlEl ?? this.preConnectControlEl;
        controlEl.defaultValue = next;
        if (this.controlEl && !this.userInteracted) {
            this.controlEl.value = next;
        }
    }
    /**
     * The value of the element.
     *
     * @public
     * @remarks
     * Reflects the `value` property.
     */
    get value() {
        return this.controlEl?.value ?? this.preConnectControlEl.value;
    }
    set value(next) {
        const controlEl = this.controlEl ?? this.preConnectControlEl;
        controlEl.value = next;
        this.setFormValue(next);
        this.setValidity();
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.filteredLabelSlottedNodes = [];
        /**
         * The list of nodes that are assigned to the `label` slot.
         * @internal
         */
        this.labelSlottedNodes = [];
        this.userInteracted = false;
        this.preConnectControlEl = document.createElement('textarea');
        /**
         * Indicates whether the element’s block size (height) should be automatically changed based on the content.
         * Note: When this property’s value is set to be `true`, the element should not have a fixed block-size
         * defined in CSS. Instead, use `min-height` or `min-block-size`.
         *
         * @public
         * @remarks
         * HTML Attribute: `auto-resize`
         */
        this.autoResize = false;
        /**
         * Sets the element's disabled state.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * Indicates whether the element displays a box shadow. This only has effect when `appearance` is set to be `filled-darker` or `filled-lighter`.
         *
         * @public
         * @remarks
         * HTML Attribute: `display-shadow`
         */
        this.displayShadow = false;
        /**
         * When true, the control will be immutable by user interaction.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `readonly`
         */
        this.readOnly = false;
        /**
         * The element's required attribute.
         *
         * @public
         * @remarks
         * HTML Attribute: `required`
         */
        this.required = false;
        /**
         * Indicates whether the element can be resized by end users.
         *
         * @public
         * @remarks
         * HTML Attribute: `resize`
         */
        this.resize = TextAreaResize.none;
        /**
         * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck | `spellcheck`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `spellcheck`
         */
        this.spellcheck = false;
        // TODO: Re-enabled this when Reference Target is out.
        // this.elementInternals.role = 'textbox';
        // this.elementInternals.ariaMultiLine = 'true';
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        requestAnimationFrame(() => {
            if (!this.$fastController.isConnected) {
                // The component may have been disconnected between the connectedCallback and this frame.
                // This can happen during rapid DOM updates, framework-level element recycling, or SSR/DSD hydration teardown.
                // Bail out to avoid performing setup work on a detached element.
                return;
            }
            const preConnect = this.preConnectControlEl;
            const content = this.getContent();
            this.defaultValue = content || preConnect?.defaultValue || '';
            this.value = preConnect?.value || this.defaultValue;
            this.setFormValue(this.value);
            this.setValidity();
            this.preConnectControlEl = null;
            this.maybeCreateAutoSizerEl();
        });
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.autoSizerObserver?.disconnect();
        this.controlElAttrObserver?.disconnect();
    }
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.defaultValue;
    }
    /**
     * @internal
     */
    formDisabledCallback(disabled) {
        this.setDisabledSideEffect(disabled);
        this.setValidity();
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
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: !!message }, !!message ? message.toString() : undefined);
        this.reportValidity();
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
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.disabled || this.readOnly) {
            this.elementInternals.setValidity({});
        }
        else {
            this.elementInternals.setValidity(flags ?? this.controlEl.validity, message ?? this.controlEl.validationMessage, anchor ?? this.controlEl);
        }
        if (this.userInteracted) {
            this.toggleUserValidityState();
        }
    }
    /**
     * Selects the content in the element.
     *
     * @public
     */
    select() {
        this.controlEl.select();
    }
    /**
     * Gets the content inside the light DOM, if any HTML element is present, use its `outerHTML` value.
     */
    getContent() {
        return (this.defaultSlottedNodes
            .map(node => {
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    return node.outerHTML;
                case Node.TEXT_NODE:
                    return node.textContent.trim();
                default:
                    return '';
            }
        })
            .join('') || '');
    }
    setDisabledSideEffect(disabled) {
        this.elementInternals.ariaDisabled = `${disabled}`;
        if (this.controlEl) {
            this.controlEl.disabled = disabled;
        }
        if (this.filteredLabelSlottedNodes?.length) {
            this.filteredLabelSlottedNodes.forEach(node => (node.disabled = this.disabled));
        }
    }
    toggleUserValidityState() {
        toggleState(this.elementInternals, 'user-invalid', !this.validity.valid);
        toggleState(this.elementInternals, 'user-valid', this.validity.valid);
    }
    // Technique inspired by https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
    // TODO: This should be removed after `field-sizing: content` is widely supported
    // https://caniuse.com/mdn-css_properties_field-sizing_content
    maybeCreateAutoSizerEl() {
        if (CSS.supports('field-sizing: content')) {
            return;
        }
        if (!this.autoResize) {
            this.autoSizerEl?.remove();
            this.autoSizerObserver?.disconnect();
            return;
        }
        if (!this.autoSizerEl) {
            this.autoSizerEl = document.createElement('div');
            this.autoSizerEl.classList.add('auto-sizer');
            this.autoSizerEl.ariaHidden = 'true';
        }
        // `rootEl` uses optional chaining because `autoResizeChanged` may be called before
        // the element connects and the template renders. `connectedCallback` will call this
        // method again once `rootEl` is available.
        this.rootEl?.prepend(this.autoSizerEl);
        // The `ResizeObserver` is used to observe when the component gains
        // explicit block size, when so, the `autoSizerEl` element should be
        // removed to let the defined blocked size dictate the component’s block size.
        if (!this.autoSizerObserver) {
            this.autoSizerObserver = new ResizeObserver((_, observer) => {
                const blockSizePropName = window.getComputedStyle(this).writingMode.startsWith('horizontal')
                    ? 'height'
                    : 'width';
                if (this.style.getPropertyValue(blockSizePropName) !== '') {
                    this.autoSizerEl?.remove();
                    observer.disconnect();
                }
            });
        }
        this.autoSizerObserver.observe(this);
    }
    /**
     * @internal
     */
    handleControlInput() {
        if (this.autoResize && this.autoSizerEl) {
            this.autoSizerEl.textContent = this.value + ' ';
        }
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * @internal
     */
    handleControlChange() {
        this.toggleUserValidityState();
        this.$emit('change');
    }
    /**
     * @internal
     */
    handleControlSelect() {
        this.$emit('select');
    }
}
__decorate([
    observable
], BaseTextArea.prototype, "controlEl", void 0);
__decorate([
    observable
], BaseTextArea.prototype, "defaultSlottedNodes", void 0);
__decorate([
    observable
], BaseTextArea.prototype, "labelSlottedNodes", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "autocomplete", void 0);
__decorate([
    attr({ attribute: 'auto-resize', mode: 'boolean' })
], BaseTextArea.prototype, "autoResize", void 0);
__decorate([
    attr({ attribute: 'dirname' })
], BaseTextArea.prototype, "dirName", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'display-shadow', mode: 'boolean' })
], BaseTextArea.prototype, "displayShadow", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseTextArea.prototype, "initialForm", void 0);
__decorate([
    attr({ attribute: 'maxlength', converter: nullableNumberConverter })
], BaseTextArea.prototype, "maxLength", void 0);
__decorate([
    attr({ attribute: 'minlength', converter: nullableNumberConverter })
], BaseTextArea.prototype, "minLength", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "name", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "placeholder", void 0);
__decorate([
    attr({ attribute: 'readonly', mode: 'boolean' })
], BaseTextArea.prototype, "readOnly", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "required", void 0);
__decorate([
    attr({ mode: 'fromView' })
], BaseTextArea.prototype, "resize", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "spellcheck", void 0);
//# sourceMappingURL=textarea.base.js.map