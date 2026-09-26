import { FASTElement } from '@microsoft/fast-element';
import { type AnchorTarget } from './anchor-button.options.js';
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
export declare class BaseAnchor extends FASTElement {
    /**
     * Holds a reference to the platform to manage ctrl+click on Windows and cmd+click on Mac
     * @internal
     */
    private readonly isMac;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The proxy anchor element
     * @internal
     */
    private internalProxyAnchor;
    /**
     * Prompts the user to save the linked URL.
     *
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#download | `download`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `download`
     */
    download?: string;
    /**
     * The URL the hyperlink references.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#href | `href`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `href`
     */
    href?: string;
    /**
     * Hints at the language of the referenced resource.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#hreflang | `hreflang`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `hreflang`
     */
    hreflang?: string;
    /**
     * The ping attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#ping | `ping`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `ping`
     */
    ping?: string;
    /**
     * The referrerpolicy attribute.
     * See The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#referrerpolicy | `referrerpolicy`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `referrerpolicy`
     */
    referrerpolicy?: string;
    /**
     * The rel attribute.
     * See The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#rel | `rel`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `rel`
     */
    rel: string;
    /**
     * The target attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#target | `target`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `target`
     */
    target?: AnchorTarget;
    /**
     * The type attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#type | `type`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type?: string;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Handles changes to observable properties
     * @internal
     * @param source - the source of the change
     * @param propertyName - the property name being changed
     */
    handleChange(source: any, propertyName: string): void;
    /**
     * Handles the anchor click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e: PointerEvent): boolean;
    /**
     * Handles keydown events for the anchor.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Handles navigation based on input
     * If a modified activation requests a new tab, opens the href in a new window.
     * @internal
     */
    private handleNavigation;
    /**
     * A method for updating proxy attributes when attributes have changed
     * @internal
     * @param attribute - an attribute to set/remove
     * @param value - the value of the attribute
     */
    private handleProxyAttributeChange;
    private createProxyElement;
}
