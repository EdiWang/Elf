import { html } from '@microsoft/fast-element';
/**
 * Template for the dialog form
 * @public
 */
export const template = html `
  <template>
    <div class="title" part="title">
      <slot name="title"></slot>
      <slot name="title-action"></slot>
      <slot name="close" @click="${(x, c) => x.clickHandler(c.event)}"></slot>
    </div>
    <div class="content" part="content"><slot></slot></div>
    <div class="actions" part="actions"><slot name="action"></slot></div>
  </template>
`;
//# sourceMappingURL=dialog-body.template.js.map