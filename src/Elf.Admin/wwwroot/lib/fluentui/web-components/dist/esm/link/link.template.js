import { html } from '@microsoft/fast-element';
/**
 * The template for the Link component.
 * @public
 */
export function anchorTemplate() {
    return html `
    <template
      tabindex="0"
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      <slot></slot>
    </template>
  `;
}
/**
 * The template for the Link component.
 * @public
 */
export const template = anchorTemplate();
//# sourceMappingURL=link.template.js.map