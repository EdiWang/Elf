import { html, ref } from '@microsoft/fast-element';
/**
 * Template for the Dialog component
 *
 * Note: The empty `<div tabindex="-1">` element above the `<slot>` element is
 * for working around a dialog focus issue, learn more at
 * https://github.com/microsoft/fluentui/pull/36278
 *
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
    <div tabindex="-1"></div>
    <slot></slot>
  </dialog>
`;
//# sourceMappingURL=dialog.template.js.map