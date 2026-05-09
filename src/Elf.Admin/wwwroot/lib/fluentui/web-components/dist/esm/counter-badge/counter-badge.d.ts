import { FASTElement } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { CounterBadgeAppearance, CounterBadgeColor, CounterBadgeShape, CounterBadgeSize } from './counter-badge.options.js';
/**
 * The base class used for constructing a fluent-badge custom element
 *
 * @tag fluent-counter-badge
 *
 * @public
 */
export declare class CounterBadge extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The appearance the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance?: CounterBadgeAppearance;
    /**
     * The color the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color?: CounterBadgeColor;
    /**
     * The shape the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape?: CounterBadgeShape;
    /**
     * The size the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: CounterBadgeSize;
    /**
     * The count the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: count
     */
    count: number;
    protected countChanged(): void;
    /**
     * Max number to be displayed
     *
     * @public
     * @remarks
     * HTML Attribute: overflow-count
     */
    overflowCount: number;
    protected overflowCountChanged(): void;
    /**
     * If the badge should be shown when count is 0
     *
     * @public
     * @remarks
     * HTML Attribute: show-zero
     */
    showZero: boolean;
    /**
     * If a dot should be displayed without the count
     *
     * @public
     * @remarks
     * HTML Attribute: dot
     */
    dot: boolean;
    /**
     * Function to set the count
     * This is the default slotted content for the counter badge
     * If children are slotted, that will override the value returned
     *
     * @internal
     */
    setCount(): string | void;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API extractor.
 * TODO: Below will be unnecessary when Badge class gets updated
 * @internal
 */
export interface CounterBadge extends StartEnd {
}
