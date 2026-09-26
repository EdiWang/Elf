import type { FocusGroupItemCollection } from '@microsoft/focusgroup-polyfill/shadowless';
/**
 * A {@link FocusGroupItemCollection} backed by a host-supplied array of items in DOM order.
 *
 * Stateless: every call reads from `getItems()` so the host is the single source of truth.
 * Suitable for components whose items are flat slotted children (tablist, radio-group, menu-list)
 * or any component that maintains its own ordered list of focusable descendants.
 */
export declare class ArrayItemCollection<T extends HTMLElement> implements FocusGroupItemCollection {
    private getItems;
    private getStart?;
    constructor(getItems: () => readonly T[], getStart?: (() => T | null) | undefined);
    get start(): HTMLElement | null;
    first(): HTMLElement | null;
    last(): HTMLElement | null;
    next(current: HTMLElement): HTMLElement | null;
    previous(current: HTMLElement): HTMLElement | null;
    items(): Iterable<{
        element: HTMLElement;
    }>;
    contains(element: Element): boolean;
}
