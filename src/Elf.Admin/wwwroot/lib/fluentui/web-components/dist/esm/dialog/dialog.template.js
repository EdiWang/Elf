import { html, ref } from '@microsoft/fast-element';
/**
 * Template for the Dialog component
 * @public
 */
export const template = html `
  <dialog
    class="dialog"
    part="dialog"
    aria-describedby="${x => x.ariaDescribedby}"
    aria-labelledby="${x => x.ariaLabelledby}"
    aria-label="${x => x.ariaLabel}"
    @click="${(x, c) => x.clickHandler(c.event)}"
    @cancel="${x => x.hide()}"
    ${ref('dialog')}
  >
    <slot></slot>
  </dialog>
`;
//# sourceMappingURL=dialog.template.js.map