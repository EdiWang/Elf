import { FluentDesignSystem } from '../fluent-design-system.js';
import { tagName } from './tooltip.options.js';
import { styles } from './tooltip.styles.js';
import { template } from './tooltip.template.js';
/**
 * The definition for the `<fluent-tooltip>` element.
 *
 * @public
 */
export const definition = {
    name: tagName,
    registry: FluentDesignSystem.registry,
    styles,
    template,
};
//# sourceMappingURL=tooltip.definition.js.map