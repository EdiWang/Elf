import { FASTElement } from '@microsoft/fast-element';
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
export declare class Drawer extends FASTElement {
    /**
     * Determines whether the drawer should be displayed as modal or non-modal
     * When rendered as a modal, an overlay is applied over the rest of the view.
     *
     * @public
     */
    type: DrawerType;
    /**
     * The ID of the element that labels the drawer.
     *
     * @public
     */
    ariaLabelledby?: string;
    /**
     * The ID of the element that describes the drawer.
     *
     * @public
     */
    ariaDescribedby?: string;
    /**
     * Sets the position of the drawer (start/end).
     *
     * @public
     * @defaultValue start
     */
    position: DrawerPosition;
    role: string | null;
    /**
     * @public
     * @defaultValue medium
     * Sets the size of the drawer (small/medium/large).
     */
    size: DrawerSize;
    /**
     * The dialog element.
     *
     * @public
     */
    dialog: HTMLDialogElement;
    /**
     * The `aria-describedby` attribute value for the dialog, which is determined by the `ariaDescribedby` property. This
     * is used to ensure that the dialog's accessible description is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogDescribedby(): string | undefined;
    /**
     * The `aria-label` attribute value for the dialog, which is determined by the `ariaLabel` property. This is used to
     * ensure that the dialog's accessible name is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogLabel(): string | null | undefined;
    /**
     * The `aria-labelledby` attribute value for the dialog, which is determined by the `ariaLabelledby` property. This is
     * used to ensure that the dialog's accessible name is properly announced by assistive technologies.
     *
     * @internal
     */
    get dialogLabelledby(): string | undefined;
    /**
     * The modal state of the dialog, which is determined by the `type` property. If the dialog is not a non-modal dialog,
     * the modal state will be true, otherwise it will be undefined.
     *
     * @internal
     */
    get dialogModal(): boolean | undefined;
    /**
     * The role of the dialog, which is determined by the `type` property. If the dialog is an alert dialog, the role will
     * be 'alertdialog', otherwise it will be undefined.
     *
     * @internal
     */
    get dialogRole(): string | null;
    connectedCallback(): void;
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitToggle: () => void;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle: () => void;
    /**
     * Method to show the drawer
     *
     * @public
     */
    show(): void;
    /**
     * Method to hide the drawer
     *
     * @public
     */
    hide(): void;
    /**
     * @public
     * @param event - The click event
     * @returns boolean - Always returns true
     * Handles click events on the drawer.
     */
    clickHandler(event: Event): boolean;
    /**
     * Handles cancel events on the drawer.
     *
     * @public
     */
    cancelHandler(): void;
}
