import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { BaseButton } from './button.base.js';
import type { ButtonOptions } from './button.options.js';
/**
 * Generates a template for the Button component.
 *
 * @public
 */
export declare function buttonTemplate<T extends BaseButton>(options?: ButtonOptions): ElementViewTemplate<T>;
/**
 * The template for the Button component.
 *
 * @public
 */
export declare const template: ElementViewTemplate<BaseButton>;
