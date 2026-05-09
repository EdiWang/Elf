import { FluentDesignSystem } from '../fluent-design-system.js';
/**
 * Values for the `control-size` attribute on TextInput elements.
 *
 * @public
 */
export const TextInputControlSize = {
    small: 'small',
    medium: 'medium',
    large: 'large',
};
/**
 * Values for the `appearance` attribute on TextInput elements.
 *
 * @public
 */
export const TextInputAppearance = {
    outline: 'outline',
    underline: 'underline',
    filledLighter: 'filled-lighter',
    filledDarker: 'filled-darker',
};
/**
 * Values for the `type` attribute on TextInput elements.
 *
 * @public
 */
export const TextInputType = {
    email: 'email',
    password: 'password',
    tel: 'tel',
    text: 'text',
    url: 'url',
};
/**
 * Input types that block implicit form submission.
 *
 * @public
 */
export const ImplicitSubmissionBlockingTypes = [
    'date',
    'datetime-local',
    'email',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week',
];
/**
 * The tag name for the text input element.
 *
 * @public
 */
export const tagName = `${FluentDesignSystem.prefix}-text-input`;
//# sourceMappingURL=text-input.options.js.map