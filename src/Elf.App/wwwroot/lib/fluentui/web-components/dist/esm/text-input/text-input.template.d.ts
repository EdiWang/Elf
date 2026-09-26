import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { TextInput } from './text-input.js';
import type { TextInputOptions } from './text-input.options.js';
/**
 * Generates a template for the TextInput component.
 *
 * @public
 */
export declare function textInputTemplate<T extends TextInput>(options?: TextInputOptions): ElementViewTemplate<T>;
/**
 * @internal
 */
export declare const template: ElementViewTemplate<TextInput>;
