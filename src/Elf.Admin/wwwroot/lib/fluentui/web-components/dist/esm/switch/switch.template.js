import { html } from '@microsoft/fast-element';
import { staticallyCompose } from '../utils/template-helpers.js';
export function switchTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @input="${(x, c) => x.inputHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
      @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
      <slot name="switch">${staticallyCompose(options.switch)}</slot>
    </template>
  `;
}
export const template = switchTemplate({
    switch: `<span class="checked-indicator" part="checked-indicator"></span>`,
});
//# sourceMappingURL=switch.template.js.map