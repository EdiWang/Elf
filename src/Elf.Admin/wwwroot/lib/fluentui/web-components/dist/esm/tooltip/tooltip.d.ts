import { FASTElement } from '@microsoft/fast-element';
import type { TooltipPositioningOption } from './tooltip.options.js';
/**
 * A Tooltip Custom HTML Element.
 * Based on ARIA APG Tooltip Pattern {@link https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ }
 *
 * @tag fluent-tooltip
 *
 * @public
 */
export declare class Tooltip extends FASTElement {
    /**
     * The attached element internals
     */
    elementInternals: ElementInternals;
    /**
     * The item ID
     *
     * @public
     * @remarks
     * HTML Attribute: id
     */
    id: string;
    /**
     * Set the delay for the tooltip
     */
    delay?: number;
    /**
     * The default delay for the tooltip
     * @internal
     */
    private defaultDelay;
    /**
     * Set the positioning of the tooltip
     */
    positioning?: TooltipPositioningOption;
    /**
     * Updates the fallback styles when the positioning changes.
     *
     * @internal
     */
    positioningChanged(): void;
    /**
     * The id of the anchor element for the tooltip
     */
    anchor: string;
    /**
     * Reference to the anchor element
     * @internal
     */
    private get anchorElement();
    /**
     * Reference to the anchor positioning style element
     * @internal
     */
    protected anchorPositioningStyleElement: HTMLStyleElement | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Shows the tooltip
     * @param delay - Number of milliseconds to delay showing the tooltip
     * @internal
     */
    showTooltip(delay?: number): void;
    /**
     * Hide the tooltip
     * @param delay - Number of milliseconds to delay hiding the tooltip
     * @internal
     */
    hideTooltip(delay?: number): void;
    /**
     * Show the tooltip on mouse enter
     */
    mouseenterAnchorHandler: () => void;
    /**
     * Hide the tooltip on mouse leave
     */
    mouseleaveAnchorHandler: () => void;
    /**
     * Show the tooltip on focus
     */
    focusAnchorHandler: () => void;
    /**
     * Hide the tooltip on blur
     */
    blurAnchorHandler: () => void;
    private setFallbackStyles;
}
declare global {
    interface Window {
        CSS_ANCHOR_POLYFILL?: {
            call: (options: {
                element: HTMLStyleElement;
            }) => void;
        };
    }
}
