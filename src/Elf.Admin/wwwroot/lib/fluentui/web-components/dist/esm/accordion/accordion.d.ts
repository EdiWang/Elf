import { FASTElement } from '@microsoft/fast-element';
import { AccordionExpandMode } from './accordion.options.js';
/**
 * An Accordion Custom HTML Element
 * Implements {@link https://www.w3.org/TR/wai-aria-practices-1.1/#accordion | ARIA Accordion}.
 *
 * @tag fluent-accordion
 *
 * @slot - The default slot for the accordion items
 * @fires change - Fires a custom 'change' event when the active item changes
 *
 * @public
 */
export declare class Accordion extends FASTElement {
    /**
     * Controls the expand mode of the Accordion, either allowing
     * single or multiple item expansion.
     * @public
     *
     * @remarks
     * HTML attribute: expand-mode
     */
    expandmode: AccordionExpandMode;
    expandmodeChanged(prev: AccordionExpandMode | undefined, next: AccordionExpandMode): void;
    /**
     * @internal
     */
    slottedAccordionItems: HTMLElement[];
    /**
     * @internal
     */
    protected accordionItems: Element[];
    /**
     * @internal
     */
    slottedAccordionItemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void;
    /**
     * Guard flag to prevent re-entrant calls to setSingleExpandMode.
     * @internal
     */
    private _isAdjusting;
    /**
     * Watch for changes to the slotted accordion items `disabled` and `expanded` attributes
     * @internal
     */
    handleChange(source: any, propertyName: string): void;
    private activeItemIndex;
    /**
     * Find the first expanded item in the accordion
     */
    private findExpandedItem;
    /**
     * Resets event listeners and sets the `accordionItems` property
     * then rebinds event listeners to each non-disabled item
     */
    private setItems;
    /**
     * Checks if the accordion is in single expand mode
     * @returns true if the accordion is in single expand mode.
     */
    private isSingleExpandMode;
    /**
     * Controls the behavior of the accordion in single expand mode
     * @param expandedItem - The item to expand in single expand mode
     */
    private setSingleExpandMode;
    /**
     * Removes event listeners from the previous accordion items
     * @param oldValue - An array of the previous accordion items
     */
    private removeItemListeners;
    /**
     * Changes the expanded state of the accordion item
     * @param evt - Click event
     * @returns
     */
    private expandedChangedHandler;
    connectedCallback(): void;
}
