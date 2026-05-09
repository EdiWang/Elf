import { __decorate } from "tslib";
import { attr, FASTElement, nullableNumberConverter } from '@microsoft/fast-element';
import { applyMixins } from '../utils/apply-mixins.js';
import { StartEnd } from '../patterns/start-end.js';
/**
 * The base class used for constructing a fluent-badge custom element
 *
 * @tag fluent-counter-badge
 *
 * @public
 */
export class CounterBadge extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The count the badge should have.
         *
         * @public
         * @remarks
         * HTML Attribute: count
         */
        this.count = 0;
        /**
         * Max number to be displayed
         *
         * @public
         * @remarks
         * HTML Attribute: overflow-count
         */
        this.overflowCount = 99;
        /**
         * If the badge should be shown when count is 0
         *
         * @public
         * @remarks
         * HTML Attribute: show-zero
         */
        this.showZero = false;
        /**
         * If a dot should be displayed without the count
         *
         * @public
         * @remarks
         * HTML Attribute: dot
         */
        this.dot = false;
    }
    countChanged() {
        this.setCount();
    }
    overflowCountChanged() {
        this.setCount();
    }
    /**
     * Function to set the count
     * This is the default slotted content for the counter badge
     * If children are slotted, that will override the value returned
     *
     * @internal
     */
    setCount() {
        const count = this.count ?? 0;
        if ((count !== 0 || this.showZero) && !this.dot) {
            return count > this.overflowCount ? `${this.overflowCount}+` : `${count}`;
        }
        return;
    }
}
__decorate([
    attr
], CounterBadge.prototype, "appearance", void 0);
__decorate([
    attr
], CounterBadge.prototype, "color", void 0);
__decorate([
    attr
], CounterBadge.prototype, "shape", void 0);
__decorate([
    attr
], CounterBadge.prototype, "size", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], CounterBadge.prototype, "count", void 0);
__decorate([
    attr({ attribute: 'overflow-count', converter: nullableNumberConverter })
], CounterBadge.prototype, "overflowCount", void 0);
__decorate([
    attr({ attribute: 'show-zero', mode: 'boolean' })
], CounterBadge.prototype, "showZero", void 0);
__decorate([
    attr({ mode: 'boolean' })
], CounterBadge.prototype, "dot", void 0);
applyMixins(CounterBadge, StartEnd);
//# sourceMappingURL=counter-badge.js.map