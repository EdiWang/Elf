import { html } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
/**
 * The template for the Button component.
 * @public
 */
export function anchorTemplate(options = {}) {
    return html `
    <template
      tabindex="0"
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      ${startSlotTemplate(options)}
      <span class="content" part="content">
        <slot></slot>
      </span>
      ${endSlotTemplate(options)}
    </template>
  `;
}
/**
 * The template for the Button component.
 * @public
 */
export const template = anchorTemplate();
//# sourceMappingURL=anchor-button.template.js.map