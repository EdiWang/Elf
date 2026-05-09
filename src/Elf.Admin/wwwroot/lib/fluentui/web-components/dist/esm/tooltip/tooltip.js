import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, Updates } from '@microsoft/fast-element';
import { uniqueId } from '../utils/unique-id.js';
import { AnchorPositioningCSSSupported, AnchorPositioningHTMLSupported } from '../utils/support.js';
/**
 * A Tooltip Custom HTML Element.
 * Based on ARIA APG Tooltip Pattern {@link https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ }
 *
 * @tag fluent-tooltip
 *
 * @public
 */
export class Tooltip extends FASTElement {
    /**
     * Updates the fallback styles when the positioning changes.
     *
     * @internal
     */
    positioningChanged() {
        if (!AnchorPositioningCSSSupported) {
            this.setFallbackStyles();
        }
    }
    /**
     * Reference to the anchor element
     * @internal
     */
    get anchorElement() {
        const rootNode = this.getRootNode();
        return (rootNode instanceof ShadowRoot ? rootNode : document).getElementById(this.anchor ?? '');
    }
    constructor() {
        super();
        /**
         * The attached element internals
         */
        this.elementInternals = this.attachInternals();
        /**
         * The item ID
         *
         * @public
         * @remarks
         * HTML Attribute: id
         */
        this.id = uniqueId('tooltip-');
        /**
         * The default delay for the tooltip
         * @internal
         */
        this.defaultDelay = 250;
        /**
         * The id of the anchor element for the tooltip
         */
        this.anchor = '';
        /**
         * Reference to the anchor positioning style element
         * @internal
         */
        this.anchorPositioningStyleElement = null;
        /**
         * Show the tooltip on mouse enter
         */
        this.mouseenterAnchorHandler = () => this.showTooltip(this.delay);
        /**
         * Hide the tooltip on mouse leave
         */
        this.mouseleaveAnchorHandler = () => this.hideTooltip(this.delay);
        /**
         * Show the tooltip on focus
         */
        this.focusAnchorHandler = () => this.showTooltip(0);
        /**
         * Hide the tooltip on blur
         */
        this.blurAnchorHandler = () => this.hideTooltip(0);
        this.elementInternals.role = 'tooltip';
    }
    connectedCallback() {
        super.connectedCallback();
        // If the anchor element is not found, tooltip will not be shown
        if (!this.anchorElement) {
            return;
        }
        // @ts-expect-error - Baseline 2024
        const anchorName = this.anchorElement.style.anchorName || `--${this.anchor}`;
        const describedBy = this.anchorElement.getAttribute('aria-describedby');
        this.anchorElement.setAttribute('aria-describedby', describedBy ? `${describedBy} ${this.id}` : this.id);
        this.anchorElement.addEventListener('focus', this.focusAnchorHandler);
        this.anchorElement.addEventListener('blur', this.blurAnchorHandler);
        this.anchorElement.addEventListener('mouseenter', this.mouseenterAnchorHandler);
        this.anchorElement.addEventListener('mouseleave', this.mouseleaveAnchorHandler);
        if (AnchorPositioningCSSSupported) {
            if (!AnchorPositioningHTMLSupported) {
                // @ts-expect-error - Baseline 2024
                this.anchorElement.style.anchorName = anchorName;
                // @ts-expect-error - Baseline 2024
                this.style.positionAnchor = anchorName;
            }
            return;
        }
        Updates.enqueue(() => this.setFallbackStyles());
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.anchorElement?.removeEventListener('focus', this.focusAnchorHandler);
        this.anchorElement?.removeEventListener('blur', this.blurAnchorHandler);
        this.anchorElement?.removeEventListener('mouseenter', this.mouseenterAnchorHandler);
        this.anchorElement?.removeEventListener('mouseleave', this.mouseleaveAnchorHandler);
    }
    /**
     * Shows the tooltip
     * @param delay - Number of milliseconds to delay showing the tooltip
     * @internal
     */
    showTooltip(delay = this.defaultDelay) {
        setTimeout(() => {
            this.setAttribute('aria-hidden', 'false');
            this.showPopover();
        }, delay);
    }
    /**
     * Hide the tooltip
     * @param delay - Number of milliseconds to delay hiding the tooltip
     * @internal
     */
    hideTooltip(delay = this.defaultDelay) {
        setTimeout(() => {
            // Detect if the tooltip or anchor element is still hovered and enqueue another hide
            if (this.matches(':hover') || this.anchorElement?.matches(':hover')) {
                this.hideTooltip(delay);
                return;
            }
            this.setAttribute('aria-hidden', 'true');
            this.hidePopover();
        }, delay);
    }
    setFallbackStyles() {
        if (!this.anchorElement) {
            return;
        }
        // @ts-expect-error - Baseline 2024
        const anchorName = this.anchorElement.style.anchorName || `--${this.anchor}`;
        // Provide style fallback for browsers that do not support anchor positioning
        if (!this.anchorPositioningStyleElement) {
            this.anchorPositioningStyleElement = document.createElement('style');
            document.head.append(this.anchorPositioningStyleElement);
        }
        let [direction, alignment] = this.positioning?.split('-') ?? [];
        if (!alignment) {
            if (direction === 'above' || direction === 'below') {
                alignment = 'centerX';
            }
            if (direction === 'before' || direction === 'after') {
                alignment = 'centerY';
            }
        }
        const directionCSSMap = {
            above: `bottom: anchor(top);`,
            below: `top: anchor(bottom);`,
            before: `right: anchor(left);`,
            after: `left: anchor(right);`,
        };
        const directionCSS = directionCSSMap[direction] ?? directionCSSMap.above;
        const alignmentCSSMap = {
            start: `left: anchor(left);`,
            end: `right: anchor(right);`,
            top: `top: anchor(top);`,
            bottom: `bottom: anchor(bottom);`,
            centerX: `left: anchor(center); translate: -50% 0;`,
            centerY: `top: anchor(center); translate: 0 -50%;`,
        };
        const alignmentCSS = alignmentCSSMap[alignment] ?? alignmentCSSMap.centerX;
        this.anchorPositioningStyleElement.textContent = /* css */ `
      #${this.anchor} {
        anchor-name: ${anchorName};
      }
      #${this.id} {
        inset: unset;
        position-anchor: ${anchorName};
        position: absolute;
        ${directionCSS}
        ${alignmentCSS}
      }
    `;
        if (window.CSS_ANCHOR_POLYFILL) {
            window.CSS_ANCHOR_POLYFILL.call({ element: this.anchorPositioningStyleElement });
        }
    }
}
__decorate([
    attr
], Tooltip.prototype, "id", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], Tooltip.prototype, "delay", void 0);
__decorate([
    attr
], Tooltip.prototype, "positioning", void 0);
__decorate([
    attr
], Tooltip.prototype, "anchor", void 0);
//# sourceMappingURL=tooltip.js.map