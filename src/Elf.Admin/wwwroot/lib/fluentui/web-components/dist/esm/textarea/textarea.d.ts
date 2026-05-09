import { BaseTextArea } from './textarea.base.js';
import { TextAreaAppearance, TextAreaSize } from './textarea.options.js';
/**
 * The Fluent TextArea Element.
 *
 * @tag fluent-text-area
 *
 */
export declare class TextArea extends BaseTextArea {
    protected labelSlottedNodesChanged(): void;
    /**
     * Indicates the visual appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance: TextAreaAppearance;
    /**
     * Indicates whether the textarea should be a block-level element.
     *
     * @public
     * @remarks
     * HTML Attribute: `block`
     */
    block: boolean;
    /**
     * Sets the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: TextAreaSize;
    /**
     * @internal
     */
    handleChange(_: any, propertyName: string): void;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
}
