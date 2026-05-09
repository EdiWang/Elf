import { html, slotted } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
/**
 * Generates a template for the Button component.
 *
 * @public
 */
export function buttonTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keypress="${(x, c) => x.keypressHandler(c.event)}"
    >
      ${startSlotTemplate(options)}
      <span class="content" part="content">
        <slot ${slotted('defaultSlottedContent')}></slot>
      </span>
      ${endSlotTemplate(options)}
    </template>
  `;
}
/**
 * The template for the Button component.
 *
 * @public
 */
export const template = buttonTemplate();
//# sourceMappingURL=button.template.js.map