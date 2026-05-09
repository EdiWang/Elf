import { html, ref } from '@microsoft/fast-element';
/**
 * The template for the Drawer component.
 * @public
 */
export function drawerTemplate() {
    return html `
    <dialog
      class="dialog"
      part="dialog"
      aria-describedby="${x => x.ariaDescribedby}"
      aria-labelledby="${x => x.ariaLabelledby}"
      aria-label="${x => x.ariaLabel}"
      size="${x => x.size}"
      position="${x => x.position}"
      @click="${(x, c) => x.clickHandler(c.event)}"
      @cancel="${x => x.cancelHandler()}"
      ${ref('dialog')}
    >
      <slot></slot>
    </dialog>
  `;
}
export const template = drawerTemplate();
//# sourceMappingURL=drawer.template.js.map