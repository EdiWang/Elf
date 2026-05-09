import type { ValuesOf } from '../utils/typings.js';
/**
 * Expand mode for {@link Accordion}
 * @public
 */
export declare const AccordionExpandMode: {
    readonly single: "single";
    readonly multi: "multi";
};
/**
 * Type for the {@link Accordion} Expand Mode
 * @public
 */
export type AccordionExpandMode = ValuesOf<typeof AccordionExpandMode>;
/**
 * The tag name for the accordion element.
 *
 * @public
 */
export declare const tagName: "fluent-accordion";
