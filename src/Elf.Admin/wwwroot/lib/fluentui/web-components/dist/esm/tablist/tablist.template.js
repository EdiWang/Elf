import { html, slotted } from '@microsoft/fast-element';
/**
 * @public
 */
export const template = html `
  <template
    role="tablist"
    focusgroup="tablist inline block"
    @focusin="${(x, c) => x.handleFocusIn(c.event)}"
  >
    <slot name="tab" ${slotted('slottedTabs')}></slot>
  </template>
`;
//# sourceMappingURL=tablist.template.js.map