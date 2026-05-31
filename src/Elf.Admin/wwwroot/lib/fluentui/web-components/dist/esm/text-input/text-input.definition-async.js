import { tagName } from './text-input.options.js';
/**
 * The async definition configuration for the fluent-text-input element.
 *
 * @public
 * @remarks
 * This is used in server-side rendering (SSR) scenarios where the template
 * is provided as a deferred option to be hydrated later.
 */
export const definition = {
    name: tagName,
    templateOptions: 'defer-and-hydrate',
    shadowOptions: {
        delegatesFocus: true,
    },
};
//# sourceMappingURL=text-input.definition-async.js.map