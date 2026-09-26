import { html } from '@microsoft/fast-element';
/**
 * The template for the Drawer component.
 * @public
 */
export function drawerBodyTemplate() {
    return html `
    <div class="header" part="header">
      <slot name="title"></slot>
      <slot name="close" @click="${(x, c) => x.clickHandler(c.event)}"></slot>
    </div>
    <div class="content" part="content">
      <slot></slot>
    </div>
    <div class="footer" part="footer">
      <slot name="footer"></slot>
    </div>
  `;
}
export const template = drawerBodyTemplate();
//# sourceMappingURL=drawer-body.template.js.map