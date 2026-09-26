import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { MessageBar } from './message-bar.js';
/**
 * Generates a template for the MessageBar component.
 * @public
 * @param T - The type of the MessageBar.
 * @returns The template for the MessageBar component.
 */
export declare function messageBarTemplate<T extends MessageBar>(): ElementViewTemplate<T>;
/**
 * The template for the MessageBar component.
 * @type ElementViewTemplate
 */
export declare const template: ElementViewTemplate<MessageBar>;
