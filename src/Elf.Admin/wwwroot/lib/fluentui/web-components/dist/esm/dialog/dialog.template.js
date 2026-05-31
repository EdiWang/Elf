import { html, ref } from '@microsoft/fast-element';
/**
 * Template for the Dialog component
 * @public
 */
export const template = html `
  <dialog
    class="dialog"
    part="dialog"
    aria-modal="${x => x.dialogModal}"
    aria-describedby="${x => x.dialogDescribedby}"
    aria-labelledby="${x => x.dialogLabelledby}"
    aria-label="${x => x.dialogLabel}"
    role="${x => x.dialogRole}"
    @click="${(x, c) => x.clickHandler(c.event)}"
    @cancel="${x => x.hide()}"
    ${ref('dialog')}
  >
    <slot></slot>
  </dialog>
`;
//# sourceMappingURL=dialog.template.js.map