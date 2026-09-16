import { __decorate } from "tslib";
import { attr, FASTElement, observable } from '@microsoft/fast-element';
import { uniqueId } from '../utils/unique-id.js';
import { isTab } from '../tab/tab.options.js';
import { swapStates, toggleState } from '../utils/element-internals.js';
import { waitForConnectedDescendants } from '../utils/request-idle-callback.js';
import { TablistOrientation } from './tablist.options.js';
/**
 * A Tablist element that wraps a collection of tab elements
 * @public
 */
export class BaseTablist extends FASTElement {
    /** @internal */
    disabledChanged(prev, next) {
        if (this.elementInternals) {
            toggleState(this.elementInternals, 'disabled', next);
        }
        this.setTabs({ forceDisabled: true });
    }
    orientationChanged(prev, next) {
        if (this.elementInternals) {
            this.elementInternals.ariaOrientation = next ?? TablistOrientation.horizontal;
            swapStates(this.elementInternals, prev, next, TablistOrientation);
        }
        this.setTabs();
    }
    /** @internal */
    activeidChanged(oldValue, newValue) {
        if (this.tabs?.length > 0) {
            this.changeTab(oldValue, newValue);
        }
    }
    /** @internal */
    slottedTabsChanged(prev, next) {
        this.tabs = next?.filter(tab => isTab(tab)) ?? [];
    }
    /** @internal */
    tabsChanged(prev, next) {
        if (this.tabs?.length > 0) {
            this.setTabs({ connectToPanel: true });
        }
    }
    /**
     * Function that is invoked whenever the selected tab or the tab collection changes.
     */
    setTabs({ connectToPanel = false, forceDisabled = false } = {}) {
        if (!this.tabs) {
            return;
        }
        const rootNode = this.getRootNode();
        let firstEnabledTabId = '';
        for (const tab of this.tabs) {
            if (tab.slot !== 'tab') {
                continue;
            }
            tab.id ||= uniqueId('tab-');
            if (forceDisabled) {
                tab.disabled = this.disabled;
            }
            else {
                tab.disabled = tab.disabled || this.disabled;
            }
            if (!firstEnabledTabId && !tab.disabled) {
                firstEnabledTabId = tab.id;
            }
            const isSelected = this.activeid === tab.id;
            tab.toggleAttribute('focusgroupstart', isSelected);
            tab.setAttribute('aria-selected', isSelected.toString());
            if (connectToPanel) {
                const ariaControls = tab.getAttribute('aria-controls') ?? '';
                const panel = rootNode.getElementById(ariaControls);
                if (ariaControls && panel) {
                    panel.role ??= 'tabpanel';
                    panel.hidden = this.activeid !== tab.id;
                    this.tabPanelMap.set(tab, panel);
                }
            }
        }
        if (!this.disabled) {
            if (this.activeid) {
                this.changeTab(undefined, this.activeid);
            }
            else if (firstEnabledTabId) {
                this.activeid = firstEnabledTabId;
            }
        }
    }
    /** @internal */
    handleFocusIn(event) {
        this.activeid = event.target.id;
    }
    /** @internal */
    handleClick(event) {
        // We only need to handle click event when `tab.click()` is called, a user
        // click will be handled by `focusin` event. And as per the DOM spec,
        // calling `Element.click()` results in `isTrusted=false`:
        // https://dom.spec.whatwg.org/#dom-event-istrusted
        if (event.isTrusted) {
            return;
        }
        this.activeid = event.target.id;
    }
    changeTab(oldId, newId) {
        const rootNode = this.getRootNode();
        const prevTab = oldId ? rootNode.getElementById(oldId) : null;
        const nextTab = rootNode.getElementById(newId);
        if (!isTab(nextTab) || nextTab.disabled || !this.contains(nextTab)) {
            return;
        }
        if (prevTab) {
            prevTab.setAttribute('aria-selected', 'false');
            const prevPanel = this.tabPanelMap.get(prevTab);
            if (prevPanel) {
                prevPanel.hidden = true;
            }
        }
        nextTab.setAttribute('aria-selected', 'true');
        const nextPanel = this.tabPanelMap.get(nextTab);
        if (nextPanel) {
            nextPanel.hidden = false;
        }
        this.activetab = nextTab;
        this.change();
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * Used for disabling all click and keyboard events for the tabs, child tab elements.
         * @public
         * @remarks
         * HTML Attribute: disabled.
         */
        this.disabled = false;
        /**
         * The orientation
         * @public
         * @remarks
         * HTML Attribute: orientation
         */
        this.orientation = TablistOrientation.horizontal;
        /** @internal */
        this.tabs = [];
        this.tabPanelMap = new WeakMap();
        this.change = () => {
            this.$emit('change', this.activetab);
        };
        this.elementInternals.role = 'tablist';
        this.elementInternals.ariaOrientation = this.orientation ?? TablistOrientation.horizontal;
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        waitForConnectedDescendants(this, () => {
            this.setTabs();
        }, { shallow: true });
    }
}
__decorate([
    attr({ mode: 'boolean' })
], BaseTablist.prototype, "disabled", void 0);
__decorate([
    attr
], BaseTablist.prototype, "orientation", void 0);
__decorate([
    attr
], BaseTablist.prototype, "activeid", void 0);
__decorate([
    observable
], BaseTablist.prototype, "slottedTabs", void 0);
__decorate([
    observable
], BaseTablist.prototype, "tabs", void 0);
//# sourceMappingURL=tablist.base.js.map