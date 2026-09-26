import { __decorate } from "tslib";
import { attr, FASTElement, observable, Updates, volatile } from '@microsoft/fast-element';
import { DrawerPosition, DrawerSize, DrawerType } from './drawer.options.js';
/**
 * A Drawer component that allows content to be displayed in a side panel. It can be rendered as modal or non-modal.
 *
 * @tag fluent-drawer
 *
 * @extends FASTElement
 *
 * @attr type - Determines whether the drawer should be displayed as modal, non-modal, or alert.
 * @attr position - Sets the position of the drawer (start/end).
 * @attr size - Sets the size of the drawer (small/medium/large).
 * @attr ariaDescribedby - The ID of the element that describes the drawer.
 * @attr ariaLabelledby - The ID of the element that labels the drawer.
 *
 * @csspart dialog - The dialog element of the drawer.
 * @cssprop --drawer-width - Sets the width of the drawer to a custom value (e.g., 300px).
 *
 * @slot - Default slot for the content of the drawer.
 *
 * @fires { ToggleEvent } toggle - Event emitted after the dialog's open state changes.
 * @fires { ToggleEvent } beforetoggle - Event emitted before the dialog's open state changes.
 *
 * @method show - Method to show the drawer.
 * @method hide - Method to hide the drawer.
 * @method clickHandler - Handles click events on the drawer.
 * @method cancelHandler - Handles cancel events on the drawer.
 * @method emitToggle - Emits an event after the dialog's open state changes.
 * @method emitBeforeToggle - Emits an event before the dialog's open state changes.
 *
 * @summary A component that provides a drawer for displaying content in a side panel.
 */
export class Drawer extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Sets the position of the drawer (start/end).
         *
         * @public
         * @defaultValue start
         */
        this.position = DrawerPosition.start;
        /**
         * @public
         * @defaultValue medium
         * Sets the size of the drawer (small/medium/large).
         */
        this.size = DrawerSize.medium;
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
        if (this.dialog && this.type === DrawerType.modal) {
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
        if (this.dialog && this.type === DrawerType.modal) {
            return 'dialog';
        }
        return this.role;
    }
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => {
            this.type = this.type ?? DrawerType.modal;
        });
    }
    /**
     * Method to show the drawer
     *
     * @public
     */
    show() {
        Updates.enqueue(() => {
            this.emitBeforeToggle();
            if (this.type === DrawerType.inline || this.type === DrawerType.nonModal) {
                this.dialog.show();
            }
            else {
                this.dialog.showModal();
            }
            // Using `autofocus` inside a `<dialog>` is implemented inconsistently
            // across browsers, so artificially focusing here. See details:
            // https://codepen.io/marchbox/pen/PwbRmXE
            this.querySelector('[autofocus]')?.focus?.();
            this.emitToggle();
        });
    }
    /**
     * Method to hide the drawer
     *
     * @public
     */
    hide() {
        this.emitBeforeToggle();
        this.dialog.close();
        this.emitToggle();
    }
    /**
     * @public
     * @param event - The click event
     * @returns boolean - Always returns true
     * Handles click events on the drawer.
     */
    clickHandler(event) {
        if (this.dialog.open && event.target === this.dialog) {
            this.hide();
        }
        return true;
    }
    /**
     * Handles cancel events on the drawer.
     *
     * @public
     */
    cancelHandler() {
        this.hide();
    }
}
__decorate([
    attr
], Drawer.prototype, "type", void 0);
__decorate([
    attr({ attribute: 'aria-labelledby' })
], Drawer.prototype, "ariaLabelledby", void 0);
__decorate([
    attr({ attribute: 'aria-describedby' })
], Drawer.prototype, "ariaDescribedby", void 0);
__decorate([
    attr
], Drawer.prototype, "position", void 0);
__decorate([
    observable
], Drawer.prototype, "role", void 0);
__decorate([
    attr({ attribute: 'size' })
], Drawer.prototype, "size", void 0);
__decorate([
    observable
], Drawer.prototype, "dialog", void 0);
__decorate([
    volatile
], Drawer.prototype, "dialogDescribedby", null);
__decorate([
    volatile
], Drawer.prototype, "dialogLabel", null);
__decorate([
    volatile
], Drawer.prototype, "dialogLabelledby", null);
__decorate([
    volatile
], Drawer.prototype, "dialogModal", null);
__decorate([
    volatile
], Drawer.prototype, "dialogRole", null);
//# sourceMappingURL=drawer.js.map