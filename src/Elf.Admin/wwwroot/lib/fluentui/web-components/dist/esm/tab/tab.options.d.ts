import type { Tab } from './tab.js';
/**
 * Predicate function that determines if the element should be considered a tab.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a tab.
 * @public
 */
export declare function isTab(element?: Node | null, tagName?: string): element is Tab;
/**
 * The tag name for the tab element.
 *
 * @public
 */
export declare const tagName: "fluent-tab";
