import { html, slotted } from '@microsoft/fast-element';
export function menuTemplate() {
    return html `
    <template focusgroup="menu">
      <slot ${slotted('items')}></slot>
    </template>
  `;
}
export const template = menuTemplate();
//# sourceMappingURL=menu-list.template.js.map