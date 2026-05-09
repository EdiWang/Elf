import { __decorate } from "tslib";
import { attr, Observable } from '@microsoft/fast-element';
import { BaseTextArea } from './textarea.base.js';
import { TextAreaAppearance } from './textarea.options.js';
/**
 * The Fluent TextArea Element.
 *
 * @tag fluent-text-area
 *
 */
export class TextArea extends BaseTextArea {
    constructor() {
        super(...arguments);
        /**
         * Indicates the visual appearance of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: `appearance`
         */
        this.appearance = TextAreaAppearance.outline;
        /**
         * Indicates whether the textarea should be a block-level element.
         *
         * @public
         * @remarks
         * HTML Attribute: `block`
         */
        this.block = false;
    }
    labelSlottedNodesChanged() {
        super.labelSlottedNodesChanged();
        this.labelSlottedNodes.forEach(node => {
            node.size = this.size;
        });
    }
    /**
     * @internal
     */
    handleChange(_, propertyName) {
        switch (propertyName) {
            case 'size':
                this.labelSlottedNodes.forEach(node => {
                    node.size = this.size;
                });
                break;
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        Observable.getNotifier(this).subscribe(this, 'size');
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        Observable.getNotifier(this).unsubscribe(this, 'size');
    }
}
__decorate([
    attr({ mode: 'fromView' })
], TextArea.prototype, "appearance", void 0);
__decorate([
    attr({ mode: 'boolean' })
], TextArea.prototype, "block", void 0);
__decorate([
    attr
], TextArea.prototype, "size", void 0);
//# sourceMappingURL=textarea.js.map