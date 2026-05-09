import { elements, html, ref, slotted } from '@microsoft/fast-element';
export function menuTemplate() {
    return html `
    <template
      ?open-on-hover="${x => x.openOnHover}"
      ?open-on-context="${x => x.openOnContext}"
      ?close-on-scroll="${x => x.closeOnScroll}"
      ?persist-on-item-click="${x => x.persistOnItemClick}"
      @keydown="${(x, c) => x.menuKeydownHandler(c.event)}"
    >
      <slot name="primary-action" ${ref('primaryAction')}></slot>
      <slot name="trigger" ${slotted({ property: 'slottedTriggers', filter: elements() })}></slot>
      <slot ${slotted({ property: 'slottedMenuList', filter: elements() })}></slot>
    </template>
  `;
}
export const template = menuTemplate();
//# sourceMappingURL=menu.template.js.map