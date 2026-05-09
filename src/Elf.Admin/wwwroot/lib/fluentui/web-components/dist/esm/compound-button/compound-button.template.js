import { html, slotted } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
/**
 * The template for the Compound Button component.
 * @public
 */
export function buttonTemplate(options = {}) {
    return html `
    <template ?disabled="${x => x.disabled}" tabindex="${x => (x.disabled ? null : x.tabIndex ?? 0)}">
      ${startSlotTemplate(options)}
      <span class="content" part="content">
        <slot ${slotted('defaultSlottedContent')}></slot>
        <slot name="description"></slot>
      </span>
      ${endSlotTemplate(options)}
    </template>
  `;
}
/**
 * The template for the Button component.
 * @public
 */
export const template = buttonTemplate();
//# sourceMappingURL=compound-button.template.js.map