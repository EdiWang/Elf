import { html, slotted } from '@microsoft/fast-element';
export function radioGroupTemplate() {
    return html `
    <template
      focusgroup="radiogroup wrap"
      @disabled="${(x, c) => x.disabledRadioHandler(c.event)}"
      @change="${(x, c) => x.changeHandler(c.event)}"
      @click="${(x, c) => x.clickHandler(c.event)}"
      @focusin="${(x, c) => x.focusinHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      <slot ${slotted('slottedRadios')}></slot>
    </template>
  `;
}
export const template = radioGroupTemplate();
//# sourceMappingURL=radio-group.template.js.map