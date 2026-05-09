import { BaseSpinner } from './spinner.base.js';
import { SpinnerAppearance, SpinnerSize } from './spinner.options.js';
/**
 * A Spinner Custom HTML Element.
 * Based on BaseSpinner and includes style and layout specific attributes
 *
 * @tag fluent-spinner
 *
 * @public
 */
export declare class Spinner extends BaseSpinner {
    /**
     * The size of the spinner
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: SpinnerSize;
    /**
     * The appearance of the spinner
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance?: SpinnerAppearance;
}
