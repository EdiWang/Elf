/**
 * Determines the current language code of an element.
 *
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @returns the language code of the element
 *
 * @public
 */
export function getLanguage(rootNode) {
    return rootNode.closest('[lang]')?.lang ?? 'en';
}
//# sourceMappingURL=language.js.map