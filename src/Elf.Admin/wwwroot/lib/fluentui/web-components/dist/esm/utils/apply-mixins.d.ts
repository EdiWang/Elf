/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 *
 * TODO: Remove with https://github.com/microsoft/fast/pull/6797
 * This was used for Badge where start/end was not yet implemented.
 * The method itself was deprecated as it was largely intended to be "internals" for Fast Foundation.
 * Adding here to avoid breaking of the existing API.
 * @internal
 */
export declare function applyMixins(derivedCtor: any, ...baseCtors: any[]): void;
