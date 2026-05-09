import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import { StartEnd, type StartEndOptions } from '../patterns/start-end.js';
import { BaseAccordionItem } from './accordion-item.base.js';
import { AccordionItemMarkerPosition, AccordionItemSize } from './accordion-item.options.js';
/**
 * Accordion Item configuration options
 *
 * @tag fluent-accordion-item
 *
 * @public
 */
export type AccordionItemOptions = StartEndOptions<AccordionItem> & {
    expandedIcon?: StaticallyComposableHTML<AccordionItem>;
    collapsedIcon?: StaticallyComposableHTML<AccordionItem>;
};
/**
 * An Accordion Item Custom HTML Element.
 * Based on BaseAccordionItem and includes style and layout specific attributes
 *
 * @public
 */
export declare class AccordionItem extends BaseAccordionItem {
    /**
     * Defines accordion header font size.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: AccordionItemSize;
    /**
     * Sets expand and collapsed icon position.
     *
     * @public
     * @remarks
     * HTML Attribute: marker-position
     */
    markerPosition?: AccordionItemMarkerPosition;
    /**
     * Sets the width of the focus state.
     *
     * @public
     * @remarks
     * HTML Attribute: block
     */
    block: boolean;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface AccordionItem extends StartEnd {
}
