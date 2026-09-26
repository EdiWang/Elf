import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { CounterBadge } from './counter-badge.js';
import type { CounterBadgeOptions } from './counter-badge.options.js';
/**
 * Generates a template for the CounterBadge component.
 *
 * @public
 */
export declare function counterBadgeTemplate<T extends CounterBadge>(options?: CounterBadgeOptions): ElementViewTemplate<T>;
/**
 * The template for the fluent-counter-badge component.
 *
 * @public
 */
export declare const template: ElementViewTemplate<CounterBadge>;
