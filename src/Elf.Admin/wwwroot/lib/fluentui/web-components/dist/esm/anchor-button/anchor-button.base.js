import { __decorate } from "tslib";
import { attr, FASTElement, Observable } from '@microsoft/fast-element';
import { AnchorAttributes } from './anchor-button.options.js';
/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @slot start - Content which can be provided before the anchor content
 * @slot end - Content which can be provided after the anchor content
 * @slot - The default slot for anchor content
 * @csspart control - The anchor element
 * @csspart content - The element wrapping anchor content
 *
 * @public
 */
export class BaseAnchor extends FASTElement {
    constructor() {
        super();
        /**
         * Holds a reference to the platform to manage ctrl+click on Windows and cmd+click on Mac
         * @internal
         */
        this.isMac = navigator.userAgent.includes('Mac');
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The proxy anchor element
         * @internal
         */
        this.internalProxyAnchor = this.createProxyElement();
        this.elementInternals.role = 'link';
    }
    connectedCallback() {
        super.connectedCallback();
        this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
        Observable.getNotifier(this).subscribe(this);
        Object.keys(this.$fastController.definition.attributeLookup).forEach(key => {
            this.handleChange(this, key);
        });
        this.append(this.internalProxyAnchor);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        Observable.getNotifier(this).unsubscribe(this);
    }
    /**
     * Handles changes to observable properties
     * @internal
     * @param source - the source of the change
     * @param propertyName - the property name being changed
     */
    handleChange(source, propertyName) {
        if (propertyName in AnchorAttributes) {
            const attribute = this.$fastController.definition.attributeLookup[propertyName]?.attribute;
            if (attribute) {
                this.handleProxyAttributeChange(attribute, this[propertyName]);
            }
        }
    }
    /**
     * Handles the anchor click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e) {
        if (e.composedPath()[0] === this.internalProxyAnchor) {
            e.stopImmediatePropagation();
            return true;
        }
        if (this.href) {
            const newTab = e.ctrlKey || e.metaKey;
            this.handleNavigation(newTab);
        }
        return true;
    }
    /**
     * Handles keydown events for the anchor.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keydownHandler(e) {
        if (this.href) {
            if (e.key === 'Enter') {
                const newTab = !this.isMac ? e.ctrlKey : e.metaKey || e.ctrlKey;
                this.handleNavigation(newTab);
                return;
            }
        }
        return true;
    }
    /**
     * Handles navigation based on input
     * If a modified activation requests a new tab, opens the href in a new window.
     * @internal
     */
    handleNavigation(newTab) {
        newTab ? window.open(this.href, '_blank') : this.internalProxyAnchor.click();
    }
    /**
     * A method for updating proxy attributes when attributes have changed
     * @internal
     * @param attribute - an attribute to set/remove
     * @param value - the value of the attribute
     */
    handleProxyAttributeChange(attribute, value) {
        if (value) {
            this.internalProxyAnchor.setAttribute(attribute, value);
        }
        else {
            this.internalProxyAnchor.removeAttribute(attribute);
        }
    }
    createProxyElement() {
        const proxy = this.internalProxyAnchor ?? document.createElement('a');
        proxy.inert = true;
        return proxy;
    }
}
__decorate([
    attr
], BaseAnchor.prototype, "download", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "href", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "hreflang", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "ping", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "referrerpolicy", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "rel", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "target", void 0);
__decorate([
    attr
], BaseAnchor.prototype, "type", void 0);
//# sourceMappingURL=anchor-button.base.js.map