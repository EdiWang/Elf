import { FluentDesignSystem } from '../fluent-design-system.js';
import { tagName } from './tree.options.js';
import { styles } from './tree.styles.js';
import { template } from './tree.template.js';
/**
 * The definition for the `<fluent-tree>` element.
 *
 * @public
 */
export const definition = {
    name: tagName,
    registry: FluentDesignSystem.registry,
    styles,
    template,
};
//# sourceMappingURL=tree.definition.js.map