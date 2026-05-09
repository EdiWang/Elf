import { html } from '@microsoft/fast-element';
/**
 * The template for the Fluent label web-component.
 * @public
 */
export function labelTemplate() {
    return html `
    <slot></slot>
    <span part="asterisk" class="asterisk" aria-hidden="true" ?hidden="${x => !x.required}">*</span>
  `;
}
export const template = labelTemplate();
//# sourceMappingURL=label.template.js.map