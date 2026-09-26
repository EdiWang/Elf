import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { AccordionItem, AccordionItemOptions } from './accordion-item.js';
export declare function accordionItemTemplate<T extends AccordionItem>(options?: AccordionItemOptions): ElementViewTemplate<T>;
/**
 * The template for the fluent-accordion component.
 * @public
 */
export declare const template: ElementViewTemplate<AccordionItem>;
