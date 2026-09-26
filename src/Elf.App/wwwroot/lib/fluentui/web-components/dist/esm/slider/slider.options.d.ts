import type { Direction } from '../utils/direction.js';
import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import type { ValuesOf } from '../utils/typings.js';
import type { Slider } from './slider.js';
/**
 * SliderSize Constants
 * @public
 */
export declare const SliderSize: {
    readonly small: "small";
    readonly medium: "medium";
};
/**
 * Applies bar height to the slider rail and diameter to the slider thumbs
 * @public
 */
export type SliderSize = ValuesOf<typeof SliderSize>;
/**
 * @public
 */
export declare const SliderOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};
/**
 * The types for the orientation of the slider
 * @public
 */
export type SliderOrientation = ValuesOf<typeof SliderOrientation>;
/**
 * @public
 */
export declare const SliderMode: {
    readonly singleValue: "single-value";
};
/**
 * The types for the selection mode of the slider
 * @public
 */
export type SliderMode = ValuesOf<typeof SliderMode>;
/**
 * @public
 */
export interface SliderConfiguration {
    max?: string;
    min?: string;
    orientation?: SliderOrientation;
    direction?: Direction;
    disabled?: boolean;
}
/**
 * Slider configuration options
 * @public
 */
export type SliderOptions = {
    thumb?: StaticallyComposableHTML<Slider>;
};
/**
 * The tag name for the slider element.
 *
 * @public
 */
export declare const tagName: "fluent-slider";
