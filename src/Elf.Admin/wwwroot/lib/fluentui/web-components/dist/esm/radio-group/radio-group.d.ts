import type { Radio } from '../radio/radio.js';
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
export declare class RadioGroup extends BaseRadioGroup {
    private fg;
    private fgItems;
    disconnectedCallback(): void;
    radiosChanged(prev: Radio[] | undefined, next: Radio[] | undefined): void;
}
