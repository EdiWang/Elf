import { FASTElement } from '@microsoft/fast-element';
import { TextAlign, TextFont, TextSize, TextWeight } from './text.options.js';
/**
 * The base class used for constructing a fluent-text custom element
 *
 * @tag fluent-text
 *
 * @public
 */
export declare class Text extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The text will not wrap
     * NOTE: In Fluent UI React v9 this is "wrap"
     * Boolean attributes which default to true in HTML can't be switched off in the DOM
     *
     * @public
     * @remarks
     * HTML Attribute: nowrap
     */
    nowrap: boolean;
    /**
     * The text truncates
     *
     * @public
     * @remarks
     * HTML Attribute: truncate
     */
    truncate: boolean;
    /**
     * The text style is italic
     *
     * @public
     * @remarks
     * HTML Attribute: italic
     */
    italic: boolean;
    /**
     * The text style is underline
     *
     * @public
     * @remarks
     * HTML Attribute: underline
     */
    underline: boolean;
    /**
     * The text style is strikethrough
     *
     * @public
     * @remarks
     * HTML Attribute: strikethrough
     */
    strikethrough: boolean;
    /**
     * An text can take up the width of its container.
     *
     * @public
     * @remarks
     * HTML Attribute: block
     */
    block: boolean;
    /**
     * THe Text size
     *
     * @public
     * @remarks
     * HTML Attribute: size
     *
     */
    size?: TextSize;
    /**
     * THe Text font
     *
     * @public
     * @remarks
     * HTML Attribute: font
     */
    font?: TextFont;
    /**
     * The Text weight
     *
     * @public
     * @remarks
     * HTML Attribute: weight
     */
    weight?: TextWeight;
    /**
     * The Text alignment
     *
     * @public
     * @remarks
     * HTML Attribute: align
     */
    align?: TextAlign;
}
