import { type CaptureType } from '@microsoft/fast-element';
import { type StaticallyComposableHTML } from '../utils/template-helpers.js';
/**
 * Start configuration options
 * @public
 */
export type StartOptions<TSource = any, TParent = any> = {
    start?: StaticallyComposableHTML<TSource, TParent>;
};
/**
 * End configuration options
 * @public
 */
export type EndOptions<TSource = any, TParent = any> = {
    end?: StaticallyComposableHTML<TSource, TParent>;
};
/**
 * Start/End configuration options
 * @public
 */
export type StartEndOptions<TSource = any, TParent = any> = StartOptions<TSource, TParent> & EndOptions<TSource, TParent>;
/**
 * A mixin class implementing start slots.
 * @public
 */
export declare class Start {
    start: HTMLSlotElement;
}
/**
 * A mixin class implementing end slots.
 * @public
 */
export declare class End {
    end: HTMLSlotElement;
}
/**
 * A mixin class implementing start and end slots.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
export declare class StartEnd implements Start, End {
    start: HTMLSlotElement;
    end: HTMLSlotElement;
}
/**
 * The template for the end slot.
 * For use with {@link StartEnd}
 *
 * @public
 */
export declare function endSlotTemplate<TSource extends StartEnd = StartEnd, TParent = any>(options: EndOptions<TSource, TParent>): CaptureType<TSource, TParent>;
/**
 * The template for the start slots.
 * For use with {@link StartEnd}
 *
 * @public
 */
export declare function startSlotTemplate<TSource extends Pick<StartEnd, 'start'> = StartEnd, TParent = any>(options: StartOptions<TSource, TParent>): CaptureType<TSource, TParent>;
