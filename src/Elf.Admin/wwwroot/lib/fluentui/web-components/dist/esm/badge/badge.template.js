import { html } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
import { staticallyCompose } from '../utils/template-helpers.js';
/**
 * The template for the Badge component.
 * @public
 */
export function badgeTemplate(options = {}) {
    return html `
    ${startSlotTemplate(options)}
    <slot>${staticallyCompose(options.defaultContent)}</slot>
    ${endSlotTemplate(options)}
  `;
}
export const template = badgeTemplate();
//# sourceMappingURL=badge.template.js.map