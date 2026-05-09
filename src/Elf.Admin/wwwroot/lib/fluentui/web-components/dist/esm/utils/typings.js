//Copied from @microsoft/fast-foundation
/**
 * Creates a type guard that checks if a node is a custom element whose tag name ends with the given suffix.
 *
 * @param tagSuffix - The tag name suffix to match (e.g., '-dropdown', '-option').
 * @returns A predicate function that narrows the node to the specified element type.
 * @public
 */
export function isCustomElement(tagSuffix) {
    return (element) => {
        if (element?.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        return element.tagName.toLowerCase().endsWith(tagSuffix);
    };
}
/**
 * A test that ensures that all arguments are HTML Elements
 */
export function isHTMLElement(...args) {
    return args.every((arg) => arg instanceof HTMLElement);
}
//# sourceMappingURL=typings.js.map