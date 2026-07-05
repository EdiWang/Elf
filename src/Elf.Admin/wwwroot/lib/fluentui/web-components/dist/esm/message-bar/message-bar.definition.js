import { FluentDesignSystem } from '../fluent-design-system.js';
import { tagName } from './message-bar.options.js';
import { styles } from './message-bar.styles.js';
import { template } from './message-bar.template.js';
/**
 * The definition for the `<fluent-message-bar>` element.
 *
 * @public
 */
export const definition = {
    name: tagName,
    registry: FluentDesignSystem.registry,
    styles,
    template,
};
//# sourceMappingURL=message-bar.definition.js.map