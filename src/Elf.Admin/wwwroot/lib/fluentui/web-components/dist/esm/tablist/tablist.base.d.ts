import { FASTElement } from '@microsoft/fast-element';
import type { Tab } from '../tab/tab.js';
import { TablistOrientation } from './tablist.options.js';
/**
 * A Tablist element that wraps a collection of tab elements
 * @public
 */
export declare class BaseTablist extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Used for disabling all click and keyboard events for the tabs, child tab elements.
     * @public
     * @remarks
     * HTML Attribute: disabled.
     */
    disabled: boolean;
    /** @internal */
    protected disabledChanged(prev: boolean, next: boolean): void;
    /**
     * The orientation
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation: TablistOrientation;
    protected orientationChanged(prev: TablistOrientation, next: TablistOrientation): void;
    /**
     * The id of the active tab
     *
     * @public
     * @remarks
     * HTML Attribute: activeid
     */
    activeid: string;
    /** @internal */
    protected activeidChanged(oldValue: string, newValue: string): void;
    /**
     * Content slotted in the tab slot.
     * @internal
     */
    slottedTabs: Node[];
    /** @internal */
    protected slottedTabsChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /** @internal */
    tabs: Tab[];
    /** @internal */
    protected tabsChanged(prev: Tab[] | undefined, next: Tab[] | undefined): void;
    /**
     * A reference to the active tab
     * @public
     */
    activetab: Tab;
    private tabPanelMap;
    private change;
    /**
     * Function that is invoked whenever the selected tab or the tab collection changes.
     */
    protected setTabs({ connectToPanel, forceDisabled }?: {
        connectToPanel?: boolean | undefined;
        forceDisabled?: boolean | undefined;
    }): void;
    /** @internal */
    handleFocusIn(event: FocusEvent): void;
    private changeTab;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
}
