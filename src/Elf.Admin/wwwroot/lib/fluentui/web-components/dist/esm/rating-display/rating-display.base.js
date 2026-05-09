import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, observable } from '@microsoft/fast-element';
const SUPPORTS_ATTR_TYPE = CSS.supports('width: attr(value type(<number>))');
const CUSTOM_PROPERTY_NAME = {
    max: '--_attr-max',
    value: '--_attr-value',
    maskImageFilled: '--_mask-image-filled',
    maskImageOutlined: '--_mask-image-outlined',
};
export function svgToDataURI(svg) {
    if (!svg) {
        return '';
    }
    return ['data:image/svg+xml', encodeURIComponent(svg.replace(/\n/g, '').replace(/\s+/g, ' '))].join(',');
}
/**
 * The base class used for constructing a fluent-rating-display custom element
 *
 * @slot icon - SVG element used as the rating icon
 *
 * @public
 */
export class BaseRatingDisplay extends FASTElement {
    /**
     * Updates the icon when the referenced slot is bound in the template.
     *
     * @internal
     */
    iconSlotChanged() {
        this.handleSlotChange();
    }
    maxChanged() {
        this.setCustomPropertyValue('max');
    }
    valueChanged() {
        this.setCustomPropertyValue('value');
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.defaultCustomIconViewBox = '0 0 20 20';
        this.elementInternals.role = 'img';
        this.numberFormatter = new Intl.NumberFormat();
    }
    connectedCallback() {
        super.connectedCallback();
        this.setCustomPropertyValue('value');
        this.setCustomPropertyValue('max');
    }
    /**
     * Returns "count" as string, formatted according to the locale.
     *
     * @internal
     */
    get formattedCount() {
        return this.count ? this.numberFormatter.format(this.count) : '';
    }
    /** @internal */
    handleSlotChange() {
        const icon = this.iconSlot.assignedElements()?.find(el => el.nodeName.toLowerCase() === 'svg');
        this.renderSlottedIcon(icon ?? null);
    }
    renderSlottedIcon(svg) {
        if (!svg) {
            this.display.style.removeProperty(CUSTOM_PROPERTY_NAME.maskImageFilled);
            this.display.style.removeProperty(CUSTOM_PROPERTY_NAME.maskImageOutlined);
            return;
        }
        const innerSvg = svg.innerHTML;
        const viewBox = svg.getAttribute('viewBox') ?? this.iconViewBox ?? this.defaultCustomIconViewBox;
        const customSvgFilled = `
            <svg
                viewBox="${viewBox}"
                xmlns="http://www.w3.org/2000/svg"
            >${innerSvg}</svg>`;
        const customSvgOutlined = `
            <svg
                viewBox="${viewBox}"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="black"
                stroke-width="2"
            >${innerSvg}</svg>`;
        this.display.style.setProperty(CUSTOM_PROPERTY_NAME.maskImageFilled, `url(${svgToDataURI(customSvgFilled)})`);
        this.display.style.setProperty(CUSTOM_PROPERTY_NAME.maskImageOutlined, `url(${svgToDataURI(customSvgOutlined)})`);
    }
    setCustomPropertyValue(propertyName) {
        requestAnimationFrame(() => {
            if (!this.display || SUPPORTS_ATTR_TYPE) {
                return;
            }
            const propertyValue = this[propertyName];
            if (typeof propertyValue !== 'number' || Number.isNaN(propertyValue)) {
                this.display.style.removeProperty(CUSTOM_PROPERTY_NAME[propertyName]);
            }
            else {
                this.display.style.setProperty(CUSTOM_PROPERTY_NAME[propertyName], `${propertyValue}`);
            }
        });
    }
}
__decorate([
    observable
], BaseRatingDisplay.prototype, "iconSlot", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "count", void 0);
__decorate([
    attr({ attribute: 'icon-view-box' })
], BaseRatingDisplay.prototype, "iconViewBox", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "max", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseRatingDisplay.prototype, "value", void 0);
//# sourceMappingURL=rating-display.base.js.map