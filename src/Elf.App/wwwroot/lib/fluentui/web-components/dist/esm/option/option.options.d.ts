import type { StartOptions } from '../patterns/start-end.js';
import type { StaticallyComposableHTML } from '../utils/template-helpers.js';
import type { DropdownOption } from './option.js';
/**
 * Predicate function that determines if the element should be considered an option.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is an option.
 * @public
 */
export declare function isDropdownOption(value: Node | null, tagName?: string): value is DropdownOption;
/**
 * The options for the {@link DropdownOption} component.
 *
 * @public
 */
export type DropdownOptionOptions = StartOptions<DropdownOption> & {
    checkedIndicator?: StaticallyComposableHTML<DropdownOption>;
};
/**
 * The tag name for the option element.
 *
 * @public
 */
export declare const tagName: "fluent-option";
