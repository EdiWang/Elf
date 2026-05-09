import { html, ref, slotted } from '@microsoft/fast-element';
import { endSlotTemplate, startSlotTemplate } from '../patterns/start-end.js';
/**
 * Generates a template for the TextInput component.
 *
 * @public
 */
export function textInputTemplate(options = {}) {
    return html `
    <template
      @beforeinput="${(x, c) => x.beforeinputHandler(c.event)}"
      @focusin="${(x, c) => x.focusinHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      <label part="label" for="control" class="label" ${ref('controlLabel')}>
        <slot ${slotted('defaultSlottedNodes')}></slot>
      </label>
      <div class="root" part="root">
        ${startSlotTemplate(options)}
        <input
          class="control"
          part="control"
          id="control"
          @change="${(x, c) => x.changeHandler(c.event)}"
          @input="${(x, c) => x.inputHandler(c.event)}"
          ?autofocus="${x => x.autofocus}"
          autocomplete="${x => x.autocomplete}"
          ?disabled="${x => x.disabled}"
          list="${x => x.list}"
          maxlength="${x => x.maxlength}"
          minlength="${x => x.minlength}"
          ?multiple="${x => x.multiple}"
          name="${x => x.name}"
          pattern="${x => x.pattern}"
          placeholder="${x => x.placeholder}"
          ?readonly="${x => x.readOnly}"
          ?required="${x => x.required}"
          size="${x => x.size}"
          spellcheck="${x => x.spellcheck}"
          type="${x => x.type}"
          value="${x => x.initialValue}"
          ${ref('control')}
        />
        ${endSlotTemplate(options)}
      </div>
    </template>
  `;
}
/**
 * @internal
 */
export const template = textInputTemplate();
//# sourceMappingURL=text-input.template.js.map