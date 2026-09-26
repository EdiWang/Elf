import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { BaseDropdown } from './dropdown.base.js';
import type { DropdownOptions } from './dropdown.options.js';
/**
 * The template partial for the dropdown input element. This template is used when the `type` property is set to "combobox".
 *
 * @public
 * @remarks
 * Since the input element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export declare const dropdownInputTemplate: import("@microsoft/fast-element").ViewTemplate<BaseDropdown, any>;
/**
 * The template partial for the dropdown button element. This template is used when the `type` property is set to "dropdown".
 *
 * @public
 * @remarks
 * Since the button element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export declare const dropdownButtonTemplate: import("@microsoft/fast-element").ViewTemplate<BaseDropdown, any>;
/**
 * Generates a template for the {@link (Dropdown:class)} component.
 *
 * @param options - The {@link (DropdownOptions:interface)} to use for generating the template.
 * @returns The template object.
 *
 * @public
 */
export declare function dropdownTemplate<T extends BaseDropdown>(options?: DropdownOptions): ElementViewTemplate<T>;
/**
 * Template for the Dropdown component.
 *
 * @public
 */
export declare const template: ElementViewTemplate<BaseDropdown>;
