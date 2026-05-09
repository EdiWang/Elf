export const isARIADisabledElement = (el) => {
    return (el.getAttribute('aria-disabled') === 'true' ||
        el.elementInternals?.ariaDisabled === 'true');
};
export const isHiddenElement = (el) => {
    return el.hasAttribute('hidden');
};
export const isFocusableElement = (el) => {
    return !isARIADisabledElement(el) && !isHiddenElement(el);
};
//# sourceMappingURL=focusable-element.js.map