import { elements, html, slotted } from '@microsoft/fast-element';
/**
 * Template for the Field component
 * @public
 */
export const template = html `
  <template
    @click="${(x, c) => x.clickHandler(c.event)}"
    @change="${(x, c) => x.changeHandler(c.event)}"
    @focusin="${(x, c) => x.focusinHandler(c.event)}"
    @focusout="${(x, c) => x.focusoutHandler(c.event)}"
  >
    <slot name="label" part="label" ${slotted('labelSlot')}></slot>
    <slot name="input" part="input" ${slotted('slottedInputs')}></slot>
    <slot name="message" part="message" ${slotted({ property: 'messageSlot', filter: elements('[flag]') })}></slot>
  </template>
`;
//# sourceMappingURL=field.template.js.map