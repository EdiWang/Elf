/**
 * A {@link FocusGroupItemCollection} backed by a host-supplied array of items in DOM order.
 *
 * Stateless: every call reads from `getItems()` so the host is the single source of truth.
 * Suitable for components whose items are flat slotted children (tablist, radio-group, menu-list)
 * or any component that maintains its own ordered list of focusable descendants.
 */
export class ArrayItemCollection {
    constructor(getItems, getStart) {
        this.getItems = getItems;
        this.getStart = getStart;
    }
    get start() {
        return this.getStart?.() ?? null;
    }
    first() {
        return this.getItems()[0] ?? null;
    }
    last() {
        const items = this.getItems();
        return items[items.length - 1] ?? null;
    }
    next(current) {
        const items = this.getItems();
        const i = items.indexOf(current);
        return i === -1 ? null : items[i + 1] ?? null;
    }
    previous(current) {
        const items = this.getItems();
        const i = items.indexOf(current);
        return i <= 0 ? null : items[i - 1] ?? null;
    }
    *items() {
        for (const element of this.getItems()) {
            yield { element };
        }
    }
    contains(element) {
        return this.getItems().includes(element);
    }
}
//# sourceMappingURL=focusgroup.js.map