import { FASTElement } from '@microsoft/fast-element';
import { ImageFit, ImageShape } from './image.options.js';
/**
 * The base class used for constucting a fluent image custom element
 *
 * @tag fluent-image
 *
 * @public
 */
export declare class Image extends FASTElement {
    /**
     * Image layout
     *
     * @public
     * @remarks
     * HTML attribute: block.
     */
    block?: boolean;
    /**
     * Image border
     *
     * @public
     * @remarks
     * HTML attribute: border.
     */
    bordered?: boolean;
    /**
     * Image shadow
     *
     * @public
     * @remarks
     * HTML attribute: shadow.
     */
    shadow?: boolean;
    /**
     * Image fit
     *
     * @public
     * @remarks
     * HTML attribute: fit.
     */
    fit?: ImageFit;
    /**
     * Image shape
     *
     * @public
     * @remarks
     * HTML attribute: shape.
     */
    shape?: ImageShape;
}
