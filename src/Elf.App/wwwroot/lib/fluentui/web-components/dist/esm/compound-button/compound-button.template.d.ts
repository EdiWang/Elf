import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { CompoundButton } from './compound-button.js';
import type { CompoundButtonOptions } from './compound-button.options.js';
/**
 * Generates a template for the Button component.
 *
 * @public
 */
export declare function buttonTemplate<T extends CompoundButton>(options?: CompoundButtonOptions): ElementViewTemplate<T>;
/**
 * The template for the Button component.
 *
 * @public
 */
export declare const template: ElementViewTemplate<CompoundButton>;
