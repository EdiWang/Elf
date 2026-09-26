import { type ElementViewTemplate } from '@microsoft/fast-element';
import type { Dialog } from './dialog.js';
/**
 * Template for the Dialog component
 *
 * Note: The empty `<div tabindex="-1">` element above the `<slot>` element is
 * for working around a dialog focus issue, learn more at
 * https://github.com/microsoft/fluentui/pull/36278
 *
 * @public
 */
export declare const template: ElementViewTemplate<Dialog>;
