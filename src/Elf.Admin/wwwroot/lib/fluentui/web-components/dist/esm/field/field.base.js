import { __decorate } from "tslib";
import { FASTElement, observable } from '@microsoft/fast-element';
import { uniqueId } from '../utils/unique-id.js';
import { toggleState } from '../utils/element-internals.js';
import { ValidationFlags } from './field.options.js';
/**
 * A Field Custom HTML Element.
 *
 * @public
 */
export class BaseField extends FASTElement {
    /**
     * Updates attributes on the slotted label elements.
     *
     * @param prev - the previous list of slotted label elements
     * @param next - the current list of slotted label elements
     */
    labelSlotChanged(prev, next) {
        if (next && this.input) {
            this.setLabelProperties();
            this.setStates();
        }
    }
    /**
     * Adds or removes the `invalid` event listener based on the presence of slotted message elements.
     *
     * @param prev - the previous list of slotted message elements
     * @param next - the current list of slotted message elements
     * @internal
     */
    messageSlotChanged(prev, next) {
        toggleState(this.elementInternals, 'has-message', !!next.length);
    }
    /**
     * Sets the `input` property to the first slotted input.
     *
     * @param prev - The previous collection of inputs.
     * @param next - The current collection of inputs.
     * @internal
     */
    slottedInputsChanged(prev, next) {
        const filtered = next?.filter(node => node.nodeType === Node.ELEMENT_NODE) ?? [];
        if (filtered?.length) {
            this.input = filtered?.[0];
        }
    }
    /**
     * Updates the field's states and label properties when the assigned input changes.
     *
     * @param prev - the previous input
     * @param next - the current input
     */
    inputChanged(prev, next) {
        if (next) {
            this.setStates();
            this.setLabelProperties();
            this.slottedInputObserver.observe(this.input, {
                attributes: true,
                attributeFilter: ['disabled', 'required', 'readonly'],
                subtree: true,
            });
        }
    }
    /**
     * Calls the `setStates` method when a `change` event is emitted from the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    changeHandler(e) {
        this.setStates();
        this.setValidationStates();
        return true;
    }
    /**
     * Redirects `click` events to the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e) {
        if (this === e.target) {
            this.input.click();
        }
        return true;
    }
    constructor() {
        super();
        /**
         * The slotted label elements.
         *
         * @internal
         */
        this.labelSlot = [];
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'presentation';
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('invalid', this.invalidHandler, { capture: true });
        this.slottedInputObserver = new MutationObserver(() => {
            this.setStates();
        });
    }
    disconnectedCallback() {
        this.slottedInputObserver.disconnect();
        this.removeEventListener('invalid', this.invalidHandler, { capture: true });
        super.disconnectedCallback();
    }
    /**
     * Applies the `focus-visible` state to the element when the slotted input receives visible focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e) {
        if (this.matches(':focus-within:has(> :focus-visible)')) {
            toggleState(this.elementInternals, 'focus-visible', true);
        }
        return true;
    }
    /**
     * Removes the `focus-visible` state from the field when a slotted input loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e) {
        toggleState(this.elementInternals, 'focus-visible', false);
        return true;
    }
    /**
     * Toggles validity state flags on the element when the slotted input emits an `invalid` event (if slotted validation messages are present).
     *
     * @param e - the event object
     * @internal
     */
    invalidHandler(e) {
        if (this.messageSlot.length) {
            e.preventDefault();
        }
        this.setValidationStates();
    }
    /**
     * Sets ARIA and form-related attributes on slotted label elements.
     *
     * @internal
     */
    setLabelProperties() {
        if (this.$fastController.isConnected) {
            this.input.id = this.input.id || uniqueId('input');
            this.labelSlot?.forEach(label => {
                if (label instanceof HTMLLabelElement) {
                    label.htmlFor = label.htmlFor || this.input.id;
                    label.id = label.id || `${this.input.id}--label`;
                    this.input.setAttribute('aria-labelledby', label.id);
                }
            });
        }
    }
    /**
     * Toggles the field's states based on the slotted input.
     *
     * @internal
     */
    setStates() {
        if (this.elementInternals && this.input) {
            toggleState(this.elementInternals, 'disabled', !!this.input.disabled);
            toggleState(this.elementInternals, 'readonly', !!this.input.readOnly);
            toggleState(this.elementInternals, 'required', !!this.input.required);
            toggleState(this.elementInternals, 'checked', !!this.input.checked);
        }
    }
    setValidationStates() {
        if (!this.input?.validity) {
            return;
        }
        for (const [flag, value] of Object.entries(ValidationFlags)) {
            toggleState(this.elementInternals, value, this.input.validity[flag]);
        }
    }
}
__decorate([
    observable
], BaseField.prototype, "labelSlot", void 0);
__decorate([
    observable
], BaseField.prototype, "messageSlot", void 0);
__decorate([
    observable
], BaseField.prototype, "slottedInputs", void 0);
__decorate([
    observable
], BaseField.prototype, "input", void 0);
//# sourceMappingURL=field.base.js.map