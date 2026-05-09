import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import type { ValuesOf } from '../utils/typings.js';
import type { BaseDropdown } from './dropdown.base.js';
/**
 * Predicate function that determines if the element should be considered a dropdown.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export declare function isDropdown(element?: Node | null, tagName?: string): element is BaseDropdown;
/**
 * Values for the `appearance` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownAppearance: {
    filledDarker: string;
    filledLighter: string;
    outline: string;
    transparent: string;
};
/** @public */
export type DropdownAppearance = ValuesOf<typeof DropdownAppearance>;
/**
 * Template options for the {@link (Dropdown:class)} component.
 * @public
 */
export type DropdownOptions = {
    indicator?: StaticallyComposableHTML<BaseDropdown>;
};
/**
 * Values for the `size` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};
/** @public */
export type DropdownSize = ValuesOf<typeof DropdownSize>;
/**
 * Values  for the `type` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownType: {
    readonly combobox: "combobox";
    readonly dropdown: "dropdown";
    readonly select: "select";
};
/** @public */
export type DropdownType = ValuesOf<typeof DropdownType>;
/**
 * The tag name for the dropdown element.
 *
 * @public
 */
export declare const tagName: "fluent-dropdown";
