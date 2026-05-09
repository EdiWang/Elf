import { html, slotted } from '@microsoft/fast-element';
export function menuTemplate() {
    return html `
    <template focusgroup="menu" slot="${x => (x.slot ? x.slot : x.isNestedMenu() ? 'submenu' : void 0)}">
      <slot ${slotted('items')}></slot>
    </template>
  `;
}
export const template = menuTemplate();
//# sourceMappingURL=menu-list.template.js.map