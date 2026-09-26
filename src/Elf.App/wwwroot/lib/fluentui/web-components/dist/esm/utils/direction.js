//Copied from @microsoft/fast-foundation
/**
 * Expose ltr and rtl strings
 * @public
 */
export const Direction = {
    ltr: 'ltr',
    rtl: 'rtl',
};
/**
 * Determines the current localization direction of an element.
 *
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @returns the localization direction of the element
 *
 * @public
 */
export const getDirection = (rootNode) => {
    return rootNode.closest('[dir]')?.dir === 'rtl' ? Direction.rtl : Direction.ltr;
};
//# sourceMappingURL=direction.js.map