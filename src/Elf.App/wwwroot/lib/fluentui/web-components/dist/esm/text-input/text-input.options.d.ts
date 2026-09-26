import type { StartEndOptions } from '../patterns/start-end.js';
import type { ValuesOf } from '../utils/typings.js';
import type { TextInput } from './text-input.js';
/**
 * TextInput configuration options.
 *
 * @public
 */
export type TextInputOptions = StartEndOptions<TextInput>;
/**
 * Values for the `control-size` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputControlSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
export type TextInputControlSize = ValuesOf<typeof TextInputControlSize>;
/**
 * Values for the `appearance` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputAppearance: {
    readonly outline: "outline";
    readonly underline: "underline";
    readonly filledLighter: "filled-lighter";
    readonly filledDarker: "filled-darker";
};
export type TextInputAppearance = ValuesOf<typeof TextInputAppearance>;
/**
 * Values for the `type` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputType: {
    readonly email: "email";
    readonly password: "password";
    readonly tel: "tel";
    readonly text: "text";
    readonly url: "url";
};
export type TextInputType = ValuesOf<typeof TextInputType>;
/**
 * Input types that block implicit form submission.
 *
 * @public
 */
export declare const ImplicitSubmissionBlockingTypes: string[];
/**
 * The tag name for the text input element.
 *
 * @public
 */
export declare const tagName: "fluent-text-input";
