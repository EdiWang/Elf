import { html } from '@microsoft/fast-element';
import { staticallyCompose } from '../utils/template-helpers.js';
const checkedIndicator = html.partial(/* html */ `
    <span part="checked-indicator" class="checked-indicator" role="presentation"></span>
`);
/**
 * Generates a template for the {@link (Radio:class)} component.
 *
 * @param options - Radio configuration options
 * @public
 */
export function radioTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
      @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
      <slot name="checked-indicator">${staticallyCompose(options.checkedIndicator)}</slot>
    </template>
  `;
}
/**
 * Template for the Radio component
 *
 * @public
 */
export const template = radioTemplate({ checkedIndicator });
//# sourceMappingURL=radio.template.js.map