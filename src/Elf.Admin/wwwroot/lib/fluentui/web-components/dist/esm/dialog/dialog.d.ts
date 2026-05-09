import { FASTElement } from '@microsoft/fast-element';
import { DialogType } from './dialog.options.js';
/**
 * A Dialog Custom HTML Element.
 *
 * @tag fluent-dialog
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
    protected dialogChanged(): void;
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
    protected typeChanged(prev: DialogType | undefined, next: DialogType): void;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle: () => void;
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
    /**
     * Updates the internal dialog element's attributes based on its type.
     *
     * @internal
     */
    protected updateDialogAttributes(): void;
}
