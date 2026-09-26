import { FluentDesignSystem } from '../fluent-design-system.js';
import { isCustomElement } from '../utils/typings.js';
/**
 * An Accordion Item header font size can be small, medium, large, and extra-large
 */
export const AccordionItemSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
    extraLarge: 'extra-large',
};
/**
 * An Accordion Item expand/collapse icon can appear at the start or end of the accordion
 */
export const AccordionItemMarkerPosition = {
    start: 'start',
    end: 'end',
};
/**
 * Predicate function that determines if the element should be considered an accordion item element.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check against, defaults to '-accordion-item'.
 * @returns True if the element is an accordion item element, false otherwise.
 * @public
 */
export function isAccordionItem(element, tagName = '-accordion-item') {
    return isCustomElement(tagName)(element);
}
/**
 * The tag name for the accordion item element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-accordion-item`;
//# sourceMappingURL=accordion-item.options.js.map