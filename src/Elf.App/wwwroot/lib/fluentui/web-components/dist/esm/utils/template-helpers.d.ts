import { type CaptureType, type HTMLDirective, type SyntheticViewTemplate } from '@microsoft/fast-element';
/**
 * A value that can be statically composed into a
 * foundation template.
 * @remarks
 * When providing a string, take care to ensure that it is
 * safe and will not enable an XSS attack.
 * @public
 */
export type StaticallyComposableHTML<TSource = any, TParent = any> = string | HTMLDirective | SyntheticViewTemplate<TSource, TParent> | undefined;
/**
 * A function to compose template options.
 * @public
 */
export declare function staticallyCompose<TSource = any, TParent = any>(item: StaticallyComposableHTML<TSource, TParent>): CaptureType<TSource, TParent>;
