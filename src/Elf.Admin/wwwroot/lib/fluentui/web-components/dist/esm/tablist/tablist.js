import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { FocusGroup } from '@microsoft/focusgroup-polyfill/shadowless';
import { ArrayItemCollection } from '../utils/focusgroup.js';
import { BaseTablist } from './tablist.base.js';
import { TablistAppearance } from './tablist.options.js';
/**
 * A Tablist component.
 *
 * @tag fluent-tablist
 *
 * @public
 */
export class Tablist extends BaseTablist {
    constructor() {
        super(...arguments);
        /**
         * appearance
         * There are two modes of appearance: transparent and subtle.
         */
        this.appearance = TablistAppearance.transparent;
    }
    disconnectedCallback() {
        this.fg?.disconnect();
        super.disconnectedCallback();
    }
    tabsChanged(prev, next) {
        super.tabsChanged(prev, next);
        this.fgItems ??= new ArrayItemCollection(() => this.tabs?.filter(t => (t.getAttribute('aria-selected') === 'true' || !t.disabled) && !t.hidden) ?? [], () => this.activetab ?? null);
        if (!this.fg) {
            this.fg = new FocusGroup(this, this.fgItems, {
                definition: {
                    behavior: 'tablist',
                    axis: undefined,
                    memory: false,
                    wrap: true,
                },
            });
        }
        else {
            this.fg.update();
        }
    }
}
__decorate([
    attr
], Tablist.prototype, "appearance", void 0);
__decorate([
    attr
], Tablist.prototype, "size", void 0);
//# sourceMappingURL=tablist.js.map