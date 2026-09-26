import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter, volatile } from '@microsoft/fast-element';
/**
 * The base class used for constructing a fluent-counter-badge custom element.
 * Contains the count-related state and display logic, without any visual
 * appearance attributes.
 *
 * @public
 */
export class BaseCounterBadge extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The count to be displayed in the badge.
         *
         * @public
         * @remarks
         * HTML Attribute: `count`
         */
        this.count = 0;
        /**
         * The maximum count to be displayed before showing the overflow count (e.g. "99+").
         *
         * @public
         * @remarks
         * HTML Attribute: `overflow-count`
         */
        this.overflowCount = 99;
        /**
         * Whether to show the badge when the count is zero. By default, the badge will be hidden when the count is zero.
         *
         * @public
         * @remarks
         * HTML Attribute: `show-zero`
         */
        this.showZero = false;
        /**
         * Whether to display the badge as a dot. When true, the badge will be displayed as a dot and the count will not be
         * shown.
         *
         * @public
         * @remarks
         * HTML Attribute: `dot`
         */
        this.dot = false;
    }
    /**
     * The value to be displayed in the badge, which is determined by the `count`, `overflow-count`, and `show-zero` attributes.
     *
     * @public
     */
    get displayValue() {
        const count = this.count ?? 0;
        if ((!this.showZero && count === 0) || this.dot) {
            return '';
        }
        if (this.overflowCount > 0 && count > this.overflowCount) {
            return `${this.overflowCount}+`;
        }
        return `${count}`;
    }
}
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseCounterBadge.prototype, "count", void 0);
__decorate([
    attr({ attribute: 'overflow-count', converter: nullableNumberConverter })
], BaseCounterBadge.prototype, "overflowCount", void 0);
__decorate([
    attr({ attribute: 'show-zero', mode: 'boolean' })
], BaseCounterBadge.prototype, "showZero", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseCounterBadge.prototype, "dot", void 0);
__decorate([
    volatile
], BaseCounterBadge.prototype, "displayValue", null);
//# sourceMappingURL=counter-badge.base.js.map