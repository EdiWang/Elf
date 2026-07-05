/**
 * Artificial sets the focus to the given element, if no other element in the
 * document is currently focused and the given element meets the following
 * conditions:
 *
 * - is connected to DOM
 * - has `autofocus` attribute
 * - is visible
 *
 * For more details of this issue, see https://codepen.io/editor/marchbox/pen/019e9ab9-cd81-7c21-a3ae-1b7fe2d3458a
 */
export declare function maybeSetAutoFocus(element: HTMLElement): void;
