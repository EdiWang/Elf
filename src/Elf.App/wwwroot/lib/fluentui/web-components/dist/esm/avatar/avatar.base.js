import { __decorate } from "tslib";
import { attr, FASTElement, observable, Updates } from '@microsoft/fast-element';
import { getInitials } from '../utils/get-initials.js';
/**
 * The base class used for constructing a fluent-avatar custom element
 * @public
 */
export class BaseAvatar extends FASTElement {
    /**
     * Handles changes to the default slot element reference.
     *
     * Toggles the `has-slotted` class on the slot element for browsers that do not
     * support the `:has-slotted` CSS selector. Defers cleanup using
     * `Updates.enqueue` to avoid DOM mutations during hydration that could
     * corrupt binding markers.
     *
     * @internal
     */
    defaultSlotChanged() {
        if (!CSS.supports('selector(:has-slotted)')) {
            const elements = this.defaultSlot.assignedElements();
            this.defaultSlot.classList.toggle('has-slotted', elements.length > 0);
        }
        Updates.enqueue(() => {
            this.cleanupSlottedContent();
        });
    }
    /**
     * Updates the monogram text content when the ref is captured.
     *
     * @internal
     */
    monogramChanged() {
        this.updateMonogram();
    }
    /**
     * Handles changes to the slotted default content.
     *
     * Normalizes the DOM, toggles the `has-slotted` class on the default slot element
     * for browsers that do not support the `:has-slotted` CSS selector, and removes
     * empty text nodes from the default slot to keep the DOM clean.
     *
     * @internal
     */
    slottedDefaultsChanged() {
        if (!this.defaultSlot) {
            return;
        }
        this.cleanupSlottedContent();
    }
    /**
     * Handles changes to the name attribute.
     * @internal
     */
    nameChanged() {
        this.updateMonogram();
    }
    /**
     * Handles changes to the initials attribute.
     * @internal
     */
    initialsChanged() {
        this.updateMonogram();
    }
    constructor() {
        super();
        /**
         * The slotted content nodes assigned to the default slot.
         *
         * @internal
         */
        this.slottedDefaults = [];
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'img';
    }
    /**
     * Generates and sets the initials for the template.
     * Subclasses should override this to provide custom initials logic.
     *
     * @internal
     */
    generateInitials() {
        return this.initials || getInitials(this.name, window.getComputedStyle(this).direction === 'rtl');
    }
    /**
     * Updates the monogram element's text content with the generated initials.
     *
     * @internal
     */
    updateMonogram() {
        if (this.monogram) {
            this.monogram.textContent = this.generateInitials() ?? '';
        }
    }
    /**
     * Normalizes the DOM and removes empty text nodes from the default slot.
     *
     * @internal
     */
    cleanupSlottedContent() {
        this.normalize();
        if (!CSS.supports('selector(:has-slotted)')) {
            this.defaultSlot.classList.toggle('has-slotted', !!this.slottedDefaults.length);
        }
        if (!this.innerText.trim()) {
            this.slottedDefaults.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.remove();
                }
            });
        }
    }
}
__decorate([
    observable
], BaseAvatar.prototype, "defaultSlot", void 0);
__decorate([
    observable
], BaseAvatar.prototype, "monogram", void 0);
__decorate([
    observable
], BaseAvatar.prototype, "slottedDefaults", void 0);
__decorate([
    attr
], BaseAvatar.prototype, "name", void 0);
__decorate([
    attr
], BaseAvatar.prototype, "initials", void 0);
//# sourceMappingURL=avatar.base.js.map