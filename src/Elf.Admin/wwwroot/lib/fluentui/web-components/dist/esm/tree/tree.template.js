import { html, ref } from '@microsoft/fast-element';
export const template = html `
  <template
    focusgroup="menu nowrap nomemory"
    @click="${(x, c) => x.clickHandler(c.event)}"
    @keydown="${(x, c) => x.keydownHandler(c.event)}"
    @change="${(x, c) => x.changeHandler(c.event)}"
    @toggle="${(x, c) => x.itemToggleHandler()}"
  >
    <slot ${ref('defaultSlot')} @slotchange="${x => x.handleDefaultSlotChange()}"></slot>
  </template>
`;
//# sourceMappingURL=tree.template.js.map