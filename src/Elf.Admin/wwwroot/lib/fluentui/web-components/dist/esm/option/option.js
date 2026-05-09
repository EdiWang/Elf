import { __decorate } from "tslib";
import { attr, FASTElement, Observable, observable, Updates } from '@microsoft/fast-element';
import { toggleState } from '../utils/element-internals.js';
import { uniqueId } from '../utils/unique-id.js';
/**
 * A DropdownOption Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#option | ARIA option } role.
 *
 * @tag fluent-dropdown-option
 *
 * @slot - The default slot for the option's content.
 * @slot checked-indicator - The checked indicator.
 * @slot description - Optional description content.
 *
 * @remarks
 * To support single and multiple selection modes with the {@link (BaseDropdown:class)} element, the Option element
 * itself handles form association and value submission, rather than its parent Dropdown element. In this way, the
 * Option element is a variation of the Checkbox element that is specifically designed for use in the Dropdown element.
 *
 * This class is named `DropdownOption` to avoid conflicts with the native `Option` global. Related constructs are also
 * titled with `DropdownOption` to maintain consistency.
 *
 * @public
 */
export class DropdownOption extends FASTElement {
    /**
     * Changes the active state of the option when the active property changes.
     *
     * @param prev - the previous active state
     * @param next - the current active state
     * @internal
     */
    activeChanged(prev, next) {
        toggleState(this.elementInternals, 'active', next);
    }
    /**
     * Sets the selected property to match the currentSelected state.
     *
     * @param prev - the previous selected state
     * @param next - the current selected state
     * @internal
     */
    currentSelectedChanged(prev, next) {
        this.selected = !!next;
    }
    /**
     * Updates the selected state when the `selected` attribute is changed, unless the selected state has been changed by the user.
     *
     * @param prev - The previous initial selected state
     * @param next - The current initial selected state
     * @internal
     */
    defaultSelectedChanged(prev, next) {
        this.selected = !!next;
    }
    /**
     * Changes the description state of the option when the description slot changes.
     *
     * @param prev - the previous collection of description elements
     * @param next - the current collection of description elements
     * @internal
     */
    descriptionSlotChanged(prev, next) {
        toggleState(this.elementInternals, 'description', !!next?.length);
    }
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    disabledChanged(prev, next) {
        this.elementInternals.ariaDisabled = this.disabled ? 'true' : 'false';
        toggleState(this.elementInternals, 'disabled', this.disabled);
        this.setFormValue(!this.disabled && this.selected ? this.value : null);
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
     * Sets the value of the option when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    initialValueChanged(prev, next) {
        this._value = next;
    }
    /**
     * Updates the multiple state of the option when the multiple property changes.
     *
     * @param prev - the previous multiple state
     * @param next - the current multiple state
     */
    multipleChanged(prev, next) {
        toggleState(this.elementInternals, 'multiple', next);
        this.selected = false;
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
     * The option's current selected state.
     *
     * @public
     */
    get selected() {
        Observable.track(this, 'selected');
        return !!this.currentSelected;
    }
    set selected(next) {
        this.currentSelected = next;
        Updates.enqueue(() => {
            if (this.elementInternals) {
                this.setFormValue(next ? this.value : null);
                this.elementInternals.ariaSelected = next ? 'true' : 'false';
                toggleState(this.elementInternals, 'selected', next);
            }
        });
        Observable.notify(this, 'selected');
    }
    /**
     * The display text of the option.
     *
     * @public
     * @remarks
     * When the option is freeform, the text is the value of the option.
     */
    get text() {
        if (this.freeform) {
            return this.value.replace(/\s+/g, ' ').trim();
        }
        return (this.textAttribute ?? this.textContent)?.replace(/\s+/g, ' ').trim() ?? '';
    }
    /**
     * The current value of the option.
     *
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this._value ?? this.text;
    }
    set value(value) {
        this._value = value;
        if (this.$fastController.isConnected) {
            this.setFormValue(this.selected ? value : null);
            this.freeformOutputs?.forEach(output => {
                output.value = value;
            });
            Observable.notify(this, 'value');
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.freeform) {
            this.value = '';
            this.hidden = true;
            this.selected = false;
        }
    }
    constructor() {
        super();
        /**
         * Indicates that the option is active.
         *
         * @public
         */
        this.active = false;
        /**
         * The id of the option. If not provided, a unique id will be assigned.
         *
         * @override
         * @public
         * @remarks
         * HTML Attribute: `id`
         */
        this.id = uniqueId('option-');
        /**
         * The initial value of the option.
         *
         * @public
         * @remarks
         * HTML Attribute: `value`
         */
        this.initialValue = '';
        /**
         * Indicates that the option is in a multiple selection mode context.
         * @public
         */
        this.multiple = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The internal value of the option.
         *
         * @internal
         */
        this._value = this.initialValue;
        this.elementInternals.role = 'option';
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        if (this.disabled) {
            this.elementInternals.setFormValue(null);
            return;
        }
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Toggles the selected state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleSelected(force = !this.selected) {
        this.selected = force;
    }
}
__decorate([
    observable
], DropdownOption.prototype, "active", void 0);
__decorate([
    attr({ attribute: 'current-selected', mode: 'boolean' })
], DropdownOption.prototype, "currentSelected", void 0);
__decorate([
    attr({ attribute: 'selected', mode: 'boolean' })
], DropdownOption.prototype, "defaultSelected", void 0);
__decorate([
    observable
], DropdownOption.prototype, "descriptionSlot", void 0);
__decorate([
    observable
], DropdownOption.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'disabled', mode: 'boolean' })
], DropdownOption.prototype, "disabledAttribute", void 0);
__decorate([
    attr({ attribute: 'form' })
], DropdownOption.prototype, "formAttribute", void 0);
__decorate([
    attr({ mode: 'boolean' })
], DropdownOption.prototype, "freeform", void 0);
__decorate([
    attr({ attribute: 'id' })
], DropdownOption.prototype, "id", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], DropdownOption.prototype, "initialValue", void 0);
__decorate([
    observable
], DropdownOption.prototype, "multiple", void 0);
__decorate([
    attr
], DropdownOption.prototype, "name", void 0);
__decorate([
    observable
], DropdownOption.prototype, "start", void 0);
__decorate([
    attr({ attribute: 'text', mode: 'fromView' })
], DropdownOption.prototype, "textAttribute", void 0);
//# sourceMappingURL=option.js.map