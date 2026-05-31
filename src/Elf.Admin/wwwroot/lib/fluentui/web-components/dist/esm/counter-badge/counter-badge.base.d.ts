import { FASTElement } from '@microsoft/fast-element';
/**
 * The base class used for constructing a fluent-counter-badge custom element.
 * Contains the count-related state and display logic, without any visual
 * appearance attributes.
 *
 * @public
 */
export declare class BaseCounterBadge extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The count to be displayed in the badge.
     *
     * @public
     * @remarks
     * HTML Attribute: `count`
     */
    count: number;
    /**
     * The maximum count to be displayed before showing the overflow count (e.g. "99+").
     *
     * @public
     * @remarks
     * HTML Attribute: `overflow-count`
     */
    overflowCount: number;
    /**
     * Whether to show the badge when the count is zero. By default, the badge will be hidden when the count is zero.
     *
     * @public
     * @remarks
     * HTML Attribute: `show-zero`
     */
    showZero: boolean;
    /**
     * Whether to display the badge as a dot. When true, the badge will be displayed as a dot and the count will not be
     * shown.
     *
     * @public
     * @remarks
     * HTML Attribute: `dot`
     */
    dot: boolean;
    /**
     * The value to be displayed in the badge, which is determined by the `count`, `overflow-count`, and `show-zero` attributes.
     *
     * @public
     */
    get displayValue(): string | undefined;
}
