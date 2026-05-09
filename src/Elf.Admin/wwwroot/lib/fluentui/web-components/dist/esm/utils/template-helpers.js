//Copied from @microsoft/fast-foundation
import { InlineTemplateDirective, } from '@microsoft/fast-element';
/**
 * A function to compose template options.
 * @public
 */
export function staticallyCompose(item) {
    if (!item) {
        return InlineTemplateDirective.empty;
    }
    if (typeof item === 'string') {
        return new InlineTemplateDirective(item);
    }
    if ('inline' in item) {
        return item.inline();
    }
    return item;
}
//# sourceMappingURL=template-helpers.js.map