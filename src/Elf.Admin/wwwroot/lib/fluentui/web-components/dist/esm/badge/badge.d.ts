import { FASTElement } from '@microsoft/fast-element';
import { StartEnd } from '../patterns/start-end.js';
import { BadgeAppearance, BadgeColor, BadgeShape, BadgeSize } from './badge.options.js';
/**
 * The base class used for constructing a fluent-badge custom element
 * @public
 */
export declare class Badge extends FASTElement {
    /**
     * The appearance the badge should have.
     *
     * @tag fluent-badge
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: BadgeAppearance;
    /**
     * The color the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color: BadgeColor;
    /**
     * The shape the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape?: BadgeShape;
    /**
     * The size the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: BadgeSize;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API extractor.
 * TODO: Below will be unnecessary when Badge class gets updated
 * @internal
 */
export interface Badge extends StartEnd {
}
