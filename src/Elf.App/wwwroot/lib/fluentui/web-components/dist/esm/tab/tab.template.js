import { html } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
export function tabTemplate(options = {}) {
    return html `
    <template slot="tab" role="tab">
      ${startSlotTemplate(options)}
      <span class="tab-content"><slot></slot></span>
      ${endSlotTemplate(options)}
    </template>
  `;
}
export const template = tabTemplate({});
//# sourceMappingURL=tab.template.js.map