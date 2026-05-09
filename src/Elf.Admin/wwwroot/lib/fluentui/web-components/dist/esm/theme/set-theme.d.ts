/**
 * Not using the `Theme` type from `@fluentui/tokens` package to allow custom
 * tokens to be added.
 * @public
 */
export type Theme = Record<string, string | number>;
/**
 * Sets the theme tokens as CSS Custom Properties. The Custom Properties are
 * set in a constructed stylesheet on `document.adoptedStyleSheets` if
 * supported, and on `document.documentElement.style` as a fallback.
 *
 * @param theme - Flat object of theme tokens. Each object entry must follow
 *     these rules: the key is the name of the token, usually in camel case, it
 *     must be a valid CSS Custom Property name WITHOUT the starting two dashes
 *     (`--`), the two dashes are added inside the function; the value must be
 *     a valid CSS value, e.g. it cannot contain semicolons (`;`).
 *     Note that this argument is not limited to existing theme objects (from
 *     `@fluentui/tokens`), you can pass in an arbitrary theme object as long
 *     as each entry’s value is either a string or a number.
 * @param node - The node to set the theme on, defaults to `document` for
 *     setting global theme.
 * @public
 */
export declare function setTheme(theme: Theme | null, node?: Document | HTMLElement): void;
/**
 * @internal
 * @deprecated Use `setTheme(theme, element)` instead.
 */
export declare function setThemeFor(element: HTMLElement, theme: Theme | null): void;
