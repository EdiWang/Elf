import { FASTElement } from '@microsoft/fast-element';
/**
 * The base class used for constructing a fluent-avatar custom element
 * @public
 */
export declare class BaseAvatar extends FASTElement {
    /**
     * Reference to the default slot element.
     *
     * @internal
     */
    defaultSlot: HTMLSlotElement;
    /**
     * Handles changes to the default slot element reference.
     *
     * Toggles the `has-slotted` class on the slot element for browsers that do not
     * support the `:has-slotted` CSS selector. Defers cleanup using
     * `Updates.enqueue` to avoid DOM mutations during hydration that could
     * corrupt binding markers.
     *
     * @internal
     */
    defaultSlotChanged(): void;
    /**
     * Reference to the monogram element that displays generated initials.
     *
     * @internal
     */
    monogram: HTMLElement;
    /**
     * Updates the monogram text content when the ref is captured.
     *
     * @internal
     */
    protected monogramChanged(): void;
    /**
     * The slotted content nodes assigned to the default slot.
     *
     * @internal
     */
    slottedDefaults: Node[];
    /**
     * Handles changes to the slotted default content.
     *
     * Normalizes the DOM, toggles the `has-slotted` class on the default slot element
     * for browsers that do not support the `:has-slotted` CSS selector, and removes
     * empty text nodes from the default slot to keep the DOM clean.
     *
     * @internal
     */
    protected slottedDefaultsChanged(): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The name of the person or entity represented by this Avatar. This should always be provided if it is available.
     *
     * @public
     * @remarks
     * HTML Attribute: name
     */
    name?: string | undefined;
    /**
     * Handles changes to the name attribute.
     * @internal
     */
    protected nameChanged(): void;
    /**
     * Provide custom initials rather than one generated via the name
     *
     * @public
     * @remarks
     * HTML Attribute: initials
     */
    initials?: string | undefined;
    /**
     * Handles changes to the initials attribute.
     * @internal
     */
    protected initialsChanged(): void;
    constructor();
    /**
     * Generates and sets the initials for the template.
     * Subclasses should override this to provide custom initials logic.
     *
     * @internal
     */
    generateInitials(): string | void;
    /**
     * Updates the monogram element's text content with the generated initials.
     *
     * @internal
     */
    protected updateMonogram(): void;
    /**
     * Normalizes the DOM and removes empty text nodes from the default slot.
     *
     * @internal
     */
    protected cleanupSlottedContent(): void;
}
