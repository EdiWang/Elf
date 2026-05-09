import { StartEnd, type StartEndOptions } from '../patterns/start-end.js';
import { BaseAnchor } from './anchor-button.base.js';
import { AnchorButtonAppearance, AnchorButtonShape, AnchorButtonSize } from './anchor-button.options.js';
/**
 * Anchor configuration options
 *
 * @tag fluent-anchor-button
 *
 * @public
 */
export type AnchorOptions = StartEndOptions<AnchorButton>;
/**
 * An Anchor Custom HTML Element.
 * Based on BaseAnchor and includes style and layout specific attributes
 *
 * @public
 */
export declare class AnchorButton extends BaseAnchor {
    /**
     * The appearance the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: AnchorButtonAppearance | undefined;
    /**
     * Handles changes to appearance attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    appearanceChanged(prev: AnchorButtonAppearance | undefined, next: AnchorButtonAppearance | undefined): void;
    /**
     * The shape the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: AnchorButtonShape | undefined;
    /**
     * Handles changes to shape attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    shapeChanged(prev: AnchorButtonShape | undefined, next: AnchorButtonShape | undefined): void;
    /**
     * The size the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: AnchorButtonSize;
    /**
     * Handles changes to size attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    sizeChanged(prev: AnchorButtonSize | undefined, next: AnchorButtonSize | undefined): void;
    /**
     * The anchor button has an icon only, no text content
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-only`
     */
    iconOnly: boolean;
    /**
     * Handles changes to icon only custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    iconOnlyChanged(prev: boolean, next: boolean): void;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface AnchorButton extends StartEnd {
}
