import { __decorate } from "tslib";
import { attr, FASTElement } from '@microsoft/fast-element';
/**
 * A Message Bar Custom HTML Element.
 *
 * @tag fluent-message-bar
 *
 * @slot actions - Content that can be provided for the actions
 * @slot dismiss - Content that can be provided for the dismiss button
 * @slot - The default slot for the content
 * @public
 */
export class MessageBar extends FASTElement {
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * Method to emit a `dismiss` event when the message bar is dismissed
         *
         * @public
         */
        this.dismissMessageBar = () => {
            this.$emit('dismiss', {});
        };
        this.elementInternals.role = 'status';
    }
}
__decorate([
    attr
], MessageBar.prototype, "shape", void 0);
__decorate([
    attr
], MessageBar.prototype, "layout", void 0);
__decorate([
    attr
], MessageBar.prototype, "intent", void 0);
//# sourceMappingURL=message-bar.js.map