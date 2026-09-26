import type { ValuesOf } from '../utils/typings.js';
/**
 * Label position values
 * @public
 */
export declare const LabelPosition: {
    readonly above: "above";
    readonly after: "after";
    readonly before: "before";
};
/** @public */
export type LabelPosition = ValuesOf<typeof LabelPosition>;
/**
 * Synthetic type for slotted input elements
 * @public
 */
export type SlottableInput = HTMLElement & ElementInternals & {
    elementInternals?: ElementInternals;
    required: boolean;
    disabled: boolean;
    readOnly: boolean;
    checked?: boolean;
    value?: string;
};
/**
 * Synthetic type for slotted message elements
 * @public
 */
export declare const ValidationFlags: {
    readonly badInput: "bad-input";
    readonly customError: "custom-error";
    readonly patternMismatch: "pattern-mismatch";
    readonly rangeOverflow: "range-overflow";
    readonly rangeUnderflow: "range-underflow";
    readonly stepMismatch: "step-mismatch";
    readonly tooLong: "too-long";
    readonly tooShort: "too-short";
    readonly typeMismatch: "type-mismatch";
    readonly valueMissing: "value-missing";
    readonly valid: "valid";
};
/** @public */
export type ValidationFlags = ValuesOf<typeof ValidationFlags>;
/**
 * The tag name for the field element.
 *
 * @public
 */
export declare const tagName: "fluent-field";
