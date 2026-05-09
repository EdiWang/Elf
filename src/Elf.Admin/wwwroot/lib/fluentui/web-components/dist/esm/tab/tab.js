import { __decorate } from "tslib";
import { attr, css, FASTElement } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { applyMixins } from '../utils/apply-mixins.js';
/**
 * Tab extends the FASTTab and is a child of the TabList
 *
 * @tag fluent-tab
 */
export class Tab extends FASTElement {
    disabledChanged(prev, next) {
        this.setDisabledSideEffect(next);
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'tab';
    }
    connectedCallback() {
        super.connectedCallback();
        this.slot ||= 'tab';
        this.setDisabledSideEffect(this.disabled);
        if (this.styles) {
            this.$fastController.removeStyles(this.styles);
        }
        this.styles = css `
      :host {
        --textContent: '${this.textContent}';
      }
    `;
        this.$fastController.addStyles(this.styles);
    }
    setDisabledSideEffect(disabled) {
        if (disabled) {
            this.setAttribute('aria-disabled', 'true');
        }
        else {
            this.removeAttribute('aria-disabled');
        }
        this.tabIndex = disabled && this.getAttribute('aria-selected') !== 'true' ? -1 : 0;
    }
}
__decorate([
    attr({ mode: 'boolean' })
], Tab.prototype, "disabled", void 0);
applyMixins(Tab, StartEnd);
//# sourceMappingURL=tab.js.map