import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import type { ValuesOf } from '../utils/typings.js';
import type { Checkbox } from './checkbox.js';
/**
 * Checkbox configuration options
 * @public
 */
export type CheckboxOptions = {
    checkedIndicator?: StaticallyComposableHTML<Checkbox>;
    indeterminateIndicator?: StaticallyComposableHTML<Checkbox>;
};
/**
 * Checkbox shape
 * @public
 */
export declare const CheckboxShape: {
    readonly circular: "circular";
    readonly square: "square";
};
/** @public */
export type CheckboxShape = ValuesOf<typeof CheckboxShape>;
/**
 * Checkbox size
 * @public
 */
export declare const CheckboxSize: {
    readonly medium: "medium";
    readonly large: "large";
};
/** @public */
export type CheckboxSize = ValuesOf<typeof CheckboxSize>;
/**
 * The tag name for the checkbox element.
 *
 * @public
 */
export declare const tagName: "fluent-checkbox";
