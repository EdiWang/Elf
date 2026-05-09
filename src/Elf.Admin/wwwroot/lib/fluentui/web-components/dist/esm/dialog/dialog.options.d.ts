import type { ValuesOf } from '../utils/typings.js';
import { Dialog } from './dialog.js';
/**
 * Dialog modal type
 * @public
 */
export declare const DialogType: {
    readonly modal: "modal";
    readonly nonModal: "non-modal";
    readonly alert: "alert";
};
export type DialogType = ValuesOf<typeof DialogType>;
/**
 * Predicate function that determines if the element should be considered a dialog.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dialog.
 * @public
 */
export declare function isDialog(element?: Node | null, tagName?: string): element is Dialog;
/**
 * The tag name for the dialog element.
 *
 * @public
 */
export declare const tagName: "fluent-dialog";
