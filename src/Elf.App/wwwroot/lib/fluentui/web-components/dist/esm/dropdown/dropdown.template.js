import { html, ref } from '@microsoft/fast-element';
import { staticallyCompose } from '../utils/template-helpers.js';
const dropdownIndicatorTemplate = html `
  <svg class="chevron-down-20-regular" aria-hidden="true" slot="indicator" viewBox="0 0 20 20" ${ref('indicator')}>
    <path
      d="M15.85 7.65a.5.5 0 0 1 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16a.5.5 0 0 1 .7 0"
      fill="currentColor"
    />
  </svg>
`;
/**
 * The template partial for the dropdown input element. This template is used when the `type` property is set to "combobox".
 *
 * @public
 * @remarks
 * Since the input element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export const dropdownInputTemplate = html `
  <input
    @input="${(x, c) => x.inputHandler(c.event)}"
    @change="${(x, c) => x.changeHandler(c.event)}"
    aria-activedescendant="${x => x.activeDescendant}"
    aria-controls="${x => x.listbox?.id ?? null}"
    aria-labelledby="${x => x.ariaLabelledBy}"
    aria-expanded="${x => x.open}"
    aria-haspopup="listbox"
    placeholder="${x => x.placeholder}"
    role="combobox"
    ?disabled="${x => x.disabled}"
    type="${x => x.type}"
    value="${x => x.valueAttribute}"
    slot="control"
    ${ref('control')}
  />
`;
/**
 * The template partial for the dropdown button element. This template is used when the `type` property is set to "dropdown".
 *
 * @public
 * @remarks
 * Since the button element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export const dropdownButtonTemplate = html `
  <button
    aria-activedescendant="${x => x.activeDescendant}"
    aria-controls="${x => x.listbox?.id ?? null}"
    aria-expanded="${x => x.open}"
    aria-haspopup="listbox"
    role="combobox"
    ?disabled="${x => x.disabled}"
    type="button"
    slot="control"
    ${ref('control')}
  >
    ${x => x.displayValue}
  </button>
`;
/**
 * Generates a template for the {@link (Dropdown:class)} component.
 *
 * @param options - The {@link (DropdownOptions:interface)} to use for generating the template.
 * @returns The template object.
 *
 * @public
 */
export function dropdownTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @focusout="${(x, c) => x.focusoutHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
      @mousedown="${(x, c) => x.mousedownHandler(c.event)}"
    >
      <div class="control">
        <slot name="control" ${ref('controlSlot')}></slot>
        <slot name="indicator" ${ref('indicatorSlot')}>${staticallyCompose(options.indicator)}</slot>
      </div>
      <slot @slotchange="${(x, c) => x.slotchangeHandler(c.event)}"></slot>
    </template>
  `;
}
/**
 * Template for the Dropdown component.
 *
 * @public
 */
export const template = dropdownTemplate({
    indicator: dropdownIndicatorTemplate,
});
//# sourceMappingURL=dropdown.template.js.map