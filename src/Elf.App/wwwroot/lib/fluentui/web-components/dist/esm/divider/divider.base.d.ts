import { FASTElement } from '@microsoft/fast-element';
import { DividerOrientation, DividerRole } from './divider.options.js';
/**
 * A Divider Custom HTML Element.
 * A divider groups sections of content to create visual rhythm and hierarchy. Use dividers along with spacing and headers to organize content in your layout.
 *
 * @public
 */
export declare class BaseDivider extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: DividerRole;
    /**
     * The orientation of the divider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation?: DividerOrientation;
    connectedCallback(): void;
    /**
     * Sets the element's internal role when the role attribute changes.
     *
     * @param previous - the previous role value
     * @param next - the current role value
     * @internal
     */
    roleChanged(previous: string | null, next: string | null): void;
    /**
     * Sets the element's internal orientation when the orientation attribute changes.
     *
     * @param previous - the previous orientation value
     * @param next - the current orientation value
     * @internal
     */
    orientationChanged(previous: DividerRole | undefined, next: DividerRole | undefined): void;
}
