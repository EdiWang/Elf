import type { ElementViewTemplate } from '@microsoft/fast-element';
import type { MenuItem, MenuItemOptions } from './menu-item.js';
export declare function menuItemTemplate<T extends MenuItem>(options?: MenuItemOptions): ElementViewTemplate<T>;
export declare const template: ElementViewTemplate<MenuItem>;
