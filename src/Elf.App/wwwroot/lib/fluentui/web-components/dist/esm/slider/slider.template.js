import { html, ref } from '@microsoft/fast-element';
import { staticallyCompose } from '../utils/template-helpers.js';
export function sliderTemplate(options = {}) {
    return html `
    <template
      @pointerdown="${(x, c) => x.handlePointerDown(c.event)}"
      @keydown="${(x, c) => x.handleKeydown(c.event)}"
    >
      <div ${ref('track')} part="track-container" class="track" style="${x => x.position}"></div>
      <div
        ${ref('thumb')}
        part="thumb-container"
        class="thumb-container"
        style="${x => x.position}"
        @pointerdown="${(x, c) => x.handleThumbPointerDown(c.event)}"
      >
        <slot name="thumb">${staticallyCompose(options.thumb)}</slot>
      </div>
    </template>
  `;
}
export const template = sliderTemplate({
    thumb: `<div class="thumb"></div>`,
});
//# sourceMappingURL=slider.template.js.map