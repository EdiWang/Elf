import { __decorate } from "tslib";
import { attr, FASTElement, observable, Updates, volatile } from '@microsoft/fast-element';
import { DialogType } from './dialog.options.js';
/**
 * A Dialog Custom HTML Element.
 *
 * @tag fluent-dialog
 *
 * @public
 */
export class Dialog extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Method to emit an event after the dialog's open state changes
         * HTML spec proposal: https://github.com/whatwg/html/issues/9733
         *
         * @public
         */
        this.emitToggle = () => {
            this.$emit('toggle', {
                oldState: this.dialog.open ? 'closed' : 'open',
                newState: this.dialog.open ? 'open' : 'closed',
            });
        };
    }
    /**
     * The `aria-describedby` attribute value for the dialog, which is determined by the `ariaDescribedby` property. This
     * is used to ensure that the dialog's accessible description is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogDescribedby() {
        if (this.dialog) {
            return this.ariaDescribedby;
        }
    }
    /**
     * The `aria-label` attribute value for the dialog, which is determined by the `ariaLabel` property. This is used to
     * ensure that the dialog's accessible name is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogLabel() {
        if (this.dialog) {
            return this.ariaLabel;
        }
    }
    /**
     * The `aria-labelledby` attribute value for the dialog, which is determined by the `ariaLabelledby` property. This is
     * used to ensure that the dialog's accessible name is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogLabelledby() {
        if (this.dialog) {
            return this.ariaLabelledby;
        }
    }
    /**
     * The modal state of the dialog, which is determined by the `type` property. If the dialog is not a non-modal dialog,
     * the modal state will be true, otherwise it will be undefined.
     *
     * @internal
     */
    get dialogModal() {
        if (this.dialog && this.type !== DialogType.nonModal) {
            return true;
        }
    }
    /**
     * The role of the dialog, which is determined by the `type` property. If the dialog is an alert dialog, the role will
     * be 'alertdialog', otherwise it will be undefined.
     *
     * @internal
     */
    get dialogRole() {
        if (this.dialog && this.type === DialogType.alert) {
            return 'alertdialog';
        }
    }
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => {
            this.type = this.type ?? DialogType.modal;
        });
    }
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle() {
        this.$emit('beforetoggle', {
            oldState: this.dialog.open ? 'open' : 'closed',
            newState: this.dialog.open ? 'closed' : 'open',
        });
    }
    /**
     * Method to show the dialog
     *
     * @public
     */
    show() {
        Updates.enqueue(() => {
            this.emitBeforeToggle();
            if (this.type === DialogType.alert || this.type === DialogType.modal) {
                this.dialog.showModal();
            }
            else if (this.type === DialogType.nonModal) {
                this.dialog.show();
            }
            this.emitToggle();
        });
    }
    /**
     * Method to hide the dialog
     *
     * @public
     */
    hide() {
        this.emitBeforeToggle();
        this.dialog.close();
        this.emitToggle();
    }
    /**
     * Handles click events on the dialog overlay for light-dismiss
     *
     * @public
     * @param event - The click event
     * @returns boolean
     */
    clickHandler(event) {
        if (this.dialog.open && this.type !== DialogType.alert && event.target === this.dialog) {
            this.hide();
        }
        return true;
    }
}
__decorate([
    observable
], Dialog.prototype, "dialog", void 0);
__decorate([
    attr({ attribute: 'aria-describedby' })
], Dialog.prototype, "ariaDescribedby", void 0);
__decorate([
    attr({ attribute: 'aria-labelledby' })
], Dialog.prototype, "ariaLabelledby", void 0);
__decorate([
    attr({ attribute: 'aria-label' })
], Dialog.prototype, "ariaLabel", void 0);
__decorate([
    attr
], Dialog.prototype, "type", void 0);
__decorate([
    volatile
], Dialog.prototype, "dialogDescribedby", null);
__decorate([
    volatile
], Dialog.prototype, "dialogLabel", null);
__decorate([
    volatile
], Dialog.prototype, "dialogLabelledby", null);
__decorate([
    volatile
], Dialog.prototype, "dialogModal", null);
__decorate([
    volatile
], Dialog.prototype, "dialogRole", null);
//# sourceMappingURL=dialog.js.map