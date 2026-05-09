import { html } from '@microsoft/fast-element';
import { badgeTemplate } from '../badge/badge.template.js';
function composeTemplate(options = {}) {
    return badgeTemplate({
        defaultContent: html `${x => x.setCount()}`,
    });
}
/**
 * The template for the Counter Badge component.
 * @public
 */
export const template = composeTemplate();
//# sourceMappingURL=counter-badge.template.js.map