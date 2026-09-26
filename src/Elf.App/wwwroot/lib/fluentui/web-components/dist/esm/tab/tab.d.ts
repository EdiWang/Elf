import { FASTElement } from '@microsoft/fast-element';
import type { StartEndOptions } from '../patterns/start-end.js';
import { StartEnd } from '../patterns/start-end.js';
/**
 * Tab configuration options
 * @public
 */
export type TabOptions = StartEndOptions<Tab>;
/**
 * Tab extends the FASTTab and is a child of the TabList
 *
 * @tag fluent-tab
 */
export declare class Tab extends FASTElement {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    protected disabledChanged(prev: boolean, next: boolean): void;
    /**
     * Internal text content stylesheet, used to set the content of the `::after`
     * pseudo element to prevent layout shift when the font weight changes on selection.
     * @internal
     */
    private styles?;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    constructor();
    connectedCallback(): void;
    private setDisabledSideEffect;
}
export interface Tab extends StartEnd {
}
