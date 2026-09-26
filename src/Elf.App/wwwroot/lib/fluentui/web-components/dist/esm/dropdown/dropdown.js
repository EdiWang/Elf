import { __decorate } from "tslib";
import { attr } from '@microsoft/fast-element';
import { BaseDropdown } from './dropdown.base.js';
import { DropdownAppearance } from './dropdown.options.js';
/**
 * The Fluent Dropdown Element. Implements {@link @microsoft/fast-foundation#BaseDropdown}.
 *
 * @tag fluent-dropdown
 *
 * @slot - The default slot. Accepts a {@link (Listbox:class)} element.
 * @slot indicator - The indicator slot.
 * @slot control - The control slot. This slot is automatically populated and should not be manually manipulated.
 *
 * @public
 */
export class Dropdown extends BaseDropdown {
    constructor() {
        super(...arguments);
        /**
         * The appearance of the dropdown.
         *
         * @public
         * @remarks
         * HTML Attribute: `appearance`
         */
        this.appearance = DropdownAppearance.outline;
    }
}
__decorate([
    attr
], Dropdown.prototype, "appearance", void 0);
__decorate([
    attr
], Dropdown.prototype, "size", void 0);
//# sourceMappingURL=dropdown.js.map