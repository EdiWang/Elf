import { __decorate } from "tslib";
import { attr, FASTElement, observable, Updates } from '@microsoft/fast-element';
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
         * The type of the dialog modal
         *
         * @public
         */
        this.type = DialogType.modal;
        /**
         * Method to emit an event before the dialog's open state changes
         * HTML spec proposal: https://github.com/whatwg/html/issues/9733
         *
         * @public
         */
        this.emitBeforeToggle = () => {
            this.$emit('beforetoggle', {
                oldState: this.dialog.open ? 'open' : 'closed',
                newState: this.dialog.open ? 'closed' : 'open',
            });
        };
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
    dialogChanged() {
        this.updateDialogAttributes();
    }
    typeChanged(prev, next) {
        this.updateDialogAttributes();
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
    /**
     * Updates the internal dialog element's attributes based on its type.
     *
     * @internal
     */
    updateDialogAttributes() {
        if (!this.dialog) {
            return;
        }
        if (this.type === DialogType.alert) {
            this.dialog.setAttribute('role', 'alertdialog');
        }
        else {
            this.dialog.removeAttribute('role');
        }
        if (this.type !== DialogType.nonModal) {
            this.dialog.setAttribute('aria-modal', 'true');
        }
        else {
            this.dialog.removeAttribute('aria-modal');
        }
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
//# sourceMappingURL=dialog.js.map