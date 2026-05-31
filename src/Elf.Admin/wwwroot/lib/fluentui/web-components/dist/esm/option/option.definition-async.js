import { tagName } from './option.options.js';
/**
 * The async definition configuration for the fluent-option element.
 *
 * @public
 * @remarks
 * This is used in server-side rendering (SSR) scenarios where the template
 * is provided as a deferred option to be hydrated later.
 */
export const definition = {
    name: tagName,
    templateOptions: 'defer-and-hydrate',
};
//# sourceMappingURL=option.definition-async.js.map