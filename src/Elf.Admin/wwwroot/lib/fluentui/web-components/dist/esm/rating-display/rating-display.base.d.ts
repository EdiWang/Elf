import { FASTElement } from '@microsoft/fast-element';
type PropertyNameForCalculation = 'max' | 'value';
export declare function svgToDataURI(svg: string): string;
/**
 * The base class used for constructing a fluent-rating-display custom element
 *
 * @slot icon - SVG element used as the rating icon
 *
 * @public
 */
export declare class BaseRatingDisplay extends FASTElement {
    private numberFormatter;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Reference to the slot element used for the rating icon.
     *
     * @internal
     */
    iconSlot: HTMLSlotElement;
    /**
     * Updates the icon when the referenced slot is bound in the template.
     *
     * @internal
     */
    iconSlotChanged(): void;
    protected defaultCustomIconViewBox: string;
    /**
     * The element that displays the rating icons.
     * @internal
     */
    display: HTMLElement;
    /**
     * The number of ratings.
     *
     * @public
     * @remarks
     * HTML Attribute: `count`
     */
    count?: number;
    /**
     * The `viewBox` attribute of the icon <svg> element.
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-view-box`
     * @deprecated Add `viewBox` attribute on the custom SVG directly.
     */
    iconViewBox?: string;
    /**
     * The maximum possible value of the rating.
     * This attribute determines the number of icons displayed.
     * Must be a whole number greater than 1.
     *
     * @public
     * @remarks
     * HTML Attribute: `max`
     */
    max?: number;
    protected maxChanged(): void;
    /**
     * The value of the rating.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    value?: number;
    protected valueChanged(): void;
    constructor();
    connectedCallback(): void;
    /**
     * Returns "count" as string, formatted according to the locale.
     *
     * @internal
     */
    get formattedCount(): string;
    /** @internal */
    handleSlotChange(): void;
    protected renderSlottedIcon(svg: SVGSVGElement | null): void;
    protected setCustomPropertyValue(propertyName: PropertyNameForCalculation): void;
}
export {};
