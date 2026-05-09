import { FASTElement } from '@microsoft/fast-element';
import { Direction } from '../utils/direction.js';
import { Orientation } from '../utils/orientation.js';
import { type SliderConfiguration, SliderMode, SliderSize } from './slider.options.js';
/**
 * The base class used for constructing a fluent-slider custom element
 *
 * @tag fluent-slider
 *
 * @slot thumb - The slot for a custom thumb element.
 * @csspart thumb-container - The container element of the thumb.
 * @csspart track-container - The container element of the track.
 * @fires change - Fires a custom 'change' event when the value changes.
 *
 * @public
 */
export declare class Slider extends FASTElement implements SliderConfiguration {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * A reference to all associated `<label>` elements.
     *
     * @public
     */
    get labels(): ReadonlyArray<Node>;
    /**
     * The size of the slider
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: SliderSize;
    handleChange(_: any, propertyName: string): void;
    private stepStyles?;
    /**
     * Handles changes to step styling based on the step value
     * NOTE: This function is not a changed callback, stepStyles is not observable
     */
    private handleStepStyles;
    /**
     * The initial value of the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the input when the value attribute changes.
     *
     * @param prev - The previous value
     * @param next - The current value
     * @internal
     */
    protected initialValueChanged(_: string, next: string): void;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The element's validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validationMessage | `ElemenentInternals.validationMessage`} property.
     */
    get validationMessage(): string;
    /**
     * Whether the element is a candidate for its owning form's constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/willValidate | `ElemenentInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * Checks the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/checkValidity | `ElemenentInternals.checkValidity`} method.
     */
    checkValidity(): boolean;
    /**
     * Reports the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/reportValidity | `ElemenentInternals.reportValidity`} method.
     */
    reportValidity(): boolean;
    /**
     * Sets a custom validity message.
     * @public
     */
    setCustomValidity(message: string): void;
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
    /**
     * The internal value of the input.
     *
     * @internal
     */
    private _value;
    /**
     * The current value of the input.
     *
     * @public
     */
    get value(): string;
    set value(value: string);
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Disabled the component when its associated form is disabled.
     *
     * @internal
     *
     * @privateRemarks
     * DO NOT change the `disabled` property or attribute here, because if the
     * `disabled` attribute is present, reenabling an ancestor `<fieldset>`
     * element will not reenabling this component.
     */
    formDisabledCallback(disabled: boolean): void;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * @internal
     */
    track: HTMLDivElement;
    /**
     * @internal
     */
    thumb: HTMLDivElement;
    /**
     * @internal
     */
    stepMultiplier: number;
    /**
     * @internal
     */
    direction: Direction;
    directionChanged(): void;
    /**
     * @internal
     */
    isDragging: boolean;
    /**
     * @internal
     */
    position: string;
    /**
     * @internal
     */
    trackWidth: number;
    /**
     * @internal
     */
    trackMinWidth: number;
    /**
     * @internal
     */
    trackHeight: number;
    /**
     * @internal
     */
    trackLeft: number;
    /**
     * @internal
     */
    trackMinHeight: number;
    /**
     * The value property, typed as a number.
     *
     * @public
     */
    get valueAsNumber(): number;
    set valueAsNumber(next: number);
    /**
     * Custom function that generates a string for the component's "ariaValueText" on element internals based on the current value.
     *
     * @public
     */
    valueTextFormatter: (value: string) => string;
    protected valueTextFormatterChanged(): void;
    /**
     * The element's disabled state.
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    protected disabledChanged(): void;
    /**
     * Returns true if the component is disabled, taking into account the `disabled`
     * attribute, `aria-disabled` attribute, and the `:disabled` pseudo-class.
     *
     * @internal
     */
    protected get isDisabled(): boolean;
    /**
     * The minimum allowed value.
     *
     * @public
     * @remarks
     * HTML Attribute: min
     */
    min: string;
    protected minChanged(): void;
    /**
     * Returns the min property or the default value
     *
     * @internal
     */
    private get minAsNumber();
    /**
     * The maximum allowed value.
     *
     * @public
     * @remarks
     * HTML Attribute: max
     */
    max: string;
    protected maxChanged(): void;
    /**
     * Returns the max property or the default value
     *
     * @internal
     */
    private get maxAsNumber();
    /**
     * Value to increment or decrement via arrow keys, mouse click or drag.
     *
     * @public
     * @remarks
     * HTML Attribute: step
     */
    step: string;
    protected stepChanged(): void;
    /**
     * Returns the step property as a number.
     *
     * @internal
     */
    private get stepAsNumber();
    /**
     * The orientation of the slider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     *
     * @privateRemarks
     * When checking the value of `this.orientation`, always compare it to
     * `Orientation.vertical`, never to `Orientation.horizontal`, it’s because
     * this property is optional, so it could be `undefined`. So any
     * orientation-related behavior should consider horizontal as default, and
     * apply different behavior when it’s vertical.
     */
    orientation?: Orientation;
    protected orientationChanged(prev: Orientation | undefined, next: Orientation | undefined): void;
    /**
     * The selection mode.
     *
     * @public
     * @remarks
     * HTML Attribute: mode
     */
    mode: SliderMode;
    constructor();
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Increment the value by the step
     *
     * @public
     */
    increment(): void;
    /**
     * Decrement the value by the step
     *
     * @public
     */
    decrement(): void;
    handleKeydown(event: KeyboardEvent): boolean;
    /**
     * Places the thumb based on the current value
     */
    private setSliderPosition;
    /**
     * Update the step multiplier used to ensure rounding errors from steps that
     * are not whole numbers
     */
    private updateStepMultiplier;
    private setupTrackConstraints;
    private get midpoint();
    private setupDefaultValue;
    /**
     *  Handle mouse moves during a thumb drag operation
     *  If the event handler is null it removes the events
     */
    handleThumbPointerDown: (event: PointerEvent | null) => boolean;
    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handlePointerMove;
    /**
     * Calculate the new value based on the given raw pixel value.
     *
     * @param rawValue - the value to be converted to a constrained value
     * @returns the constrained value
     *
     * @internal
     */
    calculateNewValue(rawValue: number): number;
    /**
     * Handle a window mouse up during a drag operation
     */
    private handleWindowPointerUp;
    private stopDragging;
    /**
     *
     * @param event - PointerEvent or null. If there is no event handler it will remove the events
     */
    handlePointerDown: (event: PointerEvent | null) => boolean;
    private convertToConstrainedValue;
    /**
     * Makes sure the side effects of set up when the disabled state changes.
     */
    private setDisabledSideEffect;
}
