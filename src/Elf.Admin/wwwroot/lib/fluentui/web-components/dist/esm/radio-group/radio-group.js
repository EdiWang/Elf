import { FocusGroup } from '@microsoft/focusgroup-polyfill/shadowless';
import { ArrayItemCollection } from '../utils/focusgroup.js';
import { BaseRadioGroup } from './radio-group.base.js';
/**
 * A Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @tag fluent-radio-group
 *
 * @slot - The default slot for the radio group
 *
 * @public
 */
export class RadioGroup extends BaseRadioGroup {
    disconnectedCallback() {
        this.fg?.disconnect();
        super.disconnectedCallback();
    }
    radiosChanged(prev, next) {
        super.radiosChanged(prev, next);
        this.fgItems ??= new ArrayItemCollection(() => this.enabledRadios?.filter(r => !r.hidden) ?? [], () => this.enabledRadios?.find(r => r.checked) ?? null);
        if (!this.fg) {
            this.fg = new FocusGroup(this, this.fgItems, {
                definition: {
                    behavior: 'radiogroup',
                    axis: undefined,
                    wrap: true,
                },
            });
        }
        else {
            this.fg.update();
        }
    }
}
//# sourceMappingURL=radio-group.js.map