import { html } from '@microsoft/fast-element';
/**
 * Generates a template for the MessageBar component.
 * @public
 * @param T - The type of the MessageBar.
 * @returns The template for the MessageBar component.
 */
export function messageBarTemplate() {
    return html `
    <slot name="icon"></slot>
    <div class="content">
      <slot></slot>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
    <slot name="dismiss"></slot>
  `;
}
/**
 * The template for the MessageBar component.
 * @type ElementViewTemplate
 */
export const template = messageBarTemplate();
//# sourceMappingURL=message-bar.template.js.map