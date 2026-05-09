import { __decorate } from "tslib";
import { FASTElement, observable, Updates } from '@microsoft/fast-element';
import { isDropdownOption } from '../option/option.options.js';
import { toggleState } from '../utils/element-internals.js';
import { waitForConnectedDescendants } from '../utils/request-idle-callback.js';
import { uniqueId } from '../utils/unique-id.js';
/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox } role.
 *
 * @tag fluent-listbox
 *
 * @slot - The default slot for the options.
 *
 * @remarks
 * The listbox component represents a list of options that can be selected.
 * It is intended to be used in conjunction with the {@link BaseDropdown | Dropdown} component.
 *
 * @public
 */
export class Listbox extends FASTElement {
    /**
     * Calls the `slotchangeHandler` when the `defaultSlot` element is assigned
     * via the `ref` directive in the template.
     *
     * @internal
     */
    defaultSlotChanged() {
        this.slotchangeHandler();
    }
    /**
     * Updates the multiple selection state of the listbox and its options.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     */
    multipleChanged(prev, next) {
        this.elementInternals.ariaMultiSelectable = next ? 'true' : 'false';
        toggleState(this.elementInternals, 'multiple', next);
        Updates.enqueue(() => {
            this.options.forEach(x => {
                x.multiple = !!next;
            });
        });
    }
    /**
     * Updates the enabled options collection when properties on the child options change.
     *
     * @param prev - the previous options
     * @param next - the current options
     *
     * @internal
     */
    optionsChanged(prev, next) {
        next?.forEach((option, index) => {
            option.elementInternals.ariaPosInSet = `${index + 1}`;
            option.elementInternals.ariaSetSize = `${next.length}`;
        });
    }
    /**
     * Handles the `beforetoggle` event on the listbox.
     *
     * @param e - the toggle event
     * @returns true to allow the default popover behavior, undefined to prevent it
     * @internal
     */
    beforetoggleHandler(e) {
        if (!this.dropdown) {
            return true;
        }
        if (this.dropdown.disabled) {
            this.dropdown.open = false;
            return;
        }
        this.dropdown.open = e.newState === 'open';
        return true;
    }
    /**
     * The collection of child options that are not disabled.
     *
     * @internal
     */
    get enabledOptions() {
        return this.options?.filter(x => !x.disabled) ?? [];
    }
    /**
     * The collection of child options that are selected.
     *
     * @public
     */
    get selectedOptions() {
        return this.options?.filter(x => x.selected) ?? [];
    }
    /**
     * Sets the `selected` state on a target option when clicked.
     *
     * @param e - The pointer event
     * @public
     */
    clickHandler(e) {
        if (this.dropdown) {
            return true;
        }
        const target = e.target;
        if (isDropdownOption(target)) {
            this.selectOption(this.enabledOptions.indexOf(target));
        }
        return true;
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'listbox';
    }
    connectedCallback() {
        super.connectedCallback();
        // The listbox needs to have an id for the dropdown to reference via
        // `aria-controls`. If an id is not present on connection, a unique one is
        // generated and assigned to the element.
        waitForConnectedDescendants(this, () => {
            this.id = this.id || uniqueId('listbox-');
        }, { shallow: true });
    }
    /**
     * Handles observable subscriptions for the listbox.
     *
     * @param source - The source of the observed change
     * @param propertyName - The name of the property that changed
     *
     * @internal
     */
    handleChange(source, propertyName) {
        if (propertyName === 'multiple') {
            this.multiple = source.multiple;
            return;
        }
    }
    /**
     * Selects an option by index.
     *
     * @param index - The index of the option to select.
     * @public
     */
    selectOption(index = this.selectedIndex) {
        let selectedIndex = this.selectedIndex;
        if (!this.multiple) {
            this.enabledOptions.forEach((item, i) => {
                const shouldCheck = i === index;
                item.selected = shouldCheck;
                if (shouldCheck) {
                    selectedIndex = i;
                }
            });
        }
        else {
            const option = this.enabledOptions[index];
            if (option) {
                option.selected = !option.selected;
            }
            selectedIndex = index;
        }
        this.selectedIndex = selectedIndex;
    }
    /**
     * Handles the `slotchange` event for the default slot.
     * Sets the `options` property to the list of slotted options.
     *
     * @param e - The slotchange event
     * @public
     */
    slotchangeHandler(e) {
        waitForConnectedDescendants(this, () => {
            if (this.defaultSlot) {
                const options = this.defaultSlot
                    .assignedElements()
                    .filter((option) => isDropdownOption(option));
                this.options = options;
            }
        });
    }
}
__decorate([
    observable
], Listbox.prototype, "defaultSlot", void 0);
__decorate([
    observable
], Listbox.prototype, "multiple", void 0);
__decorate([
    observable
], Listbox.prototype, "options", void 0);
__decorate([
    observable
], Listbox.prototype, "selectedIndex", void 0);
__decorate([
    observable
], Listbox.prototype, "dropdown", void 0);
//# sourceMappingURL=listbox.js.map