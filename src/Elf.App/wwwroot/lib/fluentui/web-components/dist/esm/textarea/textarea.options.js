import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Values for the `size` attribute on TextArea elements.
 *
 * @public
 */
export const TextAreaSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
};
/**
 * Values for the `appearance` attribute on TextArea elements.
 *
 * @public
 */
export const TextAreaAppearance = {
    outline: 'outline',
    filledLighter: 'filled-lighter',
    filledDarker: 'filled-darker',
};
/**
 * Allowed values for `appearance` when `display-shadow` is set to true.
 *
 * @public
 */
export const TextAreaAppearancesForDisplayShadow = [
    TextAreaAppearance.filledLighter,
    TextAreaAppearance.filledDarker,
];
/**
 * Values for the `autocomplete` attribute on TextArea elements.
 *
 * @public
 */
export const TextAreaAutocomplete = {
    on: 'on',
    off: 'off',
};
/**
 * Values for the `resize` attribute on TextArea elements.
 */
export const TextAreaResize = {
    none: 'none',
    both: 'both',
    horizontal: 'horizontal',
    vertical: 'vertical',
};
/**
 * The tag name for the textarea element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-textarea`;
//# sourceMappingURL=textarea.options.js.map