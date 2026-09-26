import { FluentDesignSystem } from '../fluent-design-system.js';
import { tagName } from './text-input.options.js';
import { styles } from './text-input.styles.js';
import { template } from './text-input.template.js';
/**
 * The definition for the `<fluent-text-input>` element.
 *
 * @public
 */
export const definition = {
    name: tagName,
    registry: FluentDesignSystem.registry,
    shadowOptions: {
        delegatesFocus: true,
    },
    styles,
    template,
};
//# sourceMappingURL=text-input.definition.js.map