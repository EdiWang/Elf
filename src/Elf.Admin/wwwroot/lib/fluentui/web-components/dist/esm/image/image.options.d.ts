import type { ValuesOf } from '../utils/typings.js';
/**
 * Image fit
 * @public
 */
export declare const ImageFit: {
    readonly none: "none";
    readonly center: "center";
    readonly contain: "contain";
    readonly cover: "cover";
};
/**
 * Types for image fit
 * @public
 */
export type ImageFit = ValuesOf<typeof ImageFit>;
/**
 * Image shape
 * @public
 */
export declare const ImageShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};
export type ImageShape = ValuesOf<typeof ImageShape>;
/**
 * The tag name for the image element.
 *
 * @public
 */
export declare const tagName: "fluent-image";
