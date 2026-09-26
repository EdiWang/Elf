import type { Listbox } from './listbox.js';
/**
 * Predicate function that determines if the element should be considered a listbox.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a listbox.
 * @public
 */
export declare function isListbox(element?: Node | null, tagName?: string): element is Listbox;
/**
 * The tag name for the listbox element.
 *
 * @public
 */
export declare const tagName: "fluent-listbox";
