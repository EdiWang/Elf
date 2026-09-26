import type { ElementViewTemplate } from '@microsoft/fast-element';
import type { DropdownOption } from './option.js';
import type { DropdownOptionOptions } from './option.options.js';
/**
 * Generates a template for the {@link (Option:class)} component.
 *
 * @param options - The {@link (OptionOptions:interface)} to use for generating the template.
 * @returns The template object.
 * @public
 */
export declare function dropdownOptionTemplate<T extends DropdownOption>(options?: DropdownOptionOptions): ElementViewTemplate<T>;
/**
 * Template for the Option component.
 * @public
 */
export declare const template: ElementViewTemplate<DropdownOption>;
