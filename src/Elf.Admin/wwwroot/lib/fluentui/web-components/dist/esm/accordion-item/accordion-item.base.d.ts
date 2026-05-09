import { FASTElement } from '@microsoft/fast-element';
/**
 *
 * @slot start - Content positioned before heading in the collapsed state
 * @slot heading - Content which serves as the accordion item heading and text of the expand button
 * @slot - The default slot for accordion item content
 * @slot marker-expanded - The expanded icon
 * @slot marker-collapsed - The collapsed icon
 * @csspart heading - Wraps the button
 * @csspart button - The button which serves to invoke the item
 * @csspart content - The wrapper for the accordion item content
 *
 * @public
 */
export declare class BaseAccordionItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
     * heading element.
     *
     * @public
     * @remarks
     * HTML attribute: heading-level
     */
    headinglevel: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Expands or collapses the item.
     *
     * @public
     * @remarks
     * HTML attribute: expanded
     */
    expanded: boolean;
    /**
     * Disables an accordion item
     *
     * @public
     * @remarks
     * HTML attribute: disabled
     */
    disabled: boolean;
    /**
     * @internal
     */
    expandbutton: HTMLElement;
}
