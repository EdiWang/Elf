import { FASTElement } from '@microsoft/fast-element';
import { DialogType } from './dialog.options.js';
/**
 * A Dialog Custom HTML Element.
 *
 * @tag fluent-dialog
 *
 * @fires { ToggleEvent } toggle - Event emitted after the dialog's open state changes.
 * @fires { ToggleEvent } beforetoggle - Event emitted before the dialog's open state changes.
 * @slot - The default slot. {@link (DialogBody:class)} element recommended.
 *
 * @public
 */
export declare class Dialog extends FASTElement {
    /**
     * The dialog element
     *
     * @public
     */
    dialog: HTMLDialogElement;
    /**
     * The ID of the element that describes the dialog
     *
     * @public
     */
    ariaDescribedby?: string;
    /**
     * The ID of the element that labels the dialog
     *
     * @public
     */
    ariaLabelledby?: string;
    /**
     * The label of the dialog
     *
     * @public
     */
    ariaLabel: string | null;
    /**
     * The type of the dialog modal
     *
     * @public
     */
    type: DialogType;
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
    get dialogRole(): string | undefined;
    connectedCallback(): void;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle(): void;
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitToggle: () => void;
    /**
     * Method to show the dialog
     *
     * @public
     */
    show(): void;
    /**
     * Method to hide the dialog
     *
     * @public
     */
    hide(): void;
    /**
     * Handles click events on the dialog overlay for light-dismiss
     *
     * @public
     * @param event - The click event
     * @returns boolean
     */
    clickHandler(event: Event): boolean;
}
