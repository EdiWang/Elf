import { html, ref } from '@microsoft/fast-element';
/**
 * Generates a template for the {@link (Dropdown:class)} component.
 *
 * @returns The template object.
 *
 * @public
 */
export function listboxTemplate() {
    return html `
    <template
      @beforetoggle="${(x, c) => x.beforetoggleHandler(c.event)}"
      @click="${(x, c) => x.clickHandler(c.event)}"
    >
      <slot ${ref('defaultSlot')} @slotchange="${(x, c) => x.slotchangeHandler(c.event)}"></slot>
    </template>
  `;
}
/**
 * Template for the Listbox component.
 *
 * @public
 */
export const template = listboxTemplate();
//# sourceMappingURL=listbox.template.js.map