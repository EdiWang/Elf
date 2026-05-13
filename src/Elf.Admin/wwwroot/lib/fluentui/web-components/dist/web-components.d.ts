import { CaptureType } from '@microsoft/fast-element';
import { CSSDirective } from '@microsoft/fast-element';
import { ElementStyles } from '@microsoft/fast-element';
import { ElementViewTemplate } from '@microsoft/fast-element';
import { FASTElement } from '@microsoft/fast-element';
import { FASTElementDefinition } from '@microsoft/fast-element';
import { HTMLDirective } from '@microsoft/fast-element';
import { SyntheticViewTemplate } from '@microsoft/fast-element';
import { ViewTemplate } from '@microsoft/fast-element';

/**
 * An Accordion Custom HTML Element
 * Implements {@link https://www.w3.org/TR/wai-aria-practices-1.1/#accordion | ARIA Accordion}.
 *
 * @tag fluent-accordion
 *
 * @slot - The default slot for the accordion items
 * @fires change - Fires a custom 'change' event when the active item changes
 *
 * @public
 */
export declare class Accordion extends FASTElement {
    /**
     * Controls the expand mode of the Accordion, either allowing
     * single or multiple item expansion.
     * @public
     *
     * @remarks
     * HTML attribute: expand-mode
     */
    expandmode: AccordionExpandMode;
    expandmodeChanged(prev: AccordionExpandMode | undefined, next: AccordionExpandMode): void;
    /**
     * @internal
     */
    slottedAccordionItems: HTMLElement[];
    /**
     * @internal
     */
    protected accordionItems: Element[];
    /**
     * @internal
     */
    slottedAccordionItemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void;
    /**
     * Guard flag to prevent re-entrant calls to setSingleExpandMode.
     * @internal
     */
    private _isAdjusting;
    /**
     * Watch for changes to the slotted accordion items `disabled` and `expanded` attributes
     * @internal
     */
    handleChange(source: any, propertyName: string): void;
    private activeItemIndex;
    /**
     * Find the first expanded item in the accordion
     */
    private findExpandedItem;
    /**
     * Resets event listeners and sets the `accordionItems` property
     * then rebinds event listeners to each non-disabled item
     */
    private setItems;
    /**
     * Checks if the accordion is in single expand mode
     * @returns true if the accordion is in single expand mode.
     */
    private isSingleExpandMode;
    /**
     * Controls the behavior of the accordion in single expand mode
     * @param expandedItem - The item to expand in single expand mode
     */
    private setSingleExpandMode;
    /**
     * Removes event listeners from the previous accordion items
     * @param oldValue - An array of the previous accordion items
     */
    private removeItemListeners;
    /**
     * Changes the expanded state of the accordion item
     * @param evt - Click event
     * @returns
     */
    private expandedChangedHandler;
    connectedCallback(): void;
}

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-accordion\>
 */
export declare const accordionDefinition: FASTElementDefinition<typeof Accordion>;

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
export declare type AccordionExpandMode = ValuesOf<typeof AccordionExpandMode>;

/**
 * An Accordion Item Custom HTML Element.
 * Based on BaseAccordionItem and includes style and layout specific attributes
 *
 * @public
 */
export declare class AccordionItem extends BaseAccordionItem {
    /**
     * Defines accordion header font size.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: AccordionItemSize;
    /**
     * Sets expand and collapsed icon position.
     *
     * @public
     * @remarks
     * HTML Attribute: marker-position
     */
    markerPosition?: AccordionItemMarkerPosition;
    /**
     * Sets the width of the focus state.
     *
     * @public
     * @remarks
     * HTML Attribute: block
     */
    block: boolean;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export declare interface AccordionItem extends StartEnd {
}

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-accordion-item\>
 */
export declare const accordionItemDefinition: FASTElementDefinition<typeof AccordionItem>;

/**
 * An Accordion Item expand/collapse icon can appear at the start or end of the accordion
 */
export declare const AccordionItemMarkerPosition: {
    readonly start: "start";
    readonly end: "end";
};

/**
 * Applies expand/collapse icon position
 * @public
 */
export declare type AccordionItemMarkerPosition = ValuesOf<typeof AccordionItemMarkerPosition>;

/**
 * Accordion Item configuration options
 *
 * @tag fluent-accordion-item
 *
 * @public
 */
export declare type AccordionItemOptions = StartEndOptions<AccordionItem> & {
    expandedIcon?: StaticallyComposableHTML<AccordionItem>;
    collapsedIcon?: StaticallyComposableHTML<AccordionItem>;
};

/**
 * An Accordion Item header font size can be small, medium, large, and extra-large
 */
export declare const AccordionItemSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
};

/**
 * Applies font size to accordion header
 * @public
 */
export declare type AccordionItemSize = ValuesOf<typeof AccordionItemSize>;

export declare const accordionItemStyles: ElementStyles;

/**
 * The template for the fluent-accordion component.
 * @public
 */
export declare const accordionItemTemplate: ElementViewTemplate<AccordionItem>;

export declare const accordionStyles: ElementStyles;

export declare const accordionTemplate: ElementViewTemplate<Accordion>;

/**
 * An Anchor Custom HTML Element.
 * Based on BaseAnchor and includes style and layout specific attributes
 *
 * @public
 */
export declare class AnchorButton extends BaseAnchor {
    /**
     * The appearance the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: AnchorButtonAppearance | undefined;
    /**
     * Handles changes to appearance attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    appearanceChanged(prev: AnchorButtonAppearance | undefined, next: AnchorButtonAppearance | undefined): void;
    /**
     * The shape the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: AnchorButtonShape | undefined;
    /**
     * Handles changes to shape attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    shapeChanged(prev: AnchorButtonShape | undefined, next: AnchorButtonShape | undefined): void;
    /**
     * The size the anchor button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: AnchorButtonSize;
    /**
     * Handles changes to size attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    sizeChanged(prev: AnchorButtonSize | undefined, next: AnchorButtonSize | undefined): void;
    /**
     * The anchor button has an icon only, no text content
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-only`
     */
    iconOnly: boolean;
    /**
     * Handles changes to icon only custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    iconOnlyChanged(prev: boolean, next: boolean): void;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export declare interface AnchorButton extends StartEnd {
}

/**
 * Anchor Button Appearance constants
 * @public
 */
export declare const AnchorButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * An Anchor Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export declare type AnchorButtonAppearance = ValuesOf<typeof AnchorButtonAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-anchor-button\>
 */
export declare const AnchorButtonDefinition: FASTElementDefinition<typeof AnchorButton>;

/**
 * An Anchor Button can be square, circular or rounded.
 * @public
 */
export declare const AnchorButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * An Anchor Button can be square, circular or rounded
 * @public
 */
export declare type AnchorButtonShape = ValuesOf<typeof AnchorButtonShape>;

/**
 * An Anchor Button can be a size of small, medium or large.
 * @public
 */
export declare const AnchorButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * An Anchor Button can be on of several preset sizes.
 * @public
 */
export declare type AnchorButtonSize = ValuesOf<typeof AnchorButtonSize>;

/**
 * The template for the Button component.
 * @public
 */
export declare const AnchorButtonTemplate: ElementViewTemplate<AnchorButton>;

/**
 * Anchor target values.
 *
 * @public
 */
export declare const AnchorTarget: {
    readonly _self: "_self";
    readonly _blank: "_blank";
    readonly _parent: "_parent";
    readonly _top: "_top";
};

/**
 * Type for anchor target values.
 *
 * @public
 */
export declare type AnchorTarget = ValuesOf<typeof AnchorTarget>;

/**
 * An Avatar Custom HTML Element.
 * Based on BaseAvatar and includes style and layout specific attributes
 *
 * @tag fluent-avatar
 *
 * @public
 */
export declare class Avatar extends BaseAvatar {
    /**
     * Optional activity indicator
     * * active: the avatar will be decorated according to activeAppearance
     * * inactive: the avatar will be reduced in size and partially transparent
     * * undefined: normal display
     *
     * @public
     * @remarks
     * HTML Attribute: active
     */
    active?: AvatarActive | undefined;
    /**
     * The avatar can have a circular or square shape.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape?: AvatarShape | undefined;
    /**
     * The appearance when `active="active"`
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance?: AvatarAppearance | undefined;
    /**
     * Size of the avatar in pixels.
     *
     * Size is restricted to a limited set of supported values recommended for most uses (see `AvatarSizeValue`) and
     * based on design guidelines for the Avatar control.
     *
     * If a non-supported size is neeeded, set `size` to the next-smaller supported size, and set `width` and `height`
     * to override the rendered size.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     *
     */
    size?: AvatarSize | undefined;
    /**
     * The color when displaying either an icon or initials.
     * * neutral (default): gray
     * * brand: color from the brand palette
     * * colorful: picks a color from a set of pre-defined colors, based on a hash of the name (or colorId if provided)
     * * [AvatarNamedColor]: a specific color from the theme
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color?: AvatarColor | undefined;
    /**
     * Specify a string to be used instead of the name, to determine which color to use when color="colorful".
     * Use this when a name is not available, but there is another unique identifier that can be used instead.
     */
    colorId?: AvatarNamedColor | undefined;
    /**
     * Holds the current color state
     */
    private currentColor;
    /**
     * Handles changes to observable properties
     * @internal
     * @param source - the source of the change
     * @param propertyName - the property name being changed
     */
    handleChange(source: any, propertyName: string): void;
    /**
     * Generates and sets the initials for the template
     * @internal
     */
    generateInitials(): string | void;
    /**
     * Sets the data-color attribute used for the visual presentation
     * @internal
     */
    generateColor(): void;
    /**
     * An array of the available Avatar named colors
     */
    static colors: ("anchor" | "dark-red" | "cranberry" | "red" | "pumpkin" | "peach" | "marigold" | "gold" | "brass" | "brown" | "forest" | "seafoam" | "dark-green" | "light-teal" | "teal" | "steel" | "blue" | "royal-blue" | "cornflower" | "navy" | "lavender" | "purple" | "grape" | "lilac" | "pink" | "magenta" | "plum" | "beige" | "mink" | "platinum")[];
    connectedCallback(): void;
    disconnectedCallback(): void;
}

/**
 * The Avatar "active" state
 */
export declare const AvatarActive: {
    readonly active: "active";
    readonly inactive: "inactive";
};

/**
 * The types of Avatar active state
 */
export declare type AvatarActive = ValuesOf<typeof AvatarActive>;

/**
 * The Avatar Appearance when "active"
 */
export declare const AvatarAppearance: {
    readonly ring: "ring";
    readonly shadow: "shadow";
    readonly ringShadow: "ring-shadow";
};

/**
 * The appearance when "active"
 */
export declare type AvatarAppearance = ValuesOf<typeof AvatarAppearance>;

/**
 * Supported Avatar colors
 */
export declare const AvatarColor: {
    readonly darkRed: "dark-red";
    readonly cranberry: "cranberry";
    readonly red: "red";
    readonly pumpkin: "pumpkin";
    readonly peach: "peach";
    readonly marigold: "marigold";
    readonly gold: "gold";
    readonly brass: "brass";
    readonly brown: "brown";
    readonly forest: "forest";
    readonly seafoam: "seafoam";
    readonly darkGreen: "dark-green";
    readonly lightTeal: "light-teal";
    readonly teal: "teal";
    readonly steel: "steel";
    readonly blue: "blue";
    readonly royalBlue: "royal-blue";
    readonly cornflower: "cornflower";
    readonly navy: "navy";
    readonly lavender: "lavender";
    readonly purple: "purple";
    readonly grape: "grape";
    readonly lilac: "lilac";
    readonly pink: "pink";
    readonly magenta: "magenta";
    readonly plum: "plum";
    readonly beige: "beige";
    readonly mink: "mink";
    readonly platinum: "platinum";
    readonly anchor: "anchor";
    readonly neutral: "neutral";
    readonly brand: "brand";
    readonly colorful: "colorful";
};

/**
 * The Avatar Color
 */
export declare type AvatarColor = ValuesOf<typeof AvatarColor>;

/**
 * The Fluent Avatar Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-badge\>
 */
export declare const AvatarDefinition: FASTElementDefinition<typeof Avatar>;

/**
 * A specific named color for the Avatar
 */
export declare const AvatarNamedColor: {
    readonly darkRed: "dark-red";
    readonly cranberry: "cranberry";
    readonly red: "red";
    readonly pumpkin: "pumpkin";
    readonly peach: "peach";
    readonly marigold: "marigold";
    readonly gold: "gold";
    readonly brass: "brass";
    readonly brown: "brown";
    readonly forest: "forest";
    readonly seafoam: "seafoam";
    readonly darkGreen: "dark-green";
    readonly lightTeal: "light-teal";
    readonly teal: "teal";
    readonly steel: "steel";
    readonly blue: "blue";
    readonly royalBlue: "royal-blue";
    readonly cornflower: "cornflower";
    readonly navy: "navy";
    readonly lavender: "lavender";
    readonly purple: "purple";
    readonly grape: "grape";
    readonly lilac: "lilac";
    readonly pink: "pink";
    readonly magenta: "magenta";
    readonly plum: "plum";
    readonly beige: "beige";
    readonly mink: "mink";
    readonly platinum: "platinum";
    readonly anchor: "anchor";
};

/**
 * An avatar can be one of named colors
 * @public
 */
export declare type AvatarNamedColor = ValuesOf<typeof AvatarNamedColor>;

/**
 * The Avatar Shape
 */
export declare const AvatarShape: {
    readonly circular: "circular";
    readonly square: "square";
};

/**
 * The types of Avatar Shape
 */
export declare type AvatarShape = ValuesOf<typeof AvatarShape>;

/**
 * The Avatar Sizes
 * @public
 */
export declare const AvatarSize: {
    readonly _16: 16;
    readonly _20: 20;
    readonly _24: 24;
    readonly _28: 28;
    readonly _32: 32;
    readonly _36: 36;
    readonly _40: 40;
    readonly _48: 48;
    readonly _56: 56;
    readonly _64: 64;
    readonly _72: 72;
    readonly _96: 96;
    readonly _120: 120;
    readonly _128: 128;
};

/**
 * A Avatar can be on of several preset sizes.
 * @public
 */
export declare type AvatarSize = ValuesOf<typeof AvatarSize>;

/** Avatar styles
 * @public
 */
export declare const AvatarStyles: ElementStyles;

export declare const AvatarTemplate: ElementViewTemplate<Avatar>;

/**
 * The base class used for constructing a fluent-badge custom element
 * @public
 */
export declare class Badge extends FASTElement {
    /**
     * The appearance the badge should have.
     *
     * @tag fluent-badge
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance: BadgeAppearance;
    /**
     * The color the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color: BadgeColor;
    /**
     * The shape the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape?: BadgeShape;
    /**
     * The size the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: BadgeSize;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API extractor.
 * TODO: Below will be unnecessary when Badge class gets updated
 * @internal
 */
export declare interface Badge extends StartEnd {
}

/**
 * BadgeAppearance constants
 * @public
 */
export declare const BadgeAppearance: {
    readonly filled: "filled";
    readonly ghost: "ghost";
    readonly outline: "outline";
    readonly tint: "tint";
};

/**
 * A Badge can be filled, outline, ghost, inverted
 * @public
 */
export declare type BadgeAppearance = ValuesOf<typeof BadgeAppearance>;

/**
 * BadgeColor constants
 * @public
 */
export declare const BadgeColor: {
    readonly brand: "brand";
    readonly danger: "danger";
    readonly important: "important";
    readonly informative: "informative";
    readonly severe: "severe";
    readonly subtle: "subtle";
    readonly success: "success";
    readonly warning: "warning";
};

/**
 * A Badge can be one of preset colors
 * @public
 */
export declare type BadgeColor = ValuesOf<typeof BadgeColor>;

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-badge\>
 */
export declare const BadgeDefinition: FASTElementDefinition<typeof Badge>;

/**
 * A Badge can be square, circular or rounded.
 * @public
 */
export declare const BadgeShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * A Badge can be one of preset colors
 * @public
 */
export declare type BadgeShape = ValuesOf<typeof BadgeShape>;

/**
 * A Badge can be square, circular or rounded.
 * @public
 */
export declare const BadgeSize: {
    readonly tiny: "tiny";
    readonly extraSmall: "extra-small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
};

/**
 * A Badge can be on of several preset sizes.
 * @public
 */
export declare type BadgeSize = ValuesOf<typeof BadgeSize>;

/** Badge styles
 * @public
 */
export declare const BadgeStyles: ElementStyles;

export declare const BadgeTemplate: ElementViewTemplate<Badge>;

/**
 *
 * @slot start - Content positioned before heading in the collapsed state
 * @slot heading - Content which serves as the accordion item heading and text of the expand button
 * @slot - The default slot for accordion item content
 * @slot marker-expanded - The expanded icon
 * @slot marker-collapsed - The collapsed icon
 * @csspart heading - Wraps the button
 * @csspart button - The button which serves to invoke the item
 * @csspart content - The wrapper for the accordion item content
 *
 * @public
 */
export declare class BaseAccordionItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
     * heading element.
     *
     * @public
     * @remarks
     * HTML attribute: heading-level
     */
    headinglevel: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Expands or collapses the item.
     *
     * @public
     * @remarks
     * HTML attribute: expanded
     */
    expanded: boolean;
    /**
     * Disables an accordion item
     *
     * @public
     * @remarks
     * HTML attribute: disabled
     */
    disabled: boolean;
    /**
     * @internal
     */
    expandbutton: HTMLElement;
}

/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @slot start - Content which can be provided before the anchor content
 * @slot end - Content which can be provided after the anchor content
 * @slot - The default slot for anchor content
 * @csspart control - The anchor element
 * @csspart content - The element wrapping anchor content
 *
 * @public
 */
export declare class BaseAnchor extends FASTElement {
    /**
     * Holds a reference to the platform to manage ctrl+click on Windows and cmd+click on Mac
     * @internal
     */
    private readonly isMac;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The proxy anchor element
     * @internal
     */
    private internalProxyAnchor;
    /**
     * Prompts the user to save the linked URL.
     *
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#download | `download`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `download`
     */
    download?: string;
    /**
     * The URL the hyperlink references.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#href | `href`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `href`
     */
    href?: string;
    /**
     * Hints at the language of the referenced resource.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#hreflang | `hreflang`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `hreflang`
     */
    hreflang?: string;
    /**
     * The ping attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#ping | `ping`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `ping`
     */
    ping?: string;
    /**
     * The referrerpolicy attribute.
     * See The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#referrerpolicy | `referrerpolicy`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `referrerpolicy`
     */
    referrerpolicy?: string;
    /**
     * The rel attribute.
     * See The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#rel | `rel`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `rel`
     */
    rel: string;
    /**
     * The target attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#target | `target`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `target`
     */
    target?: AnchorTarget;
    /**
     * The type attribute.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/a#type | `type`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type?: string;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Handles changes to observable properties
     * @internal
     * @param source - the source of the change
     * @param propertyName - the property name being changed
     */
    handleChange(source: any, propertyName: string): void;
    /**
     * Handles the anchor click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e: PointerEvent): boolean;
    /**
     * Handles keydown events for the anchor.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Handles navigation based on input
     * If a modified activation requests a new tab, opens the href in a new window.
     * @internal
     */
    private handleNavigation;
    /**
     * A method for updating proxy attributes when attributes have changed
     * @internal
     * @param attribute - an attribute to set/remove
     * @param value - the value of the attribute
     */
    private handleProxyAttributeChange;
    private createProxyElement;
}

/**
 * The base class used for constructing a fluent-avatar custom element
 * @public
 */
export declare class BaseAvatar extends FASTElement {
    /**
     * Reference to the default slot element.
     *
     * @internal
     */
    defaultSlot: HTMLSlotElement;
    /**
     * Handles changes to the default slot element reference.
     *
     * Toggles the `has-slotted` class on the slot element for browsers that do not
     * support the `:has-slotted` CSS selector. Defers cleanup using
     * `Updates.enqueue` to avoid DOM mutations during hydration that could
     * corrupt binding markers.
     *
     * @internal
     */
    defaultSlotChanged(): void;
    /**
     * Reference to the monogram element that displays generated initials.
     *
     * @internal
     */
    monogram: HTMLElement;
    /**
     * Updates the monogram text content when the ref is captured.
     *
     * @internal
     */
    protected monogramChanged(): void;
    /**
     * The slotted content nodes assigned to the default slot.
     *
     * @internal
     */
    slottedDefaults: Node[];
    /**
     * Handles changes to the slotted default content.
     *
     * Normalizes the DOM, toggles the `has-slotted` class on the default slot element
     * for browsers that do not support the `:has-slotted` CSS selector, and removes
     * empty text nodes from the default slot to keep the DOM clean.
     *
     * @internal
     */
    protected slottedDefaultsChanged(): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The name of the person or entity represented by this Avatar. This should always be provided if it is available.
     *
     * @public
     * @remarks
     * HTML Attribute: name
     */
    name?: string | undefined;
    /**
     * Handles changes to the name attribute.
     * @internal
     */
    protected nameChanged(): void;
    /**
     * Provide custom initials rather than one generated via the name
     *
     * @public
     * @remarks
     * HTML Attribute: initials
     */
    initials?: string | undefined;
    /**
     * Handles changes to the initials attribute.
     * @internal
     */
    protected initialsChanged(): void;
    constructor();
    /**
     * Generates and sets the initials for the template.
     * Subclasses should override this to provide custom initials logic.
     *
     * @internal
     */
    generateInitials(): string | void;
    /**
     * Updates the monogram element's text content with the generated initials.
     *
     * @internal
     */
    protected updateMonogram(): void;
    /**
     * Normalizes the DOM and removes empty text nodes from the default slot.
     *
     * @internal
     */
    protected cleanupSlottedContent(): void;
}

/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | `<button>`} element.
 *
 * @slot start - Content which can be provided before the button content
 * @slot end - Content which can be provided after the button content
 * @slot - The default slot for button content
 * @csspart content - The button content container
 *
 * @public
 */
export declare class BaseButton extends FASTElement {
    /**
     * Indicates the button should be focused when the page is loaded.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#autofocus | `autofocus`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autofocus`
     */
    autofocus: boolean;
    /**
     * Default slotted content.
     *
     * @public
     */
    defaultSlottedContent: HTMLElement[];
    /**
     * Sets the element's disabled state.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled | `disabled`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    /**
     * Handles changes to the disabled attribute. If the button is disabled, it
     * should not be focusable.
     *
     * @param previous - the previous disabled value
     * @param next - the new disabled value
     * @internal
     */
    disabledChanged(): void;
    /**
     * Indicates that the button is focusable while disabled.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled-focusable`
     */
    disabledFocusable: boolean;
    /**
     * Sets the element's internal disabled state when the element is focusable while disabled.
     *
     * @param previous - the previous disabledFocusable value
     * @param next - the current disabledFocusable value
     * @internal
     */
    disabledFocusableChanged(previous: boolean, next: boolean): void;
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The associated form element.
     *
     * @public
     */
    get form(): HTMLFormElement | null;
    /**
     * The URL that processes the form submission.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#formaction | `formaction`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `formaction`
     */
    formAction?: string;
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static readonly formAssociated = true;
    /**
     * The id of a form to associate the element to.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#form | `form`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    formAttribute?: string;
    /**
     * The encoding type for the form submission.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#formenctype | `formenctype`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `formenctype`
     */
    formEnctype?: string;
    /**
     * The HTTP method that the browser uses to submit the form.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#formmethod | `formmethod`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `formmethod`
     */
    formMethod?: string;
    /**
     * Indicates that the form will not be validated when submitted.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#formnovalidate | `formnovalidate`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `formnovalidate`
     */
    formNoValidate?: boolean;
    /**
     * The internal form submission fallback control.
     *
     * @internal
     */
    private formSubmissionFallbackControl?;
    /**
     * The internal slot for the form submission fallback control.
     *
     * @internal
     */
    private formSubmissionFallbackControlSlot?;
    /**
     * The target frame or window to open the form submission in.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#formtarget | `formtarget`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `formtarget`
     */
    formTarget?: ButtonFormTarget;
    /**
     * A reference to all associated label elements.
     *
     * @public
     */
    get labels(): ReadonlyArray<Node>;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#name | `name`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name?: string;
    /**
     * The button type.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#type | `type`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type: ButtonType;
    /**
     * Removes the form submission fallback control when the type changes.
     *
     * @param previous - the previous type value
     * @param next - the new type value
     * @internal
     */
    typeChanged(previous: ButtonType, next: ButtonType): void;
    /**
     * The value attribute.
     *
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#value | `value`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    value?: string;
    /**
     * Handles the button click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e: Event): boolean | void;
    connectedCallback(): void;
    constructor();
    /**
     * This fallback creates a new slot, then creates a submit button to mirror the custom element's
     * properties. The submit button is then appended to the slot and the form is submitted.
     *
     * @internal
     * @privateRemarks
     * This is a workaround until {@link https://github.com/WICG/webcomponents/issues/814 | WICG/webcomponents/issues/814} is resolved.
     */
    private createAndInsertFormSubmissionFallbackControl;
    /**
     * Invoked when a connected component's form or fieldset has its disabled state changed.
     *
     * @param disabled - the disabled value of the form / fieldset
     *
     * @internal
     */
    formDisabledCallback(disabled: boolean): void;
    /**
     * Handles keypress events for the button.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keypressHandler(e: KeyboardEvent): boolean | void;
    /**
     * Presses the button.
     *
     * @public
     */
    protected press(): void;
    /**
     * Resets the associated form.
     *
     * @public
     */
    resetForm(): void;
    /**
     * Sets the `tabindex` attribute based on the disabled state of the button.
     *
     * @internal
     */
    protected setTabIndex(): void;
    /**
     * Submits the associated form.
     *
     * @internal
     */
    private submitForm;
}

/**
 * The base class for a component with a toggleable checked state.
 *
 * @public
 */
export declare class BaseCheckbox extends FASTElement {
    /**
     * Indicates that the element should get focus after the page finishes loading.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#autofocus | `autofocus`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autofocus`
     */
    autofocus: boolean;
    /**
     * The element's current checked state.
     *
     * @public
     */
    get checked(): boolean;
    set checked(next: boolean);
    /**
     * The disabled state of the control.
     *
     * @public
     */
    disabled?: boolean;
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    protected disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial disabled state of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabledAttribute?: boolean;
    /**
     * Sets the disabled state when the `disabled` attribute changes.
     *
     * @param prev - the previous value
     * @param next - the current value
     * @internal
     */
    protected disabledAttributeChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The id of a form to associate the element to.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#form | `form`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    formAttribute?: string;
    /**
     * The initial checked state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `checked`
     */
    initialChecked?: boolean;
    /**
     * Updates the checked state when the `checked` attribute is changed, unless the checked state has been changed by the user.
     *
     * @param prev - The previous initial checked state
     * @param next - The current initial checked state
     * @internal
     */
    protected initialCheckedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial value of the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the input when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    protected initialValueChanged(prev: string, next: string): void;
    /**
     * Tracks whether the space key was pressed down while the checkbox was focused.
     * This is used to prevent inadvertently checking a required, unchecked checkbox when the space key is pressed on a
     * submit button and field validation is triggered.
     *
     * @internal
     */
    private _keydownPressed;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * The element's required state.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * Sets the validity of the control when the required state changes.
     *
     * @param prev - The previous required state
     * @param next - The current required state
     * @internal
     */
    protected requiredChanged(prev: boolean, next: boolean): void;
    /**
     * The internal checked state of the control.
     *
     * @internal
     */
    private _checked?;
    /**
     * Indicates that the checked state has been changed by the user.
     *
     * @internal
     */
    private dirtyChecked;
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
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
    get labels(): ReadonlyArray<HTMLLabelElement>;
    /**
     * The fallback validation message, taken from a native checkbox `<input>` element.
     *
     * @internal
     */
    private _validationFallbackMessage;
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage(): string;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
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
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Toggles the checked state when the user clicks the element.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    connectedCallback(): void;
    /**
     * Updates the form value when a user changes the `checked` state.
     *
     * @param e - the event object
     * @internal
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Prevents scrolling when the user presses the space key, and sets a flag to indicate that the space key was pressed
     * down while the checkbox was focused.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Toggles the checked state when the user releases the space key.
     *
     * @param e - the event object
     * @internal
     */
    keyupHandler(e: KeyboardEvent): boolean | void;
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Sets the ARIA checked state.
     *
     * @param value - The checked state
     * @internal
     */
    protected setAriaChecked(value?: boolean): void;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Sets a custom validity message.
     *
     * @param message - The message to set
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
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force?: boolean): void;
}

/**
 * A Divider Custom HTML Element.
 * A divider groups sections of content to create visual rhythm and hierarchy. Use dividers along with spacing and headers to organize content in your layout.
 *
 * @public
 */
export declare class BaseDivider extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: DividerRole;
    /**
     * The orientation of the divider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation?: DividerOrientation;
    connectedCallback(): void;
    /**
     * Sets the element's internal role when the role attribute changes.
     *
     * @param previous - the previous role value
     * @param next - the current role value
     * @internal
     */
    roleChanged(previous: string | null, next: string | null): void;
    /**
     * Sets the element's internal orientation when the orientation attribute changes.
     *
     * @param previous - the previous orientation value
     * @param next - the current orientation value
     * @internal
     */
    orientationChanged(previous: DividerRole | undefined, next: DividerRole | undefined): void;
}

/**
 * A Dropdown Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#combobox | ARIA combobox } role.
 *
 * @remarks
 * The Dropdown element does not provide a form association value. Instead, the slotted Option elements handle form
 * association the same way as {@link (Checkbox:class)} elements. See the {@link (DropdownOption:class)} element for
 * more details.
 *
 * @slot - The default slot. Accepts a {@link (Listbox:class)} element.
 * @slot indicator - The indicator slot.
 * @slot control - The control slot. This slot is automatically populated and should not be manually manipulated.
 *
 * @public
 */
export declare class BaseDropdown extends FASTElement {
    /**
     * Static property for the anchor positioning fallback observer. The observer is used to flip the listbox when it is
     * out of view.
     * @remarks This is only used when the browser does not support CSS anchor positioning.
     * @internal
     */
    private static AnchorPositionFallbackObserver;
    /**
     * The ID of the current active descendant.
     *
     * @public
     */
    get activeDescendant(): string | undefined;
    /**
     * The index of the currently active option.
     *
     * @internal
     */
    activeIndex: number;
    /**
     * Sets the active index when the active index property changes.
     *
     * @param prev - the previous active index
     * @param next - the current active index
     * @internal
     */
    activeIndexChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The `aria-labelledby` attribute value of the dropdown.
     *
     * @public
     */
    ariaLabelledBy: string;
    /**
     * Reference to the control element.
     * @internal
     */
    control: HTMLInputElement;
    /**
     * Updates properties on the control element when the control slot changes.
     *
     * @param prev - the previous control element
     * @param next - the current control element
     * @internal
     * @remarks
     * The control element is assigned to the dropdown via the control slot with manual slot assignment.
     */
    controlChanged(prev: HTMLInputElement | undefined, next: HTMLInputElement | undefined): void;
    /**
     * The disabled state of the dropdown.
     * @public
     */
    disabled?: boolean;
    /**
     * Updates the disabled state of the options when the disabled property changes.
     *
     * @param prev - the previous disabled state
     * @param next - the current disabled state
     */
    disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The display value for the control.
     *
     * @public
     */
    get displayValue(): string;
    /**
     * Sets the listbox ID to a unique value if one is not provided.
     *
     * @override
     * @public
     * @remarks
     * HTML Attribute: `id`
     */
    id: string;
    /**
     * Reference to the indicator button element.
     *
     * @internal
     */
    indicator: HTMLDivElement;
    /**
     * Reference to the indicator slot element.
     *
     * @internal
     */
    indicatorSlot?: HTMLSlotElement;
    /**
     * The value of the selected option.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue?: string;
    /**
     * Reference to the slotted listbox element.
     *
     * @internal
     */
    listbox: Listbox;
    /**
     * Updates properties on the listbox element when the listbox reference changes.
     *
     * @param prev - the previous listbox element
     * @param next - the current listbox element
     * @internal
     *
     * @remarks
     * The listbox element is assigned to the dropdown via the default slot with manual slot assignment.
     */
    listboxChanged(prev: Listbox | undefined, next: Listbox | undefined): void;
    /**
     * Indicates whether the dropdown allows multiple options to be selected.
     *
     * @public
     * @remarks
     * HTML Attribute: `multiple`
     */
    multiple?: boolean;
    /**
     * Toggles between single and multiple selection modes when the `multiple` property changes.
     *
     * @param prev - the previous multiple state
     * @param next - the next multiple state
     * @internal
     */
    protected multipleChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The name of the dropdown.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Updates the name of the options when the name property changes.
     *
     * @param prev - the previous name
     * @param next - the current name
     */
    nameChanged(prev: string, next: string): void;
    /**
     * Indicates whether the dropdown is open.
     *
     * @public
     * @remarks
     * HTML Attribute: `open`
     */
    open: boolean;
    /**
     * Handles the open state of the dropdown.
     *
     * @param prev - the previous open state
     * @param next - the current open state
     *
     * @internal
     */
    openChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The placeholder text of the dropdown.
     *
     * @public
     */
    placeholder: string;
    /**
     * The required state of the dropdown.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * The dropdown type.
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type: DropdownType;
    /**
     * Changes the slotted control element based on the dropdown type.
     *
     * @param prev - the previous dropdown type
     * @param next - the current dropdown type
     * @internal
     */
    typeChanged(prev: DropdownType | undefined, next: DropdownType | undefined): void;
    /**
     * The initial value of the control. When the control is a combobox, this value is used to set the value of the
     * control when the dropdown is initialized.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    valueAttribute: string;
    /**
     * The slot element for the control.
     * @internal
     */
    controlSlot: HTMLSlotElement;
    /**
     * An abort controller to remove scroll and resize event listeners when the dropdown is closed or disconnected. Used
     * when the browser does not support CSS anchor positioning.
     *
     * @internal
     */
    private debounceController?;
    /**
     * Repositions the listbox to align with the control element. Used when the browser does not support CSS anchor
     * positioning.
     *
     * @internal
     */
    private repositionListbox;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The collection of enabled options.
     * @public
     */
    get enabledOptions(): DropdownOption[];
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * The ID of the frame used for repositioning the listbox when the browser does not support CSS anchor positioning.
     *
     * @internal
     */
    private frameId?;
    /**
     * A reference to the first freeform option, if present.
     *
     * @internal
     */
    private get freeformOption();
    /**
     * Indicates whether the dropdown is a combobox.
     *
     * @internal
     */
    private get isCombobox();
    /**
     * A reference to all associated label elements.
     *
     * @public
     */
    get labels(): ReadonlyArray<Node>;
    /**
     * The list formatter for the dropdown. Used to format the display value when the dropdown is in multiple selection mode.
     *
     * @internal
     */
    private listFormatter?;
    /**
     * The list collator for the dropdown. Used to filter options based on the input value.
     *
     * @internal
     */
    private listCollator?;
    /**
     * The collection of all child options.
     *
     * @public
     */
    get options(): DropdownOption[];
    /**
     * The index of the first selected option, scoped to the enabled options.
     *
     * @internal
     * @remarks
     * This property is a reflection of {@link Listbox.selectedIndex}.
     */
    get selectedIndex(): number;
    /**
     * The collection of selected options.
     *
     * @public
     * @remarks
     * This property is a reflection of {@link Listbox.selectedOptions}.
     */
    get selectedOptions(): DropdownOption[];
    /**
     * The fallback validation message, taken from a native `<input>` element.
     *
     * @internal
     */
    private _validationFallbackMessage;
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @internal
     */
    get validationMessage(): string;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The current value of the selected option.
     *
     * @public
     */
    get value(): string | null;
    set value(next: string | null);
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * Handles the change events for the dropdown.
     *
     * @param e - the event object
     *
     * @public
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Handles the click events for the dropdown.
     *
     * @param e - the event object
     *
     * @public
     */
    clickHandler(e: PointerEvent): boolean | void;
    constructor();
    /**
     * Filters the options based on the input value.
     *
     * @param value - the input value to filter the options by
     * @param collection - the collection of options to filter
     * @returns the filtered options
     * @internal
     */
    filterOptions(value: string, collection?: DropdownOption[]): DropdownOption[];
    /**
     * Focuses the control when the dropdown receives focus.
     *
     * @internal
     */
    focus(options?: FocusOptions): void;
    /**
     * Toggles the listbox when the control element loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e: FocusEvent): boolean | void;
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Ensures the active index is within bounds of the enabled options. Out-of-bounds indices are wrapped to the opposite
     * end of the range.
     *
     * @param index - the desired index
     * @param upperBound - the upper bound of the range
     * @returns the index in bounds
     * @internal
     */
    private getEnabledIndexInBounds;
    /**
     * Handles the input events for the dropdown from the control element.
     *
     * @param e - the input event
     * @public
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Guard flag to prevent reentrant calls to `insertControl`.
     * @internal
     */
    private _insertingControl;
    /**
     * Inserts the control element based on the dropdown type.
     *
     * @public
     * @remarks
     * This method can be overridden in derived classes to provide custom control elements, though this is not recommended.
     */
    protected insertControl(): void;
    /**
     * Handles the keydown events for the dropdown.
     *
     * @param e - the keyboard event
     * @public
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Prevents the default behavior of the mousedown event. This is necessary to prevent the input from losing focus
     * when the dropdown is open.
     *
     * @param e - the mouse event
     *
     * @internal
     */
    mousedownHandler(e: MouseEvent): boolean | void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Selects an option by index.
     *
     * @param index - The index of the option to select.
     * @public
     */
    selectOption(index?: number, shouldEmit?: boolean): void;
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
    /**
     * Handles the `slotchange` event for the dropdown.
     * Sets the `listbox` property when a valid listbox is assigned to the default slot.
     *
     * @param e - the slot change event
     * @internal
     */
    slotchangeHandler(e: Event): boolean | void;
    /**
     * Updates the freeform option with the provided value.
     *
     * @param value - the value to update the freeform option with
     * @internal
     */
    protected updateFreeformOption(value?: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * When anchor positioning isn't supported, an intersection observer is used to flip the listbox when it hits the
     * viewport bounds. One static observer is used for all dropdowns.
     *
     * @internal
     */
    private anchorPositionFallback;
}

/**
 * A Field Custom HTML Element.
 *
 * @public
 */
export declare class BaseField extends FASTElement {
    private slottedInputObserver;
    /**
     * The slotted label elements.
     *
     * @internal
     */
    labelSlot: Node[];
    /**
     * Updates attributes on the slotted label elements.
     *
     * @param prev - the previous list of slotted label elements
     * @param next - the current list of slotted label elements
     */
    protected labelSlotChanged(prev: Node[], next: Node[]): void;
    /**
     * The slotted message elements. Filtered to only include elements with a `flag` attribute.
     *
     * @internal
     */
    messageSlot: Element[];
    /**
     * Adds or removes the `invalid` event listener based on the presence of slotted message elements.
     *
     * @param prev - the previous list of slotted message elements
     * @param next - the current list of slotted message elements
     * @internal
     */
    messageSlotChanged(prev: Element[], next: Element[]): void;
    /**
     * The slotted inputs.
     *
     * @internal
     * @privateRemarks
     * This field is populated with the `children` directive in the template rather than `slotted`.
     */
    slottedInputs: SlottableInput[];
    /**
     * Sets the `input` property to the first slotted input.
     *
     * @param prev - The previous collection of inputs.
     * @param next - The current collection of inputs.
     * @internal
     */
    slottedInputsChanged(prev: SlottableInput[] | undefined, next: SlottableInput[] | undefined): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Reference to the first slotted input.
     *
     * @public
     */
    input: SlottableInput;
    /**
     * Updates the field's states and label properties when the assigned input changes.
     *
     * @param prev - the previous input
     * @param next - the current input
     */
    inputChanged(prev: SlottableInput | undefined, next: SlottableInput | undefined): void;
    /**
     * Calls the `setStates` method when a `change` event is emitted from the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Redirects `click` events to the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Applies the `focus-visible` state to the element when the slotted input receives visible focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Removes the `focus-visible` state from the field when a slotted input loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e: FocusEvent): boolean | void;
    /**
     * Toggles validity state flags on the element when the slotted input emits an `invalid` event (if slotted validation messages are present).
     *
     * @param e - the event object
     * @internal
     */
    invalidHandler(e: Event): boolean | void;
    /**
     * Sets ARIA and form-related attributes on slotted label elements.
     *
     * @internal
     */
    private setLabelProperties;
    /**
     * Toggles the field's states based on the slotted input.
     *
     * @internal
     */
    setStates(): void;
    setValidationStates(): void;
}

/**
 * A Base MenuList Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export declare class BaseMenuList extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * @internal
     */
    items: HTMLElement[];
    protected itemsChanged(oldValue: HTMLElement[], newValue: HTMLElement[]): void;
    protected menuChildren: HTMLElement[] | undefined;
    protected menuItems: MenuItem[] | undefined;
    private static focusableElementRoles;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @internal
     */
    readonly isNestedMenu: () => boolean;
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus(): void;
    private static elementIndent;
    protected setItems(): void;
    /**
     * Method for Observable changes to the hidden attribute of child elements
     */
    handleChange(source: any, propertyName: string): void;
    /**
     * Handle change from child MenuItem element and set radio group behavior
     */
    private changedMenuItemHandler;
    /**
     * check if the item is a menu item
     */
    protected isMenuItemElement(el: Element): el is MenuItem;
}

/**
 * A Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @public
 */
export declare class BaseProgressBar extends FASTElement {
    /**
     * Reference to the indicator element which visually represents the progress.
     *
     * @internal
     */
    indicator?: HTMLElement;
    /**
     * Updates the indicator width after the element is connected to the DOM via the template.
     * @internal
     */
    protected indicatorChanged(): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The validation state of the progress bar
     * The validation state of the progress bar
     *
     * HTML Attribute: `validation-state`
     *
     * @public
     */
    validationState: ProgressBarValidationState | null;
    /**
     * Handles changes to validation-state attribute custom states
     * @param prev - the previous state
     * @param next - the next state
     */
    validationStateChanged(prev: ProgressBarValidationState | undefined, next: ProgressBarValidationState | undefined): void;
    /**
     * The value of the progress
     * The value of the progress
     *
     * HTML Attribute: `value`
     *
     * @internal
     */
    value?: number;
    /**
     * Updates the percent complete when the `value` property changes.
     *
     * @internal
     */
    protected valueChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The minimum value
     * The minimum value
     *
     * HTML Attribute: `min`
     *
     * @internal
     */
    min?: number;
    /**
     * Updates the percent complete when the `min` property changes.
     *
     * @param prev - The previous min value
     * @param next - The current min value
     */
    protected minChanged(prev: number | undefined, next: number | undefined): void;
    /**
     * The maximum value
     * The maximum value
     *
     * HTML Attribute: `max`
     *
     * @internal
     */
    max?: number;
    /**
     * Updates the percent complete when the `max` property changes.
     *
     * @param prev - The previous max value
     * @param next - The current max value
     * @internal
     */
    protected maxChanged(prev: number | undefined, next: number | undefined): void;
    constructor();
    /**
     * Sets the width of the indicator element based on the value, min, and max
     * properties. If the browser supports `width: attr(value)`, this method does
     * nothing and allows CSS to handle the width.
     *
     * @internal
     */
    protected setIndicatorWidth(): void;
}

/**
 * A Base Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @public
 */
export declare class BaseRadioGroup extends FASTElement {
    private isNavigating;
    /**
     * The index of the checked radio, scoped to the enabled radios.
     *
     * @internal
     */
    protected checkedIndex: number;
    /**
     * Sets the checked state of the nearest enabled radio when the `checkedIndex` changes.
     *
     * @param prev - the previous index
     * @param next - the current index
     * @internal
     */
    protected checkedIndexChanged(prev: number | undefined, next: number): void;
    /**
     * Indicates that the value has been changed by the user.
     */
    private dirtyState;
    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    /**
     * Sets the `disabled` attribute on all child radios when the `disabled` property changes.
     *
     * @param prev - the previous disabled value
     * @param next - the current disabled value
     * @internal
     */
    protected disabledChanged(prev?: boolean, next?: boolean): void;
    /**
     * The value of the checked radio.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue?: string;
    /**
     * Sets the matching radio to checked when the value changes. If no radio matches the value, no radio will be checked.
     *
     * @param prev - the previous value
     * @param next - the current value
     */
    initialValueChanged(prev: string | undefined, next: string | undefined): void;
    /**
     * The name of the radio group.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Sets the `name` attribute on all child radios when the `name` property changes.
     *
     * @internal
     */
    protected nameChanged(prev: string | undefined, next: string | undefined): void;
    /**
     * The orientation of the group.
     *
     * @public
     * @remarks
     * HTML Attribute: `orientation`
     */
    orientation?: RadioGroupOrientation;
    /**
     * Sets the ariaOrientation attribute when the orientation changes.
     *
     * @param prev - the previous orientation
     * @param next - the current orientation
     * @internal
     */
    orientationChanged(prev: RadioGroupOrientation | undefined, next: RadioGroupOrientation | undefined): void;
    /**
     * The collection of all child radios.
     *
     * @public
     */
    radios: Radio[];
    /**
     * Updates the enabled radios collection when properties on the child radios change.
     *
     * @param prev - the previous radios
     * @param next - the current radios
     */
    radiosChanged(prev: Radio[] | undefined, next: Radio[] | undefined): void;
    /**
     * Indicates whether the radio group is required.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     *
     * @param prev - the previous required value
     * @param next - the current required value
     */
    requiredChanged(prev: boolean, next: boolean): void;
    /**
     * The collection of radios that are slotted into the default slot.
     *
     * @internal
     */
    slottedRadios: Radio[];
    /**
     * Updates the radios collection when the slotted radios change.
     *
     * @param prev - the previous slotted radios
     * @param next - the current slotted radios
     */
    slottedRadiosChanged(prev: Radio[] | undefined, next: Radio[]): void;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * A collection of child radios that are not disabled.
     *
     * @internal
     */
    get enabledRadios(): Radio[];
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static formAssociated: boolean;
    /**
     * The fallback validation message, taken from a native checkbox `<input>` element.
     *
     * @internal
     */
    private _validationFallbackMessage;
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @internal
     */
    get validationMessage(): string;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The current value of the checked radio.
     *
     * @public
     */
    get value(): string | null;
    set value(next: string | null);
    /**
     * Sets the checked state of all radios when any radio emits a `change` event.
     *
     * @param e - the change event
     */
    changeHandler(e: Event): boolean | void;
    /**
     * Checks the radio at the specified index.
     *
     * @param index - the index of the radio to check
     * @internal
     */
    checkRadio(index?: number, shouldEmit?: boolean): void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Handles click events for the radio group.
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    constructor();
    /**
     * Focuses the checked radio or the first enabled radio.
     *
     * @internal
     */
    focus(): void;
    formResetCallback(): void;
    /**
     * Enables tabbing through the radio group when the group receives focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Handles keydown events for the radio group.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     *
     * @param e - the disabled event
     */
    disabledRadioHandler(e: CustomEvent): void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     * @remarks
     * RadioGroup validation is reported through the individual Radio elements rather than the RadioGroup itself.
     * This is necessary because:
     * 1. Each Radio is form-associated (extends BaseCheckbox which has `formAssociated = true`)
     * 2. Browser validation UIs and screen readers announce validation against individual form controls
     * 3. For groups like RadioGroup, the browser needs to report the error on a specific member of the group
     * 4. We anchor the error to the first Radio so it receives focus and announcement
     *
     * When the group is invalid (required but no selection):
     * - Only the first Radio gets the invalid state with the validation message
     * - Other Radios are kept valid since selecting any of them would satisfy the requirement
     *
     * When the group becomes valid (user selects any Radio):
     * - All Radios are cleared back to valid state
     * - This allows form submission to proceed
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
}

/**
 * The base class used for constructing a fluent-rating-display custom element
 *
 * @slot icon - SVG element used as the rating icon
 *
 * @public
 */
export declare class BaseRatingDisplay extends FASTElement {
    private numberFormatter;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Reference to the slot element used for the rating icon.
     *
     * @internal
     */
    iconSlot: HTMLSlotElement;
    /**
     * Updates the icon when the referenced slot is bound in the template.
     *
     * @internal
     */
    iconSlotChanged(): void;
    protected defaultCustomIconViewBox: string;
    /**
     * The element that displays the rating icons.
     * @internal
     */
    display: HTMLElement;
    /**
     * The number of ratings.
     *
     * @public
     * @remarks
     * HTML Attribute: `count`
     */
    count?: number;
    /**
     * The `viewBox` attribute of the icon <svg> element.
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-view-box`
     * @deprecated Add `viewBox` attribute on the custom SVG directly.
     */
    iconViewBox?: string;
    /**
     * The maximum possible value of the rating.
     * This attribute determines the number of icons displayed.
     * Must be a whole number greater than 1.
     *
     * @public
     * @remarks
     * HTML Attribute: `max`
     */
    max?: number;
    protected maxChanged(): void;
    /**
     * The value of the rating.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    value?: number;
    protected valueChanged(): void;
    constructor();
    connectedCallback(): void;
    /**
     * Returns "count" as string, formatted according to the locale.
     *
     * @internal
     */
    get formattedCount(): string;
    /** @internal */
    handleSlotChange(): void;
    protected renderSlottedIcon(svg: SVGSVGElement | null): void;
    protected setCustomPropertyValue(propertyName: PropertyNameForCalculation): void;
}

/**
 * The base class used for constructing a fluent-spinner custom element
 * @public
 */
export declare class BaseSpinner extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    constructor();
}

/**
 * A Tablist element that wraps a collection of tab elements
 * @public
 */
export declare class BaseTablist extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * Used for disabling all click and keyboard events for the tabs, child tab elements.
     * @public
     * @remarks
     * HTML Attribute: disabled.
     */
    disabled: boolean;
    /** @internal */
    protected disabledChanged(prev: boolean, next: boolean): void;
    /**
     * The orientation
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation: TablistOrientation;
    protected orientationChanged(prev: TablistOrientation, next: TablistOrientation): void;
    /**
     * The id of the active tab
     *
     * @public
     * @remarks
     * HTML Attribute: activeid
     */
    activeid: string;
    /** @internal */
    protected activeidChanged(oldValue: string, newValue: string): void;
    /**
     * Content slotted in the tab slot.
     * @internal
     */
    slottedTabs: Node[];
    /** @internal */
    protected slottedTabsChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /** @internal */
    tabs: Tab[];
    /** @internal */
    protected tabsChanged(prev: Tab[] | undefined, next: Tab[] | undefined): void;
    /**
     * A reference to the active tab
     * @public
     */
    activetab: Tab;
    private tabPanelMap;
    private change;
    /**
     * Function that is invoked whenever the selected tab or the tab collection changes.
     */
    protected setTabs({ connectToPanel, forceDisabled }?: {
        connectToPanel?: boolean | undefined;
        forceDisabled?: boolean | undefined;
    }): void;
    /** @internal */
    handleFocusIn(event: FocusEvent): void;
    private changeTab;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
}

/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | `<textarea>`} element.
 *
 * @slot - The default content/value of the component.
 * @slot label - The content for the `<label>`, it should be a `<fluent-label>` element.
 * @csspart label - The `<label>` element.
 * @csspart root - The container element of the `<textarea>` element.
 * @csspart control - The internal `<textarea>` element.
 * @fires change - Fires after the control loses focus, if the content has changed.
 * @fires select - Fires when the `select()` method is called.
 *
 * @public
 */
export declare class BaseTextArea extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static readonly formAssociated = true;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The `<label>` element.
     * @internal
     */
    labelEl: HTMLLabelElement;
    /**
     * The root container element.
     * @internal
     */
    rootEl: HTMLDivElement;
    /**
     * The `<textarea>` element.
     * @internal
     */
    controlEl: HTMLTextAreaElement;
    /**
     * Sets up a mutation observer to watch for changes to the control element's
     * attributes that could affect validity, and binds an input event listener to detect user interaction.
     *
     * @internal
     */
    protected controlElChanged(): void;
    /**
     * @internal
     */
    autoSizerEl?: HTMLDivElement;
    /**
     * The list of nodes that are assigned to the default slot.
     * @internal
     */
    defaultSlottedNodes: Node[];
    protected defaultSlottedNodesChanged(): void;
    private filteredLabelSlottedNodes;
    /**
     * The list of nodes that are assigned to the `label` slot.
     * @internal
     */
    labelSlottedNodes: Label[];
    protected labelSlottedNodesChanged(): void;
    private userInteracted;
    private autoSizerObserver?;
    private controlElAttrObserver;
    private preConnectControlEl;
    /**
     * Indicates the element's autocomplete state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete | `autocomplete`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autocomplete`
     */
    autocomplete?: TextAreaAutocomplete;
    /**
     * Indicates whether the element’s block size (height) should be automatically changed based on the content.
     * Note: When this property’s value is set to be `true`, the element should not have a fixed block-size
     * defined in CSS. Instead, use `min-height` or `min-block-size`.
     *
     * @public
     * @remarks
     * HTML Attribute: `auto-resize`
     */
    autoResize: boolean;
    protected autoResizeChanged(): void;
    /**
     * Sets the name of the value directionality to be submitted with form data.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/dirname | `dirname`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `dirname`
     */
    dirName?: string;
    /**
     * Sets the element's disabled state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled: boolean;
    protected disabledChanged(): void;
    /**
     * Indicates whether the element displays a box shadow. This only has effect when `appearance` is set to be `filled-darker` or `filled-lighter`.
     *
     * @public
     * @remarks
     * HTML Attribute: `display-shadow`
     */
    displayShadow: boolean;
    /**
     * The id of a form to associate the element to.
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    initialForm?: string;
    /**
     * The form element that’s associated to the element, or `null` if no form is associated.
     *
     * @public
     */
    get form(): HTMLFormElement | null;
    /**
     * A `NodeList` of `<label>` element associated with the element.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels | `labels`} property
     *
     * @public
     */
    get labels(): NodeList;
    /**
     * The maximum number of characters a user can enter.
     *
     * @public
     * @remarks
     * HTML Attribute: `maxlength`
     */
    maxLength?: number;
    /**
     * The minimum number of characters a user can enter.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/minlength | `minlength`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `minlength`
     */
    minLength?: number;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/placeholder | `placeholder`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `placeholder`
     * This attribute is not a valid substitute for a label.
     */
    placeholder?: string;
    /**
     * When true, the control will be immutable by user interaction.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `readonly`
     */
    readOnly: boolean;
    protected readOnlyChanged(): void;
    /**
     * The element's required attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    protected requiredChanged(): void;
    /**
     * Indicates whether the element can be resized by end users.
     *
     * @public
     * @remarks
     * HTML Attribute: `resize`
     */
    resize: TextAreaResize;
    protected resizeChanged(prev: TextAreaResize | undefined, next: TextAreaResize | undefined): void;
    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck | `spellcheck`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `spellcheck`
     */
    spellcheck: boolean;
    /**
     * The length of the current value.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#textLength | 'textLength'} property
     *
     * @public
     */
    get textLength(): number;
    /**
     * The type of the element, which is always "textarea".
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/type | `type`} property
     *
     * @public
     */
    get type(): 'textarea';
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage(): string;
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * The text content of the element before user interaction.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#defaultvalue | `defaultValue`} property
     *
     * @public
     * @remarks
     * In order to set the initial/default value, an author should either add the default value in the HTML as the children
     * of the component, or setting this property in JavaScript. Setting `innerHTML`, `innerText`, or `textContent` on this
     * component will not change the default value or the content displayed inside the component.
     */
    get defaultValue(): string;
    set defaultValue(next: string);
    /**
     * The value of the element.
     *
     * @public
     * @remarks
     * Reflects the `value` property.
     */
    get value(): string;
    set value(next: string);
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * @internal
     */
    formDisabledCallback(disabled: boolean): void;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message: string | null): void;
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
    /**
     * Selects the content in the element.
     *
     * @public
     */
    select(): void;
    /**
     * Gets the content inside the light DOM, if any HTML element is present, use its `outerHTML` value.
     */
    private getContent;
    private setDisabledSideEffect;
    private toggleUserValidityState;
    private maybeCreateAutoSizerEl;
    /**
     * @internal
     */
    handleControlInput(): void;
    /**
     * @internal
     */
    handleControlChange(): void;
    /**
     * @internal
     */
    handleControlSelect(): void;
}

/**
 * A Text Input Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | `<input>`} element.
 *
 * @slot start - Content which can be provided before the input
 * @slot end - Content which can be provided after the input
 * @slot - The default slot for button content
 * @csspart label - The internal `<label>` element
 * @csspart root - the root container for the internal control
 * @csspart control - The internal `<input>` control
 * @public
 */
export declare class BaseTextInput extends FASTElement {
    /**
     * Indicates the element's autocomplete state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete | `autocomplete`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autocomplete`
     */
    autocomplete?: string;
    /**
     * Indicates that the element should get focus after the page finishes loading.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#autofocus | `autofocus`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `autofocus`
     */
    autofocus: boolean;
    /**
     * The current value of the input.
     * @public
     * @remarks
     * HTML Attribute: `current-value`
     */
    currentValue: string;
    /**
     * Tracks the current value of the input.
     *
     * @param prev - the previous value
     * @param next - the next value
     *
     * @internal
     */
    currentValueChanged(prev: string, next: string): void;
    /**
     * The default slotted content. This is the content that appears in the text field label.
     *
     * @internal
     */
    defaultSlottedNodes: Node[];
    /**
     * Updates the control label visibility based on the presence of default slotted content.
     *
     * @internal
     */
    defaultSlottedNodesChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /**
     * Sets the directionality of the element to be submitted with form data.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/dirname | `dirname`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `dirname`
     */
    dirname?: string;
    /**
     * Sets the element's disabled state.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabled?: boolean;
    /**
     * The id of a form to associate the element to.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#form | `form`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    formAttribute?: string;
    /**
     * The initial value of the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the element to the initial value.
     *
     * @internal
     */
    initialValueChanged(): void;
    /**
     * Allows associating a `<datalist>` to the element by ID.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#list | `list`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `list`
     */
    list: string;
    /**
     * The maximum number of characters a user can enter.
     *
     * @public
     * @remarks
     * HTML Attribute: `maxlength`
     */
    maxlength: number;
    /**
     * The minimum number of characters a user can enter.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/minlength | `minlength`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `minlength`
     */
    minlength: number;
    /**
     * Indicates that a comma-separated list of email addresses can be entered. This attribute is only valid when `type="email"`.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/multiple | `multiple`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `multiple`
     */
    multiple: boolean;
    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * A regular expression that the value must match to pass validation.
     *
     * @public
     * @remarks
     * HTML Attribute: `pattern`
     */
    pattern: string;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/placeholder | `placeholder`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `placeholder`
     * This attribute is not a valid substitute for a label.
     */
    placeholder: string;
    /**
     * When true, the control will be immutable by user interaction.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `readonly`
     */
    readOnly?: boolean;
    /**
     * Syncs the `ElementInternals.ariaReadOnly` property when the `readonly` property changes.
     *
     * @internal
     */
    readOnlyChanged(): void;
    /**
     * The element's required attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    required: boolean;
    /**
     * Syncs the element's internal `aria-required` state with the `required` attribute.
     *
     * @param previous - the previous required state
     * @param next - the current required state
     *
     * @internal
     */
    requiredChanged(previous: boolean, next: boolean): void;
    /**
     * Sets the width of the element to a specified number of characters.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size: number;
    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck | `spellcheck`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `spellcheck`
     */
    spellcheck: boolean;
    /**
     * Allows setting a type or mode of text.
     *
     * @public
     * @remarks
     * HTML Attribute: `type`
     */
    type: TextInputType;
    /**
     * A reference to the internal input element.
     *
     * @internal
     */
    control: HTMLInputElement;
    /**
     * Calls the `setValidity` method when the control reference changes.
     *
     * @param prev - the previous control reference
     * @param next - the current control reference
     *
     * @internal
     */
    controlChanged(prev: HTMLInputElement | undefined, next: HTMLInputElement | undefined): void;
    /**
     * A reference to the internal label element.
     *
     * @internal
     */
    controlLabel: HTMLLabelElement;
    /**
     * Indicates that the value has been changed by the user.
     *
     * @internal
     */
    private dirtyValue;
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
    static readonly formAssociated = true;
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity(): ValidityState;
    /**
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage(): string;
    /**
     * The current value of the input.
     * @public
     */
    get value(): string;
    set value(value: string);
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate(): boolean;
    /**
     * The associated form element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
    /**
     * Handles the internal control's `keypress` event.
     *
     * @internal
     */
    beforeinputHandler(e: InputEvent): boolean | void;
    /**
     * Change event handler for inner control.
     *
     * @internal
     * @privateRemarks
     * "Change" events are not `composable` so they will not permeate the shadow DOM boundary. This function effectively
     * proxies the change event, emitting a `change` event whenever the internal control emits a `change` event.
     */
    changeHandler(e: InputEvent): boolean | void;
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity(): boolean;
    /**
     * Clicks the inner control when the component is clicked.
     *
     * @param e - the event object
     */
    clickHandler(e: MouseEvent): boolean | void;
    connectedCallback(): void;
    /**
     * Focuses the inner control when the component is focused.
     *
     * @param e - the event object
     * @public
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback(): void;
    /**
     * Handles implicit form submission when the user presses the "Enter" key.
     *
     * @internal
     */
    private implicitSubmit;
    /**
     * Handles the internal control's `input` event.
     *
     * @internal
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Handles the internal control's `keydown` event.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Selects all the text in the text field.
     *
     * @public
     * @privateRemarks
     * The `select` event does not permeate the shadow DOM boundary. This function effectively proxies the event,
     * emitting a `select` event whenever the internal control emits a `select` event
     *
     */
    select(): void;
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message: string): void;
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity(): boolean;
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags?: Partial<ValidityState>, message?: string, anchor?: HTMLElement): void;
}

export declare class BaseTree extends FASTElement {
    /**
     * The currently selected tree item
     * @public
     */
    currentSelected: HTMLElement | null;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /** @internal */
    defaultSlot: HTMLSlotElement;
    /**
     * Calls the slot change handler when the `defaultSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    defaultSlotChanged(): void;
    constructor();
    /** @internal */
    childTreeItems: BaseTreeItem[];
    /** @internal */
    childTreeItemsChanged(): void;
    /**
     * Updates current selected when slottedTreeItems changes
     */
    private updateCurrentSelected;
    /**
     * KeyDown handler
     *
     *  @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Handles click events bubbling up
     *
     *  @internal
     */
    clickHandler(e: Event): boolean | void;
    /**
     * Handles the selected-changed events bubbling up
     * from child tree items
     *
     *  @internal
     */
    changeHandler(e: Event): boolean | void;
    /** @internal */
    handleDefaultSlotChange(): void;
    /**
     * All descendant tree items in DOM order, recursively flattened from
     * `childTreeItems`.
     */
    protected get descendantTreeItems(): BaseTreeItem[];
}

declare class BaseTreeItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /** @internal */
    itemSlot: HTMLSlotElement;
    /**
     * Calls the slot change handler when the `itemSlot` reference is updated
     * by the template binding.
     *
     * @internal
     */
    itemSlotChanged(): void;
    constructor();
    /**
     * When true, the control will be appear expanded by user interaction.
     * When true, the control will be appear expanded by user interaction.
     *
     * HTML Attribute: `expanded`
     *
     * @public
     */
    expanded: boolean;
    /**
     * Handles changes to the expanded attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @public
     */
    expandedChanged(prev: boolean, next: boolean): void;
    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    selected: boolean;
    /**
     * Handles changes to the selected attribute
     * @param prev - the previous state
     * @param next - the next state
     *
     * @internal
     */
    protected selectedChanged(prev: boolean, next: boolean): void;
    /**
     * When true, the control has no child tree items
     * When true, the control has no child tree items
     *
     * HTML Attribute: empty
     *
     * @public
     */
    empty: boolean;
    private styles;
    /**
     * The indent of the tree item element.
     * This is not needed once css attr() is supported (--indent: attr(data-indent type(<number>)));
     * @public
     */
    dataIndent: number | undefined;
    protected dataIndentChanged(prev: number, next: number): void;
    /** @internal */
    childTreeItems: BaseTreeItem[] | undefined;
    /**
     * Handles changes to the child tree items
     *
     * @public
     */
    childTreeItemsChanged(): void;
    /**
     * Updates the childrens indent
     *
     * @public
     */
    updateChildTreeItems(): void;
    /**
     * Sets the indent for each item
     */
    private setIndent;
    /**
     * Toggle the expansion state of the tree item
     *
     * @public
     */
    toggleExpansion(): void;
    /**
     * Whether the tree item is nested
     * @internal
     */
    get isNestedItem(): boolean;
    /**
     * Whether the tree item is nested in a collapsed tree item.
     * @internal
     */
    get isHidden(): boolean;
    /** @internal */
    handleItemSlotChange(): void;
}

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadius2XLarge | `borderRadius2XLarge`} design token.
 * @public
 */
export declare const borderRadius2XLarge = "var(--borderRadius2XLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadius3XLarge | `borderRadius3XLarge`} design token.
 * @public
 */
export declare const borderRadius3XLarge = "var(--borderRadius3XLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadius4XLarge | `borderRadius4XLarge`} design token.
 * @public
 */
export declare const borderRadius4XLarge = "var(--borderRadius4XLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadius5XLarge | `borderRadius5XLarge`} design token.
 * @public
 */
export declare const borderRadius5XLarge = "var(--borderRadius5XLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadius6XLarge | `borderRadius6XLarge`} design token.
 * @public
 */
export declare const borderRadius6XLarge = "var(--borderRadius6XLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusCircular | `borderRadiusCircular`} design token.
 * @public
 */
export declare const borderRadiusCircular = "var(--borderRadiusCircular)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusLarge | `borderRadiusLarge`} design token.
 * @public
 */
export declare const borderRadiusLarge = "var(--borderRadiusLarge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusMedium | `borderRadiusMedium`} design token.
 * @public
 */
export declare const borderRadiusMedium = "var(--borderRadiusMedium)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusNone | `borderRadiusNone`} design token.
 * @public
 */
export declare const borderRadiusNone = "var(--borderRadiusNone)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusSmall | `borderRadiusSmall`} design token.
 * @public
 */
export declare const borderRadiusSmall = "var(--borderRadiusSmall)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusXLarge | `borderRadiusXLarge`} design token.
 * @public
 */
export declare const borderRadiusXLarge = "var(--borderRadiusXLarge)";

/**
 * A Button Custom HTML Element.
 * Based on BaseButton and includes style and layout specific attributes
 *
 * @tag fluent-button
 *
 * @public
 */
export declare class Button extends BaseButton {
    /**
     * Indicates the styled appearance of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: ButtonAppearance;
    /**
     * The shape of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: ButtonShape;
    /**
     * The size of the button.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: ButtonSize;
    /**
     * Indicates that the button should only display as an icon with no text content.
     *
     * @public
     * @remarks
     * HTML Attribute: `icon-only`
     */
    iconOnly: boolean;
}

/**
 * @internal
 * @privateRemarks
 * Mark internal because exporting class and interface of the same name confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 */
export declare interface Button extends StartEnd {
}

/**
 * ButtonAppearance constants
 * @public
 */
export declare const ButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * A Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export declare type ButtonAppearance = ValuesOf<typeof ButtonAppearance>;

/**
 * The definition for the Fluent Button component.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-button>`
 */
export declare const ButtonDefinition: FASTElementDefinition<typeof Button>;

/**
 * Button `formtarget` attribute values.
 * @public
 */
export declare const ButtonFormTarget: {
    readonly blank: "_blank";
    readonly self: "_self";
    readonly parent: "_parent";
    readonly top: "_top";
};

/**
 * Types for the `formtarget` attribute values.
 * @public
 */
export declare type ButtonFormTarget = ValuesOf<typeof ButtonFormTarget>;

/**
 * Button configuration options.
 * @public
 */
declare type ButtonOptions = StartEndOptions<Button>;
export { ButtonOptions }
export { ButtonOptions as MenuButtonOptions }
export { ButtonOptions as ToggleButtonOptions }

/**
 * A Button can be square, circular or rounded.
 * @public
 */
export declare const ButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * A Button can be square, circular or rounded
 * @public
 */
export declare type ButtonShape = ValuesOf<typeof ButtonShape>;

/**
 * A Button can be a size of small, medium or large.
 * @public
 */
export declare const ButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * A Button can be on of several preset sizes.
 * @public
 */
export declare type ButtonSize = ValuesOf<typeof ButtonSize>;

/**
 * The template for the Button component.
 *
 * @public
 */
export declare const ButtonTemplate: ElementViewTemplate<BaseButton>;

/**
 * Button type values.
 *
 * @public
 */
export declare const ButtonType: {
    readonly submit: "submit";
    readonly reset: "reset";
    readonly button: "button";
};

/**
 * Type for button type values.
 *
 * @public
 */
export declare type ButtonType = ValuesOf<typeof ButtonType>;

/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#checkbox | ARIA checkbox }.
 *
 * @tag fluent-checkbox
 *
 * @slot checked-indicator - The checked indicator
 * @slot indeterminate-indicator - The indeterminate indicator
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
export declare class Checkbox extends BaseCheckbox {
    /**
     * Indicates that the element is in an indeterminate or mixed state.
     *
     * @public
     */
    indeterminate?: boolean;
    /**
     * Updates the indeterminate state when the `indeterminate` property changes.
     *
     * @param prev - the indeterminate state
     * @param next - the current indeterminate state
     * @internal
     */
    protected indeterminateChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * Indicates the shape of the checkbox.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: CheckboxShape;
    /**
     * Indicates the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: CheckboxSize;
    constructor();
    /**
     * Sets the ARIA checked state. If the `indeterminate` flag is true, the value will be 'mixed'.
     *
     * @internal
     * @override
     */
    protected setAriaChecked(value?: boolean): void;
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force?: boolean): void;
}

/**
 * The Fluent Checkbox Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-checkbox\>
 */
export declare const CheckboxDefinition: FASTElementDefinition<typeof Checkbox>;

/**
 * Checkbox configuration options
 * @public
 */
export declare type CheckboxOptions = {
    checkedIndicator?: StaticallyComposableHTML<Checkbox>;
    indeterminateIndicator?: StaticallyComposableHTML<Checkbox>;
};

/**
 * Checkbox shape
 * @public
 */
export declare const CheckboxShape: {
    readonly circular: "circular";
    readonly square: "square";
};

/** @public */
export declare type CheckboxShape = ValuesOf<typeof CheckboxShape>;

/**
 * Checkbox size
 * @public
 */
export declare const CheckboxSize: {
    readonly medium: "medium";
    readonly large: "large";
};

/** @public */
export declare type CheckboxSize = ValuesOf<typeof CheckboxSize>;

/** Checkbox styles
 *
 * @public
 */
export declare const CheckboxStyles: ElementStyles;

/**
 * Template for the Checkbox component
 * @public
 */
export declare const CheckboxTemplate: ElementViewTemplate<Checkbox>;

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBackgroundOverlay | `colorBackgroundOverlay`} design token.
 * @public
 */
export declare const colorBackgroundOverlay = "var(--colorBackgroundOverlay)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground | `colorBrandBackground`} design token.
 * @public
 */
export declare const colorBrandBackground = "var(--colorBrandBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground2 | `colorBrandBackground2`} design token.
 * @public
 */
export declare const colorBrandBackground2 = "var(--colorBrandBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground2Hover | `colorBrandBackground2Hover`} design token.
 * @public
 */
export declare const colorBrandBackground2Hover = "var(--colorBrandBackground2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground2Pressed | `colorBrandBackground2Pressed`} design token.
 * @public
 */
export declare const colorBrandBackground2Pressed = "var(--colorBrandBackground2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground3Static | `colorBrandBackground3Static`} design token.
 * @public
 */
export declare const colorBrandBackground3Static = "var(--colorBrandBackground3Static)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground4Static | `colorBrandBackground4Static`} design token.
 * @public
 */
export declare const colorBrandBackground4Static = "var(--colorBrandBackground4Static)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundHover | `colorBrandBackgroundHover`} design token.
 * @public
 */
export declare const colorBrandBackgroundHover = "var(--colorBrandBackgroundHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundInverted | `colorBrandBackgroundInverted`} design token.
 * @public
 */
export declare const colorBrandBackgroundInverted = "var(--colorBrandBackgroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundInvertedHover | `colorBrandBackgroundInvertedHover`} design token.
 * @public
 */
export declare const colorBrandBackgroundInvertedHover = "var(--colorBrandBackgroundInvertedHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundInvertedPressed | `colorBrandBackgroundInvertedPressed`} design token.
 * @public
 */
export declare const colorBrandBackgroundInvertedPressed = "var(--colorBrandBackgroundInvertedPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundInvertedSelected | `colorBrandBackgroundInvertedSelected`} design token.
 * @public
 */
export declare const colorBrandBackgroundInvertedSelected = "var(--colorBrandBackgroundInvertedSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundPressed | `colorBrandBackgroundPressed`} design token.
 * @public
 */
export declare const colorBrandBackgroundPressed = "var(--colorBrandBackgroundPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundSelected | `colorBrandBackgroundSelected`} design token.
 * @public
 */
export declare const colorBrandBackgroundSelected = "var(--colorBrandBackgroundSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundStatic | `colorBrandBackgroundStatic`} design token.
 * @public
 */
export declare const colorBrandBackgroundStatic = "var(--colorBrandBackgroundStatic)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForeground1 | `colorBrandForeground1`} design token.
 * @public
 */
export declare const colorBrandForeground1 = "var(--colorBrandForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForeground2 | `colorBrandForeground2`} design token.
 * @public
 */
export declare const colorBrandForeground2 = "var(--colorBrandForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForeground2Hover | `colorBrandForeground2Hover`} design token.
 * @public
 */
export declare const colorBrandForeground2Hover = "var(--colorBrandForeground2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForeground2Pressed | `colorBrandForeground2Pressed`} design token.
 * @public
 */
export declare const colorBrandForeground2Pressed = "var(--colorBrandForeground2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundInverted | `colorBrandForegroundInverted`} design token.
 * @public
 */
export declare const colorBrandForegroundInverted = "var(--colorBrandForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundInvertedHover | `colorBrandForegroundInvertedHover`} design token.
 * @public
 */
export declare const colorBrandForegroundInvertedHover = "var(--colorBrandForegroundInvertedHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundInvertedPressed | `colorBrandForegroundInvertedPressed`} design token.
 * @public
 */
export declare const colorBrandForegroundInvertedPressed = "var(--colorBrandForegroundInvertedPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundLink | `colorBrandForegroundLink`} design token.
 * @public
 */
export declare const colorBrandForegroundLink = "var(--colorBrandForegroundLink)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundLinkHover | `colorBrandForegroundLinkHover`} design token.
 * @public
 */
export declare const colorBrandForegroundLinkHover = "var(--colorBrandForegroundLinkHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundLinkPressed | `colorBrandForegroundLinkPressed`} design token.
 * @public
 */
export declare const colorBrandForegroundLinkPressed = "var(--colorBrandForegroundLinkPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundLinkSelected | `colorBrandForegroundLinkSelected`} design token.
 * @public
 */
export declare const colorBrandForegroundLinkSelected = "var(--colorBrandForegroundLinkSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundOnLight | `colorBrandForegroundOnLight`} design token.
 * @public
 */
export declare const colorBrandForegroundOnLight = "var(--colorBrandForegroundOnLight)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundOnLightHover | `colorBrandForegroundOnLightHover`} design token.
 * @public
 */
export declare const colorBrandForegroundOnLightHover = "var(--colorBrandForegroundOnLightHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundOnLightPressed | `colorBrandForegroundOnLightPressed`} design token.
 * @public
 */
export declare const colorBrandForegroundOnLightPressed = "var(--colorBrandForegroundOnLightPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandForegroundOnLightSelected | `colorBrandForegroundOnLightSelected`} design token.
 * @public
 */
export declare const colorBrandForegroundOnLightSelected = "var(--colorBrandForegroundOnLightSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandShadowAmbient | `colorBrandShadowAmbient`} design token.
 * @public
 */
export declare const colorBrandShadowAmbient = "var(--colorBrandShadowAmbient)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandShadowKey | `colorBrandShadowKey`} design token.
 * @public
 */
export declare const colorBrandShadowKey = "var(--colorBrandShadowKey)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke1 | `colorBrandStroke1`} design token.
 * @public
 */
export declare const colorBrandStroke1 = "var(--colorBrandStroke1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke2 | `colorBrandStroke2`} design token.
 * @public
 */
export declare const colorBrandStroke2 = "var(--colorBrandStroke2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke2Contrast | `colorBrandStroke2Contrast`} design token.
 * @public
 */
export declare const colorBrandStroke2Contrast = "var(--colorBrandStroke2Contrast)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke2Hover | `colorBrandStroke2Hover`} design token.
 * @public
 */
export declare const colorBrandStroke2Hover = "var(--colorBrandStroke2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke2Pressed | `colorBrandStroke2Pressed`} design token.
 * @public
 */
export declare const colorBrandStroke2Pressed = "var(--colorBrandStroke2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackground | `colorCompoundBrandBackground`} design token.
 * @public
 */
export declare const colorCompoundBrandBackground = "var(--colorCompoundBrandBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackgroundHover | `colorCompoundBrandBackgroundHover`} design token.
 * @public
 */
export declare const colorCompoundBrandBackgroundHover = "var(--colorCompoundBrandBackgroundHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackgroundPressed | `colorCompoundBrandBackgroundPressed`} design token.
 * @public
 */
export declare const colorCompoundBrandBackgroundPressed = "var(--colorCompoundBrandBackgroundPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandForeground1 | `colorCompoundBrandForeground1`} design token.
 * @public
 */
export declare const colorCompoundBrandForeground1 = "var(--colorCompoundBrandForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandForeground1Hover | `colorCompoundBrandForeground1Hover`} design token.
 * @public
 */
export declare const colorCompoundBrandForeground1Hover = "var(--colorCompoundBrandForeground1Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandForeground1Pressed | `colorCompoundBrandForeground1Pressed`} design token.
 * @public
 */
export declare const colorCompoundBrandForeground1Pressed = "var(--colorCompoundBrandForeground1Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStroke | `colorCompoundBrandStroke`} design token.
 * @public
 */
export declare const colorCompoundBrandStroke = "var(--colorCompoundBrandStroke)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStrokeHover | `colorCompoundBrandStrokeHover`} design token.
 * @public
 */
export declare const colorCompoundBrandStrokeHover = "var(--colorCompoundBrandStrokeHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStrokePressed | `colorCompoundBrandStrokePressed`} design token.
 * @public
 */
export declare const colorCompoundBrandStrokePressed = "var(--colorCompoundBrandStrokePressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1 | `colorNeutralBackground1`} design token.
 * @public
 */
export declare const colorNeutralBackground1 = "var(--colorNeutralBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Hover | `colorNeutralBackground1Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground1Hover = "var(--colorNeutralBackground1Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Pressed | `colorNeutralBackground1Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground1Pressed = "var(--colorNeutralBackground1Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Selected | `colorNeutralBackground1Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground1Selected = "var(--colorNeutralBackground1Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground2 | `colorNeutralBackground2`} design token.
 * @public
 */
export declare const colorNeutralBackground2 = "var(--colorNeutralBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground2Hover | `colorNeutralBackground2Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground2Hover = "var(--colorNeutralBackground2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground2Pressed | `colorNeutralBackground2Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground2Pressed = "var(--colorNeutralBackground2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground2Selected | `colorNeutralBackground2Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground2Selected = "var(--colorNeutralBackground2Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground3 | `colorNeutralBackground3`} design token.
 * @public
 */
export declare const colorNeutralBackground3 = "var(--colorNeutralBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground3Hover | `colorNeutralBackground3Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground3Hover = "var(--colorNeutralBackground3Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground3Pressed | `colorNeutralBackground3Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground3Pressed = "var(--colorNeutralBackground3Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground3Selected | `colorNeutralBackground3Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground3Selected = "var(--colorNeutralBackground3Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground4 | `colorNeutralBackground4`} design token.
 * @public
 */
export declare const colorNeutralBackground4 = "var(--colorNeutralBackground4)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground4Hover | `colorNeutralBackground4Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground4Hover = "var(--colorNeutralBackground4Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground4Pressed | `colorNeutralBackground4Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground4Pressed = "var(--colorNeutralBackground4Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground4Selected | `colorNeutralBackground4Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground4Selected = "var(--colorNeutralBackground4Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground5 | `colorNeutralBackground5`} design token.
 * @public
 */
export declare const colorNeutralBackground5 = "var(--colorNeutralBackground5)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground5Hover | `colorNeutralBackground5Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground5Hover = "var(--colorNeutralBackground5Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground5Pressed | `colorNeutralBackground5Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground5Pressed = "var(--colorNeutralBackground5Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground5Selected | `colorNeutralBackground5Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground5Selected = "var(--colorNeutralBackground5Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground6 | `colorNeutralBackground6`} design token.
 * @public
 */
export declare const colorNeutralBackground6 = "var(--colorNeutralBackground6)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground7 | `colorNeutralBackground7`} design token.
 * @public
 */
export declare const colorNeutralBackground7 = "var(--colorNeutralBackground7)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground7Hover | `colorNeutralBackground7Hover`} design token.
 * @public
 */
export declare const colorNeutralBackground7Hover = "var(--colorNeutralBackground7Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground7Pressed | `colorNeutralBackground7Pressed`} design token.
 * @public
 */
export declare const colorNeutralBackground7Pressed = "var(--colorNeutralBackground7Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground7Selected | `colorNeutralBackground7Selected`} design token.
 * @public
 */
export declare const colorNeutralBackground7Selected = "var(--colorNeutralBackground7Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground8 | `colorNeutralBackground8`} design token.
 * @public
 */
export declare const colorNeutralBackground8 = "var(--colorNeutralBackground8)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundAlpha | `colorNeutralBackgroundAlpha`} design token.
 * @public
 */
export declare const colorNeutralBackgroundAlpha = "var(--colorNeutralBackgroundAlpha)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundAlpha2 | `colorNeutralBackgroundAlpha2`} design token.
 * @public
 */
export declare const colorNeutralBackgroundAlpha2 = "var(--colorNeutralBackgroundAlpha2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundDisabled | `colorNeutralBackgroundDisabled`} design token.
 * @public
 */
export declare const colorNeutralBackgroundDisabled = "var(--colorNeutralBackgroundDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundDisabled2 | `colorNeutralBackgroundDisabled2`} design token.
 * @public
 */
export declare const colorNeutralBackgroundDisabled2 = "var(--colorNeutralBackgroundDisabled2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInverted | `colorNeutralBackgroundInverted`} design token.
 * @public
 */
export declare const colorNeutralBackgroundInverted = "var(--colorNeutralBackgroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInvertedDisabled | `colorNeutralBackgroundInvertedDisabled`} design token.
 * @public
 */
export declare const colorNeutralBackgroundInvertedDisabled = "var(--colorNeutralBackgroundInvertedDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInvertedHover | `colorNeutralBackgroundInvertedHover`} design token.
 * @public
 */
export declare const colorNeutralBackgroundInvertedHover = "var(--colorNeutralBackgroundInvertedHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInvertedPressed | `colorNeutralBackgroundInvertedPressed`} design token.
 * @public
 */
export declare const colorNeutralBackgroundInvertedPressed = "var(--colorNeutralBackgroundInvertedPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInvertedSelected | `colorNeutralBackgroundInvertedSelected`} design token.
 * @public
 */
export declare const colorNeutralBackgroundInvertedSelected = "var(--colorNeutralBackgroundInvertedSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundStatic | `colorNeutralBackgroundStatic`} design token.
 * @public
 */
export declare const colorNeutralBackgroundStatic = "var(--colorNeutralBackgroundStatic)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralCardBackground | `colorNeutralCardBackground`} design token.
 * @public
 */
export declare const colorNeutralCardBackground = "var(--colorNeutralCardBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralCardBackgroundDisabled | `colorNeutralCardBackgroundDisabled`} design token.
 * @public
 */
export declare const colorNeutralCardBackgroundDisabled = "var(--colorNeutralCardBackgroundDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralCardBackgroundHover | `colorNeutralCardBackgroundHover`} design token.
 * @public
 */
export declare const colorNeutralCardBackgroundHover = "var(--colorNeutralCardBackgroundHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralCardBackgroundPressed | `colorNeutralCardBackgroundPressed`} design token.
 * @public
 */
export declare const colorNeutralCardBackgroundPressed = "var(--colorNeutralCardBackgroundPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralCardBackgroundSelected | `colorNeutralCardBackgroundSelected`} design token.
 * @public
 */
export declare const colorNeutralCardBackgroundSelected = "var(--colorNeutralCardBackgroundSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1 | `colorNeutralForeground1`} design token.
 * @public
 */
export declare const colorNeutralForeground1 = "var(--colorNeutralForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Hover | `colorNeutralForeground1Hover`} design token.
 * @public
 */
export declare const colorNeutralForeground1Hover = "var(--colorNeutralForeground1Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Pressed | `colorNeutralForeground1Pressed`} design token.
 * @public
 */
export declare const colorNeutralForeground1Pressed = "var(--colorNeutralForeground1Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Selected | `colorNeutralForeground1Selected`} design token.
 * @public
 */
export declare const colorNeutralForeground1Selected = "var(--colorNeutralForeground1Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Static | `colorNeutralForeground1Static`} design token.
 * @public
 */
export declare const colorNeutralForeground1Static = "var(--colorNeutralForeground1Static)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2 | `colorNeutralForeground2`} design token.
 * @public
 */
export declare const colorNeutralForeground2 = "var(--colorNeutralForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2BrandHover | `colorNeutralForeground2BrandHover`} design token.
 * @public
 */
export declare const colorNeutralForeground2BrandHover = "var(--colorNeutralForeground2BrandHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2BrandPressed | `colorNeutralForeground2BrandPressed`} design token.
 * @public
 */
export declare const colorNeutralForeground2BrandPressed = "var(--colorNeutralForeground2BrandPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2BrandSelected | `colorNeutralForeground2BrandSelected`} design token.
 * @public
 */
export declare const colorNeutralForeground2BrandSelected = "var(--colorNeutralForeground2BrandSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Hover | `colorNeutralForeground2Hover`} design token.
 * @public
 */
export declare const colorNeutralForeground2Hover = "var(--colorNeutralForeground2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Link | `colorNeutralForeground2Link`} design token.
 * @public
 */
export declare const colorNeutralForeground2Link = "var(--colorNeutralForeground2Link)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2LinkHover | `colorNeutralForeground2LinkHover`} design token.
 * @public
 */
export declare const colorNeutralForeground2LinkHover = "var(--colorNeutralForeground2LinkHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2LinkPressed | `colorNeutralForeground2LinkPressed`} design token.
 * @public
 */
export declare const colorNeutralForeground2LinkPressed = "var(--colorNeutralForeground2LinkPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2LinkSelected | `colorNeutralForeground2LinkSelected`} design token.
 * @public
 */
export declare const colorNeutralForeground2LinkSelected = "var(--colorNeutralForeground2LinkSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Pressed | `colorNeutralForeground2Pressed`} design token.
 * @public
 */
export declare const colorNeutralForeground2Pressed = "var(--colorNeutralForeground2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Selected | `colorNeutralForeground2Selected`} design token.
 * @public
 */
export declare const colorNeutralForeground2Selected = "var(--colorNeutralForeground2Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3 | `colorNeutralForeground3`} design token.
 * @public
 */
export declare const colorNeutralForeground3 = "var(--colorNeutralForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3BrandHover | `colorNeutralForeground3BrandHover`} design token.
 * @public
 */
export declare const colorNeutralForeground3BrandHover = "var(--colorNeutralForeground3BrandHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3BrandPressed | `colorNeutralForeground3BrandPressed`} design token.
 * @public
 */
export declare const colorNeutralForeground3BrandPressed = "var(--colorNeutralForeground3BrandPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3BrandSelected | `colorNeutralForeground3BrandSelected`} design token.
 * @public
 */
export declare const colorNeutralForeground3BrandSelected = "var(--colorNeutralForeground3BrandSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3Hover | `colorNeutralForeground3Hover`} design token.
 * @public
 */
export declare const colorNeutralForeground3Hover = "var(--colorNeutralForeground3Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3Pressed | `colorNeutralForeground3Pressed`} design token.
 * @public
 */
export declare const colorNeutralForeground3Pressed = "var(--colorNeutralForeground3Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3Selected | `colorNeutralForeground3Selected`} design token.
 * @public
 */
export declare const colorNeutralForeground3Selected = "var(--colorNeutralForeground3Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground4 | `colorNeutralForeground4`} design token.
 * @public
 */
export declare const colorNeutralForeground4 = "var(--colorNeutralForeground4)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground5 | `colorNeutralForeground5`} design token.
 * @public
 */
export declare const colorNeutralForeground5 = "var(--colorNeutralForeground5)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground5Hover | `colorNeutralForeground5Hover`} design token.
 * @public
 */
export declare const colorNeutralForeground5Hover = "var(--colorNeutralForeground5Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground5Pressed | `colorNeutralForeground5Pressed`} design token.
 * @public
 */
export declare const colorNeutralForeground5Pressed = "var(--colorNeutralForeground5Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground5Selected | `colorNeutralForeground5Selected`} design token.
 * @public
 */
export declare const colorNeutralForeground5Selected = "var(--colorNeutralForeground5Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundDisabled | `colorNeutralForegroundDisabled`} design token.
 * @public
 */
export declare const colorNeutralForegroundDisabled = "var(--colorNeutralForegroundDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInverted | `colorNeutralForegroundInverted`} design token.
 * @public
 */
export declare const colorNeutralForegroundInverted = "var(--colorNeutralForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInverted2 | `colorNeutralForegroundInverted2`} design token.
 * @public
 */
export declare const colorNeutralForegroundInverted2 = "var(--colorNeutralForegroundInverted2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedDisabled | `colorNeutralForegroundInvertedDisabled`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedDisabled = "var(--colorNeutralForegroundInvertedDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedHover | `colorNeutralForegroundInvertedHover`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedHover = "var(--colorNeutralForegroundInvertedHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedLink | `colorNeutralForegroundInvertedLink`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedLink = "var(--colorNeutralForegroundInvertedLink)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedLinkHover | `colorNeutralForegroundInvertedLinkHover`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedLinkHover = "var(--colorNeutralForegroundInvertedLinkHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedLinkPressed | `colorNeutralForegroundInvertedLinkPressed`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedLinkPressed = "var(--colorNeutralForegroundInvertedLinkPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedLinkSelected | `colorNeutralForegroundInvertedLinkSelected`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedLinkSelected = "var(--colorNeutralForegroundInvertedLinkSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedPressed | `colorNeutralForegroundInvertedPressed`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedPressed = "var(--colorNeutralForegroundInvertedPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInvertedSelected | `colorNeutralForegroundInvertedSelected`} design token.
 * @public
 */
export declare const colorNeutralForegroundInvertedSelected = "var(--colorNeutralForegroundInvertedSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundOnBrand | `colorNeutralForegroundOnBrand`} design token.
 * @public
 */
export declare const colorNeutralForegroundOnBrand = "var(--colorNeutralForegroundOnBrand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundStaticInverted | `colorNeutralForegroundStaticInverted`} design token.
 * @public
 */
export declare const colorNeutralForegroundStaticInverted = "var(--colorNeutralForegroundStaticInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowAmbient | `colorNeutralShadowAmbient`} design token.
 * @public
 */
export declare const colorNeutralShadowAmbient = "var(--colorNeutralShadowAmbient)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowAmbientDarker | `colorNeutralShadowAmbientDarker`} design token.
 * @public
 */
export declare const colorNeutralShadowAmbientDarker = "var(--colorNeutralShadowAmbientDarker)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowAmbientLighter | `colorNeutralShadowAmbientLighter`} design token.
 * @public
 */
export declare const colorNeutralShadowAmbientLighter = "var(--colorNeutralShadowAmbientLighter)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowKey | `colorNeutralShadowKey`} design token.
 * @public
 */
export declare const colorNeutralShadowKey = "var(--colorNeutralShadowKey)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowKeyDarker | `colorNeutralShadowKeyDarker`} design token.
 * @public
 */
export declare const colorNeutralShadowKeyDarker = "var(--colorNeutralShadowKeyDarker)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralShadowKeyLighter | `colorNeutralShadowKeyLighter`} design token.
 * @public
 */
export declare const colorNeutralShadowKeyLighter = "var(--colorNeutralShadowKeyLighter)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStencil1 | `colorNeutralStencil1`} design token.
 * @public
 */
export declare const colorNeutralStencil1 = "var(--colorNeutralStencil1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStencil1Alpha | `colorNeutralStencil1Alpha`} design token.
 * @public
 */
export declare const colorNeutralStencil1Alpha = "var(--colorNeutralStencil1Alpha)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStencil2 | `colorNeutralStencil2`} design token.
 * @public
 */
export declare const colorNeutralStencil2 = "var(--colorNeutralStencil2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStencil2Alpha | `colorNeutralStencil2Alpha`} design token.
 * @public
 */
export declare const colorNeutralStencil2Alpha = "var(--colorNeutralStencil2Alpha)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1 | `colorNeutralStroke1`} design token.
 * @public
 */
export declare const colorNeutralStroke1 = "var(--colorNeutralStroke1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1Hover | `colorNeutralStroke1Hover`} design token.
 * @public
 */
export declare const colorNeutralStroke1Hover = "var(--colorNeutralStroke1Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1Pressed | `colorNeutralStroke1Pressed`} design token.
 * @public
 */
export declare const colorNeutralStroke1Pressed = "var(--colorNeutralStroke1Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1Selected | `colorNeutralStroke1Selected`} design token.
 * @public
 */
export declare const colorNeutralStroke1Selected = "var(--colorNeutralStroke1Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke2 | `colorNeutralStroke2`} design token.
 * @public
 */
export declare const colorNeutralStroke2 = "var(--colorNeutralStroke2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke3 | `colorNeutralStroke3`} design token.
 * @public
 */
export declare const colorNeutralStroke3 = "var(--colorNeutralStroke3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke4 | `colorNeutralStroke4`} design token.
 * @public
 */
export declare const colorNeutralStroke4 = "var(--colorNeutralStroke4)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke4Hover | `colorNeutralStroke4Hover`} design token.
 * @public
 */
export declare const colorNeutralStroke4Hover = "var(--colorNeutralStroke4Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke4Pressed | `colorNeutralStroke4Pressed`} design token.
 * @public
 */
export declare const colorNeutralStroke4Pressed = "var(--colorNeutralStroke4Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke4Selected | `colorNeutralStroke4Selected`} design token.
 * @public
 */
export declare const colorNeutralStroke4Selected = "var(--colorNeutralStroke4Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessible | `colorNeutralStrokeAccessible`} design token.
 * @public
 */
export declare const colorNeutralStrokeAccessible = "var(--colorNeutralStrokeAccessible)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessibleHover | `colorNeutralStrokeAccessibleHover`} design token.
 * @public
 */
export declare const colorNeutralStrokeAccessibleHover = "var(--colorNeutralStrokeAccessibleHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessiblePressed | `colorNeutralStrokeAccessiblePressed`} design token.
 * @public
 */
export declare const colorNeutralStrokeAccessiblePressed = "var(--colorNeutralStrokeAccessiblePressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessibleSelected | `colorNeutralStrokeAccessibleSelected`} design token.
 * @public
 */
export declare const colorNeutralStrokeAccessibleSelected = "var(--colorNeutralStrokeAccessibleSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAlpha | `colorNeutralStrokeAlpha`} design token.
 * @public
 */
export declare const colorNeutralStrokeAlpha = "var(--colorNeutralStrokeAlpha)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAlpha2 | `colorNeutralStrokeAlpha2`} design token.
 * @public
 */
export declare const colorNeutralStrokeAlpha2 = "var(--colorNeutralStrokeAlpha2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeDisabled | `colorNeutralStrokeDisabled`} design token.
 * @public
 */
export declare const colorNeutralStrokeDisabled = "var(--colorNeutralStrokeDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeDisabled2 | `colorNeutralStrokeDisabled2`} design token.
 * @public
 */
export declare const colorNeutralStrokeDisabled2 = "var(--colorNeutralStrokeDisabled2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeInvertedDisabled | `colorNeutralStrokeInvertedDisabled`} design token.
 * @public
 */
export declare const colorNeutralStrokeInvertedDisabled = "var(--colorNeutralStrokeInvertedDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand | `colorNeutralStrokeOnBrand`} design token.
 * @public
 */
export declare const colorNeutralStrokeOnBrand = "var(--colorNeutralStrokeOnBrand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand2 | `colorNeutralStrokeOnBrand2`} design token.
 * @public
 */
export declare const colorNeutralStrokeOnBrand2 = "var(--colorNeutralStrokeOnBrand2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand2Hover | `colorNeutralStrokeOnBrand2Hover`} design token.
 * @public
 */
export declare const colorNeutralStrokeOnBrand2Hover = "var(--colorNeutralStrokeOnBrand2Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand2Pressed | `colorNeutralStrokeOnBrand2Pressed`} design token.
 * @public
 */
export declare const colorNeutralStrokeOnBrand2Pressed = "var(--colorNeutralStrokeOnBrand2Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand2Selected | `colorNeutralStrokeOnBrand2Selected`} design token.
 * @public
 */
export declare const colorNeutralStrokeOnBrand2Selected = "var(--colorNeutralStrokeOnBrand2Selected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeSubtle | `colorNeutralStrokeSubtle`} design token.
 * @public
 */
export declare const colorNeutralStrokeSubtle = "var(--colorNeutralStrokeSubtle)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteAnchorBackground2 | `colorPaletteAnchorBackground2`} design token.
 * @public
 */
export declare const colorPaletteAnchorBackground2 = "var(--colorPaletteAnchorBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteAnchorBorderActive | `colorPaletteAnchorBorderActive`} design token.
 * @public
 */
export declare const colorPaletteAnchorBorderActive = "var(--colorPaletteAnchorBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteAnchorForeground2 | `colorPaletteAnchorForeground2`} design token.
 * @public
 */
export declare const colorPaletteAnchorForeground2 = "var(--colorPaletteAnchorForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBeigeBackground2 | `colorPaletteBeigeBackground2`} design token.
 * @public
 */
export declare const colorPaletteBeigeBackground2 = "var(--colorPaletteBeigeBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBeigeBorderActive | `colorPaletteBeigeBorderActive`} design token.
 * @public
 */
export declare const colorPaletteBeigeBorderActive = "var(--colorPaletteBeigeBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBeigeForeground2 | `colorPaletteBeigeForeground2`} design token.
 * @public
 */
export declare const colorPaletteBeigeForeground2 = "var(--colorPaletteBeigeForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBackground1 | `colorPaletteBerryBackground1`} design token.
 * @public
 */
export declare const colorPaletteBerryBackground1 = "var(--colorPaletteBerryBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBackground2 | `colorPaletteBerryBackground2`} design token.
 * @public
 */
export declare const colorPaletteBerryBackground2 = "var(--colorPaletteBerryBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBackground3 | `colorPaletteBerryBackground3`} design token.
 * @public
 */
export declare const colorPaletteBerryBackground3 = "var(--colorPaletteBerryBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBorder1 | `colorPaletteBerryBorder1`} design token.
 * @public
 */
export declare const colorPaletteBerryBorder1 = "var(--colorPaletteBerryBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBorder2 | `colorPaletteBerryBorder2`} design token.
 * @public
 */
export declare const colorPaletteBerryBorder2 = "var(--colorPaletteBerryBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryBorderActive | `colorPaletteBerryBorderActive`} design token.
 * @public
 */
export declare const colorPaletteBerryBorderActive = "var(--colorPaletteBerryBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryForeground1 | `colorPaletteBerryForeground1`} design token.
 * @public
 */
export declare const colorPaletteBerryForeground1 = "var(--colorPaletteBerryForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryForeground2 | `colorPaletteBerryForeground2`} design token.
 * @public
 */
export declare const colorPaletteBerryForeground2 = "var(--colorPaletteBerryForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBerryForeground3 | `colorPaletteBerryForeground3`} design token.
 * @public
 */
export declare const colorPaletteBerryForeground3 = "var(--colorPaletteBerryForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBlueBackground2 | `colorPaletteBlueBackground2`} design token.
 * @public
 */
export declare const colorPaletteBlueBackground2 = "var(--colorPaletteBlueBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBlueBorderActive | `colorPaletteBlueBorderActive`} design token.
 * @public
 */
export declare const colorPaletteBlueBorderActive = "var(--colorPaletteBlueBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBlueForeground2 | `colorPaletteBlueForeground2`} design token.
 * @public
 */
export declare const colorPaletteBlueForeground2 = "var(--colorPaletteBlueForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrassBackground2 | `colorPaletteBrassBackground2`} design token.
 * @public
 */
export declare const colorPaletteBrassBackground2 = "var(--colorPaletteBrassBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrassBorderActive | `colorPaletteBrassBorderActive`} design token.
 * @public
 */
export declare const colorPaletteBrassBorderActive = "var(--colorPaletteBrassBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrassForeground2 | `colorPaletteBrassForeground2`} design token.
 * @public
 */
export declare const colorPaletteBrassForeground2 = "var(--colorPaletteBrassForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrownBackground2 | `colorPaletteBrownBackground2`} design token.
 * @public
 */
export declare const colorPaletteBrownBackground2 = "var(--colorPaletteBrownBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrownBorderActive | `colorPaletteBrownBorderActive`} design token.
 * @public
 */
export declare const colorPaletteBrownBorderActive = "var(--colorPaletteBrownBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteBrownForeground2 | `colorPaletteBrownForeground2`} design token.
 * @public
 */
export declare const colorPaletteBrownForeground2 = "var(--colorPaletteBrownForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCornflowerBackground2 | `colorPaletteCornflowerBackground2`} design token.
 * @public
 */
export declare const colorPaletteCornflowerBackground2 = "var(--colorPaletteCornflowerBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCornflowerBorderActive | `colorPaletteCornflowerBorderActive`} design token.
 * @public
 */
export declare const colorPaletteCornflowerBorderActive = "var(--colorPaletteCornflowerBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCornflowerForeground2 | `colorPaletteCornflowerForeground2`} design token.
 * @public
 */
export declare const colorPaletteCornflowerForeground2 = "var(--colorPaletteCornflowerForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCranberryBackground2 | `colorPaletteCranberryBackground2`} design token.
 * @public
 */
export declare const colorPaletteCranberryBackground2 = "var(--colorPaletteCranberryBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCranberryBorderActive | `colorPaletteCranberryBorderActive`} design token.
 * @public
 */
export declare const colorPaletteCranberryBorderActive = "var(--colorPaletteCranberryBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteCranberryForeground2 | `colorPaletteCranberryForeground2`} design token.
 * @public
 */
export declare const colorPaletteCranberryForeground2 = "var(--colorPaletteCranberryForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkGreenBackground2 | `colorPaletteDarkGreenBackground2`} design token.
 * @public
 */
export declare const colorPaletteDarkGreenBackground2 = "var(--colorPaletteDarkGreenBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkGreenBorderActive | `colorPaletteDarkGreenBorderActive`} design token.
 * @public
 */
export declare const colorPaletteDarkGreenBorderActive = "var(--colorPaletteDarkGreenBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkGreenForeground2 | `colorPaletteDarkGreenForeground2`} design token.
 * @public
 */
export declare const colorPaletteDarkGreenForeground2 = "var(--colorPaletteDarkGreenForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBackground1 | `colorPaletteDarkOrangeBackground1`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBackground1 = "var(--colorPaletteDarkOrangeBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBackground2 | `colorPaletteDarkOrangeBackground2`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBackground2 = "var(--colorPaletteDarkOrangeBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBackground3 | `colorPaletteDarkOrangeBackground3`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBackground3 = "var(--colorPaletteDarkOrangeBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBorder1 | `colorPaletteDarkOrangeBorder1`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBorder1 = "var(--colorPaletteDarkOrangeBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBorder2 | `colorPaletteDarkOrangeBorder2`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBorder2 = "var(--colorPaletteDarkOrangeBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeBorderActive | `colorPaletteDarkOrangeBorderActive`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeBorderActive = "var(--colorPaletteDarkOrangeBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeForeground1 | `colorPaletteDarkOrangeForeground1`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeForeground1 = "var(--colorPaletteDarkOrangeForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeForeground2 | `colorPaletteDarkOrangeForeground2`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeForeground2 = "var(--colorPaletteDarkOrangeForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkOrangeForeground3 | `colorPaletteDarkOrangeForeground3`} design token.
 * @public
 */
export declare const colorPaletteDarkOrangeForeground3 = "var(--colorPaletteDarkOrangeForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkRedBackground2 | `colorPaletteDarkRedBackground2`} design token.
 * @public
 */
export declare const colorPaletteDarkRedBackground2 = "var(--colorPaletteDarkRedBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkRedBorderActive | `colorPaletteDarkRedBorderActive`} design token.
 * @public
 */
export declare const colorPaletteDarkRedBorderActive = "var(--colorPaletteDarkRedBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteDarkRedForeground2 | `colorPaletteDarkRedForeground2`} design token.
 * @public
 */
export declare const colorPaletteDarkRedForeground2 = "var(--colorPaletteDarkRedForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteForestBackground2 | `colorPaletteForestBackground2`} design token.
 * @public
 */
export declare const colorPaletteForestBackground2 = "var(--colorPaletteForestBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteForestBorderActive | `colorPaletteForestBorderActive`} design token.
 * @public
 */
export declare const colorPaletteForestBorderActive = "var(--colorPaletteForestBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteForestForeground2 | `colorPaletteForestForeground2`} design token.
 * @public
 */
export declare const colorPaletteForestForeground2 = "var(--colorPaletteForestForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGoldBackground2 | `colorPaletteGoldBackground2`} design token.
 * @public
 */
export declare const colorPaletteGoldBackground2 = "var(--colorPaletteGoldBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGoldBorderActive | `colorPaletteGoldBorderActive`} design token.
 * @public
 */
export declare const colorPaletteGoldBorderActive = "var(--colorPaletteGoldBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGoldForeground2 | `colorPaletteGoldForeground2`} design token.
 * @public
 */
export declare const colorPaletteGoldForeground2 = "var(--colorPaletteGoldForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGrapeBackground2 | `colorPaletteGrapeBackground2`} design token.
 * @public
 */
export declare const colorPaletteGrapeBackground2 = "var(--colorPaletteGrapeBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGrapeBorderActive | `colorPaletteGrapeBorderActive`} design token.
 * @public
 */
export declare const colorPaletteGrapeBorderActive = "var(--colorPaletteGrapeBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGrapeForeground2 | `colorPaletteGrapeForeground2`} design token.
 * @public
 */
export declare const colorPaletteGrapeForeground2 = "var(--colorPaletteGrapeForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBackground1 | `colorPaletteGreenBackground1`} design token.
 * @public
 */
export declare const colorPaletteGreenBackground1 = "var(--colorPaletteGreenBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBackground2 | `colorPaletteGreenBackground2`} design token.
 * @public
 */
export declare const colorPaletteGreenBackground2 = "var(--colorPaletteGreenBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBackground3 | `colorPaletteGreenBackground3`} design token.
 * @public
 */
export declare const colorPaletteGreenBackground3 = "var(--colorPaletteGreenBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBorder1 | `colorPaletteGreenBorder1`} design token.
 * @public
 */
export declare const colorPaletteGreenBorder1 = "var(--colorPaletteGreenBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBorder2 | `colorPaletteGreenBorder2`} design token.
 * @public
 */
export declare const colorPaletteGreenBorder2 = "var(--colorPaletteGreenBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenBorderActive | `colorPaletteGreenBorderActive`} design token.
 * @public
 */
export declare const colorPaletteGreenBorderActive = "var(--colorPaletteGreenBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenForeground1 | `colorPaletteGreenForeground1`} design token.
 * @public
 */
export declare const colorPaletteGreenForeground1 = "var(--colorPaletteGreenForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenForeground2 | `colorPaletteGreenForeground2`} design token.
 * @public
 */
export declare const colorPaletteGreenForeground2 = "var(--colorPaletteGreenForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenForeground3 | `colorPaletteGreenForeground3`} design token.
 * @public
 */
export declare const colorPaletteGreenForeground3 = "var(--colorPaletteGreenForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteGreenForegroundInverted | `colorPaletteGreenForegroundInverted`} design token.
 * @public
 */
export declare const colorPaletteGreenForegroundInverted = "var(--colorPaletteGreenForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLavenderBackground2 | `colorPaletteLavenderBackground2`} design token.
 * @public
 */
export declare const colorPaletteLavenderBackground2 = "var(--colorPaletteLavenderBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLavenderBorderActive | `colorPaletteLavenderBorderActive`} design token.
 * @public
 */
export declare const colorPaletteLavenderBorderActive = "var(--colorPaletteLavenderBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLavenderForeground2 | `colorPaletteLavenderForeground2`} design token.
 * @public
 */
export declare const colorPaletteLavenderForeground2 = "var(--colorPaletteLavenderForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBackground1 | `colorPaletteLightGreenBackground1`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBackground1 = "var(--colorPaletteLightGreenBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBackground2 | `colorPaletteLightGreenBackground2`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBackground2 = "var(--colorPaletteLightGreenBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBackground3 | `colorPaletteLightGreenBackground3`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBackground3 = "var(--colorPaletteLightGreenBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBorder1 | `colorPaletteLightGreenBorder1`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBorder1 = "var(--colorPaletteLightGreenBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBorder2 | `colorPaletteLightGreenBorder2`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBorder2 = "var(--colorPaletteLightGreenBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenBorderActive | `colorPaletteLightGreenBorderActive`} design token.
 * @public
 */
export declare const colorPaletteLightGreenBorderActive = "var(--colorPaletteLightGreenBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenForeground1 | `colorPaletteLightGreenForeground1`} design token.
 * @public
 */
export declare const colorPaletteLightGreenForeground1 = "var(--colorPaletteLightGreenForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenForeground2 | `colorPaletteLightGreenForeground2`} design token.
 * @public
 */
export declare const colorPaletteLightGreenForeground2 = "var(--colorPaletteLightGreenForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightGreenForeground3 | `colorPaletteLightGreenForeground3`} design token.
 * @public
 */
export declare const colorPaletteLightGreenForeground3 = "var(--colorPaletteLightGreenForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightTealBackground2 | `colorPaletteLightTealBackground2`} design token.
 * @public
 */
export declare const colorPaletteLightTealBackground2 = "var(--colorPaletteLightTealBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightTealBorderActive | `colorPaletteLightTealBorderActive`} design token.
 * @public
 */
export declare const colorPaletteLightTealBorderActive = "var(--colorPaletteLightTealBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLightTealForeground2 | `colorPaletteLightTealForeground2`} design token.
 * @public
 */
export declare const colorPaletteLightTealForeground2 = "var(--colorPaletteLightTealForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLilacBackground2 | `colorPaletteLilacBackground2`} design token.
 * @public
 */
export declare const colorPaletteLilacBackground2 = "var(--colorPaletteLilacBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLilacBorderActive | `colorPaletteLilacBorderActive`} design token.
 * @public
 */
export declare const colorPaletteLilacBorderActive = "var(--colorPaletteLilacBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteLilacForeground2 | `colorPaletteLilacForeground2`} design token.
 * @public
 */
export declare const colorPaletteLilacForeground2 = "var(--colorPaletteLilacForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMagentaBackground2 | `colorPaletteMagentaBackground2`} design token.
 * @public
 */
export declare const colorPaletteMagentaBackground2 = "var(--colorPaletteMagentaBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMagentaBorderActive | `colorPaletteMagentaBorderActive`} design token.
 * @public
 */
export declare const colorPaletteMagentaBorderActive = "var(--colorPaletteMagentaBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMagentaForeground2 | `colorPaletteMagentaForeground2`} design token.
 * @public
 */
export declare const colorPaletteMagentaForeground2 = "var(--colorPaletteMagentaForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBackground1 | `colorPaletteMarigoldBackground1`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBackground1 = "var(--colorPaletteMarigoldBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBackground2 | `colorPaletteMarigoldBackground2`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBackground2 = "var(--colorPaletteMarigoldBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBackground3 | `colorPaletteMarigoldBackground3`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBackground3 = "var(--colorPaletteMarigoldBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBorder1 | `colorPaletteMarigoldBorder1`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBorder1 = "var(--colorPaletteMarigoldBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBorder2 | `colorPaletteMarigoldBorder2`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBorder2 = "var(--colorPaletteMarigoldBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldBorderActive | `colorPaletteMarigoldBorderActive`} design token.
 * @public
 */
export declare const colorPaletteMarigoldBorderActive = "var(--colorPaletteMarigoldBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldForeground1 | `colorPaletteMarigoldForeground1`} design token.
 * @public
 */
export declare const colorPaletteMarigoldForeground1 = "var(--colorPaletteMarigoldForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldForeground2 | `colorPaletteMarigoldForeground2`} design token.
 * @public
 */
export declare const colorPaletteMarigoldForeground2 = "var(--colorPaletteMarigoldForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMarigoldForeground3 | `colorPaletteMarigoldForeground3`} design token.
 * @public
 */
export declare const colorPaletteMarigoldForeground3 = "var(--colorPaletteMarigoldForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMinkBackground2 | `colorPaletteMinkBackground2`} design token.
 * @public
 */
export declare const colorPaletteMinkBackground2 = "var(--colorPaletteMinkBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMinkBorderActive | `colorPaletteMinkBorderActive`} design token.
 * @public
 */
export declare const colorPaletteMinkBorderActive = "var(--colorPaletteMinkBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteMinkForeground2 | `colorPaletteMinkForeground2`} design token.
 * @public
 */
export declare const colorPaletteMinkForeground2 = "var(--colorPaletteMinkForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteNavyBackground2 | `colorPaletteNavyBackground2`} design token.
 * @public
 */
export declare const colorPaletteNavyBackground2 = "var(--colorPaletteNavyBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteNavyBorderActive | `colorPaletteNavyBorderActive`} design token.
 * @public
 */
export declare const colorPaletteNavyBorderActive = "var(--colorPaletteNavyBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteNavyForeground2 | `colorPaletteNavyForeground2`} design token.
 * @public
 */
export declare const colorPaletteNavyForeground2 = "var(--colorPaletteNavyForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePeachBackground2 | `colorPalettePeachBackground2`} design token.
 * @public
 */
export declare const colorPalettePeachBackground2 = "var(--colorPalettePeachBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePeachBorderActive | `colorPalettePeachBorderActive`} design token.
 * @public
 */
export declare const colorPalettePeachBorderActive = "var(--colorPalettePeachBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePeachForeground2 | `colorPalettePeachForeground2`} design token.
 * @public
 */
export declare const colorPalettePeachForeground2 = "var(--colorPalettePeachForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePinkBackground2 | `colorPalettePinkBackground2`} design token.
 * @public
 */
export declare const colorPalettePinkBackground2 = "var(--colorPalettePinkBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePinkBorderActive | `colorPalettePinkBorderActive`} design token.
 * @public
 */
export declare const colorPalettePinkBorderActive = "var(--colorPalettePinkBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePinkForeground2 | `colorPalettePinkForeground2`} design token.
 * @public
 */
export declare const colorPalettePinkForeground2 = "var(--colorPalettePinkForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlatinumBackground2 | `colorPalettePlatinumBackground2`} design token.
 * @public
 */
export declare const colorPalettePlatinumBackground2 = "var(--colorPalettePlatinumBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlatinumBorderActive | `colorPalettePlatinumBorderActive`} design token.
 * @public
 */
export declare const colorPalettePlatinumBorderActive = "var(--colorPalettePlatinumBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlatinumForeground2 | `colorPalettePlatinumForeground2`} design token.
 * @public
 */
export declare const colorPalettePlatinumForeground2 = "var(--colorPalettePlatinumForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlumBackground2 | `colorPalettePlumBackground2`} design token.
 * @public
 */
export declare const colorPalettePlumBackground2 = "var(--colorPalettePlumBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlumBorderActive | `colorPalettePlumBorderActive`} design token.
 * @public
 */
export declare const colorPalettePlumBorderActive = "var(--colorPalettePlumBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePlumForeground2 | `colorPalettePlumForeground2`} design token.
 * @public
 */
export declare const colorPalettePlumForeground2 = "var(--colorPalettePlumForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePumpkinBackground2 | `colorPalettePumpkinBackground2`} design token.
 * @public
 */
export declare const colorPalettePumpkinBackground2 = "var(--colorPalettePumpkinBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePumpkinBorderActive | `colorPalettePumpkinBorderActive`} design token.
 * @public
 */
export declare const colorPalettePumpkinBorderActive = "var(--colorPalettePumpkinBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePumpkinForeground2 | `colorPalettePumpkinForeground2`} design token.
 * @public
 */
export declare const colorPalettePumpkinForeground2 = "var(--colorPalettePumpkinForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePurpleBackground2 | `colorPalettePurpleBackground2`} design token.
 * @public
 */
export declare const colorPalettePurpleBackground2 = "var(--colorPalettePurpleBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePurpleBorderActive | `colorPalettePurpleBorderActive`} design token.
 * @public
 */
export declare const colorPalettePurpleBorderActive = "var(--colorPalettePurpleBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPalettePurpleForeground2 | `colorPalettePurpleForeground2`} design token.
 * @public
 */
export declare const colorPalettePurpleForeground2 = "var(--colorPalettePurpleForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBackground1 | `colorPaletteRedBackground1`} design token.
 * @public
 */
export declare const colorPaletteRedBackground1 = "var(--colorPaletteRedBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBackground2 | `colorPaletteRedBackground2`} design token.
 * @public
 */
export declare const colorPaletteRedBackground2 = "var(--colorPaletteRedBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBackground3 | `colorPaletteRedBackground3`} design token.
 * @public
 */
export declare const colorPaletteRedBackground3 = "var(--colorPaletteRedBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBorder1 | `colorPaletteRedBorder1`} design token.
 * @public
 */
export declare const colorPaletteRedBorder1 = "var(--colorPaletteRedBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBorder2 | `colorPaletteRedBorder2`} design token.
 * @public
 */
export declare const colorPaletteRedBorder2 = "var(--colorPaletteRedBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBorderActive | `colorPaletteRedBorderActive`} design token.
 * @public
 */
export declare const colorPaletteRedBorderActive = "var(--colorPaletteRedBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedForeground1 | `colorPaletteRedForeground1`} design token.
 * @public
 */
export declare const colorPaletteRedForeground1 = "var(--colorPaletteRedForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedForeground2 | `colorPaletteRedForeground2`} design token.
 * @public
 */
export declare const colorPaletteRedForeground2 = "var(--colorPaletteRedForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedForeground3 | `colorPaletteRedForeground3`} design token.
 * @public
 */
export declare const colorPaletteRedForeground3 = "var(--colorPaletteRedForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedForegroundInverted | `colorPaletteRedForegroundInverted`} design token.
 * @public
 */
export declare const colorPaletteRedForegroundInverted = "var(--colorPaletteRedForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRoyalBlueBackground2 | `colorPaletteRoyalBlueBackground2`} design token.
 * @public
 */
export declare const colorPaletteRoyalBlueBackground2 = "var(--colorPaletteRoyalBlueBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRoyalBlueBorderActive | `colorPaletteRoyalBlueBorderActive`} design token.
 * @public
 */
export declare const colorPaletteRoyalBlueBorderActive = "var(--colorPaletteRoyalBlueBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRoyalBlueForeground2 | `colorPaletteRoyalBlueForeground2`} design token.
 * @public
 */
export declare const colorPaletteRoyalBlueForeground2 = "var(--colorPaletteRoyalBlueForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSeafoamBackground2 | `colorPaletteSeafoamBackground2`} design token.
 * @public
 */
export declare const colorPaletteSeafoamBackground2 = "var(--colorPaletteSeafoamBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSeafoamBorderActive | `colorPaletteSeafoamBorderActive`} design token.
 * @public
 */
export declare const colorPaletteSeafoamBorderActive = "var(--colorPaletteSeafoamBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSeafoamForeground2 | `colorPaletteSeafoamForeground2`} design token.
 * @public
 */
export declare const colorPaletteSeafoamForeground2 = "var(--colorPaletteSeafoamForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSteelBackground2 | `colorPaletteSteelBackground2`} design token.
 * @public
 */
export declare const colorPaletteSteelBackground2 = "var(--colorPaletteSteelBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSteelBorderActive | `colorPaletteSteelBorderActive`} design token.
 * @public
 */
export declare const colorPaletteSteelBorderActive = "var(--colorPaletteSteelBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteSteelForeground2 | `colorPaletteSteelForeground2`} design token.
 * @public
 */
export declare const colorPaletteSteelForeground2 = "var(--colorPaletteSteelForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteTealBackground2 | `colorPaletteTealBackground2`} design token.
 * @public
 */
export declare const colorPaletteTealBackground2 = "var(--colorPaletteTealBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteTealBorderActive | `colorPaletteTealBorderActive`} design token.
 * @public
 */
export declare const colorPaletteTealBorderActive = "var(--colorPaletteTealBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteTealForeground2 | `colorPaletteTealForeground2`} design token.
 * @public
 */
export declare const colorPaletteTealForeground2 = "var(--colorPaletteTealForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBackground1 | `colorPaletteYellowBackground1`} design token.
 * @public
 */
export declare const colorPaletteYellowBackground1 = "var(--colorPaletteYellowBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBackground2 | `colorPaletteYellowBackground2`} design token.
 * @public
 */
export declare const colorPaletteYellowBackground2 = "var(--colorPaletteYellowBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBackground3 | `colorPaletteYellowBackground3`} design token.
 * @public
 */
export declare const colorPaletteYellowBackground3 = "var(--colorPaletteYellowBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBorder1 | `colorPaletteYellowBorder1`} design token.
 * @public
 */
export declare const colorPaletteYellowBorder1 = "var(--colorPaletteYellowBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBorder2 | `colorPaletteYellowBorder2`} design token.
 * @public
 */
export declare const colorPaletteYellowBorder2 = "var(--colorPaletteYellowBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowBorderActive | `colorPaletteYellowBorderActive`} design token.
 * @public
 */
export declare const colorPaletteYellowBorderActive = "var(--colorPaletteYellowBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowForeground1 | `colorPaletteYellowForeground1`} design token.
 * @public
 */
export declare const colorPaletteYellowForeground1 = "var(--colorPaletteYellowForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowForeground2 | `colorPaletteYellowForeground2`} design token.
 * @public
 */
export declare const colorPaletteYellowForeground2 = "var(--colorPaletteYellowForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowForeground3 | `colorPaletteYellowForeground3`} design token.
 * @public
 */
export declare const colorPaletteYellowForeground3 = "var(--colorPaletteYellowForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteYellowForegroundInverted | `colorPaletteYellowForegroundInverted`} design token.
 * @public
 */
export declare const colorPaletteYellowForegroundInverted = "var(--colorPaletteYellowForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorScrollbarOverlay | `colorScrollbarOverlay`} design token.
 * @public
 */
export declare const colorScrollbarOverlay = "var(--colorScrollbarOverlay)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBackground1 | `colorStatusDangerBackground1`} design token.
 * @public
 */
export declare const colorStatusDangerBackground1 = "var(--colorStatusDangerBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBackground2 | `colorStatusDangerBackground2`} design token.
 * @public
 */
export declare const colorStatusDangerBackground2 = "var(--colorStatusDangerBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBackground3 | `colorStatusDangerBackground3`} design token.
 * @public
 */
export declare const colorStatusDangerBackground3 = "var(--colorStatusDangerBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBackground3Hover | `colorStatusDangerBackground3Hover`} design token.
 * @public
 */
export declare const colorStatusDangerBackground3Hover = "var(--colorStatusDangerBackground3Hover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBackground3Pressed | `colorStatusDangerBackground3Pressed`} design token.
 * @public
 */
export declare const colorStatusDangerBackground3Pressed = "var(--colorStatusDangerBackground3Pressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBorder1 | `colorStatusDangerBorder1`} design token.
 * @public
 */
export declare const colorStatusDangerBorder1 = "var(--colorStatusDangerBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBorder2 | `colorStatusDangerBorder2`} design token.
 * @public
 */
export declare const colorStatusDangerBorder2 = "var(--colorStatusDangerBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerBorderActive | `colorStatusDangerBorderActive`} design token.
 * @public
 */
export declare const colorStatusDangerBorderActive = "var(--colorStatusDangerBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerForeground1 | `colorStatusDangerForeground1`} design token.
 * @public
 */
export declare const colorStatusDangerForeground1 = "var(--colorStatusDangerForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerForeground2 | `colorStatusDangerForeground2`} design token.
 * @public
 */
export declare const colorStatusDangerForeground2 = "var(--colorStatusDangerForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerForeground3 | `colorStatusDangerForeground3`} design token.
 * @public
 */
export declare const colorStatusDangerForeground3 = "var(--colorStatusDangerForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusDangerForegroundInverted | `colorStatusDangerForegroundInverted`} design token.
 * @public
 */
export declare const colorStatusDangerForegroundInverted = "var(--colorStatusDangerForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBackground1 | `colorStatusSuccessBackground1`} design token.
 * @public
 */
export declare const colorStatusSuccessBackground1 = "var(--colorStatusSuccessBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBackground2 | `colorStatusSuccessBackground2`} design token.
 * @public
 */
export declare const colorStatusSuccessBackground2 = "var(--colorStatusSuccessBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBackground3 | `colorStatusSuccessBackground3`} design token.
 * @public
 */
export declare const colorStatusSuccessBackground3 = "var(--colorStatusSuccessBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBorder1 | `colorStatusSuccessBorder1`} design token.
 * @public
 */
export declare const colorStatusSuccessBorder1 = "var(--colorStatusSuccessBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBorder2 | `colorStatusSuccessBorder2`} design token.
 * @public
 */
export declare const colorStatusSuccessBorder2 = "var(--colorStatusSuccessBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessBorderActive | `colorStatusSuccessBorderActive`} design token.
 * @public
 */
export declare const colorStatusSuccessBorderActive = "var(--colorStatusSuccessBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessForeground1 | `colorStatusSuccessForeground1`} design token.
 * @public
 */
export declare const colorStatusSuccessForeground1 = "var(--colorStatusSuccessForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessForeground2 | `colorStatusSuccessForeground2`} design token.
 * @public
 */
export declare const colorStatusSuccessForeground2 = "var(--colorStatusSuccessForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessForeground3 | `colorStatusSuccessForeground3`} design token.
 * @public
 */
export declare const colorStatusSuccessForeground3 = "var(--colorStatusSuccessForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusSuccessForegroundInverted | `colorStatusSuccessForegroundInverted`} design token.
 * @public
 */
export declare const colorStatusSuccessForegroundInverted = "var(--colorStatusSuccessForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBackground1 | `colorStatusWarningBackground1`} design token.
 * @public
 */
export declare const colorStatusWarningBackground1 = "var(--colorStatusWarningBackground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBackground2 | `colorStatusWarningBackground2`} design token.
 * @public
 */
export declare const colorStatusWarningBackground2 = "var(--colorStatusWarningBackground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBackground3 | `colorStatusWarningBackground3`} design token.
 * @public
 */
export declare const colorStatusWarningBackground3 = "var(--colorStatusWarningBackground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBorder1 | `colorStatusWarningBorder1`} design token.
 * @public
 */
export declare const colorStatusWarningBorder1 = "var(--colorStatusWarningBorder1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBorder2 | `colorStatusWarningBorder2`} design token.
 * @public
 */
export declare const colorStatusWarningBorder2 = "var(--colorStatusWarningBorder2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningBorderActive | `colorStatusWarningBorderActive`} design token.
 * @public
 */
export declare const colorStatusWarningBorderActive = "var(--colorStatusWarningBorderActive)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningForeground1 | `colorStatusWarningForeground1`} design token.
 * @public
 */
export declare const colorStatusWarningForeground1 = "var(--colorStatusWarningForeground1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningForeground2 | `colorStatusWarningForeground2`} design token.
 * @public
 */
export declare const colorStatusWarningForeground2 = "var(--colorStatusWarningForeground2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningForeground3 | `colorStatusWarningForeground3`} design token.
 * @public
 */
export declare const colorStatusWarningForeground3 = "var(--colorStatusWarningForeground3)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStatusWarningForegroundInverted | `colorStatusWarningForegroundInverted`} design token.
 * @public
 */
export declare const colorStatusWarningForegroundInverted = "var(--colorStatusWarningForegroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStrokeFocus1 | `colorStrokeFocus1`} design token.
 * @public
 */
export declare const colorStrokeFocus1 = "var(--colorStrokeFocus1)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStrokeFocus2 | `colorStrokeFocus2`} design token.
 * @public
 */
export declare const colorStrokeFocus2 = "var(--colorStrokeFocus2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackground | `colorSubtleBackground`} design token.
 * @public
 */
export declare const colorSubtleBackground = "var(--colorSubtleBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundHover | `colorSubtleBackgroundHover`} design token.
 * @public
 */
export declare const colorSubtleBackgroundHover = "var(--colorSubtleBackgroundHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundInverted | `colorSubtleBackgroundInverted`} design token.
 * @public
 */
export declare const colorSubtleBackgroundInverted = "var(--colorSubtleBackgroundInverted)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundInvertedHover | `colorSubtleBackgroundInvertedHover`} design token.
 * @public
 */
export declare const colorSubtleBackgroundInvertedHover = "var(--colorSubtleBackgroundInvertedHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundInvertedPressed | `colorSubtleBackgroundInvertedPressed`} design token.
 * @public
 */
export declare const colorSubtleBackgroundInvertedPressed = "var(--colorSubtleBackgroundInvertedPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundInvertedSelected | `colorSubtleBackgroundInvertedSelected`} design token.
 * @public
 */
export declare const colorSubtleBackgroundInvertedSelected = "var(--colorSubtleBackgroundInvertedSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundLightAlphaHover | `colorSubtleBackgroundLightAlphaHover`} design token.
 * @public
 */
export declare const colorSubtleBackgroundLightAlphaHover = "var(--colorSubtleBackgroundLightAlphaHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundLightAlphaPressed | `colorSubtleBackgroundLightAlphaPressed`} design token.
 * @public
 */
export declare const colorSubtleBackgroundLightAlphaPressed = "var(--colorSubtleBackgroundLightAlphaPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundLightAlphaSelected | `colorSubtleBackgroundLightAlphaSelected`} design token.
 * @public
 */
export declare const colorSubtleBackgroundLightAlphaSelected = "var(--colorSubtleBackgroundLightAlphaSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundPressed | `colorSubtleBackgroundPressed`} design token.
 * @public
 */
export declare const colorSubtleBackgroundPressed = "var(--colorSubtleBackgroundPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundSelected | `colorSubtleBackgroundSelected`} design token.
 * @public
 */
export declare const colorSubtleBackgroundSelected = "var(--colorSubtleBackgroundSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackground | `colorTransparentBackground`} design token.
 * @public
 */
export declare const colorTransparentBackground = "var(--colorTransparentBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackgroundHover | `colorTransparentBackgroundHover`} design token.
 * @public
 */
export declare const colorTransparentBackgroundHover = "var(--colorTransparentBackgroundHover)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackgroundPressed | `colorTransparentBackgroundPressed`} design token.
 * @public
 */
export declare const colorTransparentBackgroundPressed = "var(--colorTransparentBackgroundPressed)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackgroundSelected | `colorTransparentBackgroundSelected`} design token.
 * @public
 */
export declare const colorTransparentBackgroundSelected = "var(--colorTransparentBackgroundSelected)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentStroke | `colorTransparentStroke`} design token.
 * @public
 */
export declare const colorTransparentStroke = "var(--colorTransparentStroke)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentStrokeDisabled | `colorTransparentStrokeDisabled`} design token.
 * @public
 */
export declare const colorTransparentStrokeDisabled = "var(--colorTransparentStrokeDisabled)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentStrokeInteractive | `colorTransparentStrokeInteractive`} design token.
 * @public
 */
export declare const colorTransparentStrokeInteractive = "var(--colorTransparentStrokeInteractive)";

/**
 * The base class used for constructing a fluent-compound-button custom element
 *
 * @tag fluent-compound-button
 *
 * @public
 */
export declare class CompoundButton extends Button {
}

/**
 * Compound Button Appearance constants
 * @public
 */
export declare const CompoundButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * A Compound Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export declare type CompoundButtonAppearance = ValuesOf<typeof CompoundButtonAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-comopund-button\>
 */
export declare const CompoundButtonDefinition: FASTElementDefinition<typeof CompoundButton>;

/**
 * A Compound Button can be square, circular or rounded.
 * @public
 */
export declare const CompoundButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * A Compound Button can be square, circular or rounded
 * @public
 */
export declare type CompoundButtonShape = ValuesOf<typeof CompoundButtonShape>;

/**
 * A Compound Button can be a size of small, medium or large.
 * @public
 */
export declare const CompoundButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * A Compound Button can be on of several preset sizes.
 * @public
 */
export declare type CompoundButtonSize = ValuesOf<typeof CompoundButtonSize>;

export declare const CompoundButtonStyles: ElementStyles;

/**
 * The template for the Button component.
 * @public
 */
export declare const CompoundButtonTemplate: ElementViewTemplate<CompoundButton>;

/**
 * The base class used for constructing a fluent-badge custom element
 *
 * @tag fluent-counter-badge
 *
 * @public
 */
export declare class CounterBadge extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The appearance the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance?: CounterBadgeAppearance;
    /**
     * The color the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: color
     */
    color?: CounterBadgeColor;
    /**
     * The shape the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: shape
     */
    shape?: CounterBadgeShape;
    /**
     * The size the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: CounterBadgeSize;
    /**
     * The count the badge should have.
     *
     * @public
     * @remarks
     * HTML Attribute: count
     */
    count: number;
    protected countChanged(): void;
    /**
     * Max number to be displayed
     *
     * @public
     * @remarks
     * HTML Attribute: overflow-count
     */
    overflowCount: number;
    protected overflowCountChanged(): void;
    /**
     * If the badge should be shown when count is 0
     *
     * @public
     * @remarks
     * HTML Attribute: show-zero
     */
    showZero: boolean;
    /**
     * If a dot should be displayed without the count
     *
     * @public
     * @remarks
     * HTML Attribute: dot
     */
    dot: boolean;
    /**
     * Function to set the count
     * This is the default slotted content for the counter badge
     * If children are slotted, that will override the value returned
     *
     * @internal
     */
    setCount(): string | void;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API extractor.
 * TODO: Below will be unnecessary when Badge class gets updated
 * @internal
 */
export declare interface CounterBadge extends StartEnd {
}

/**
 * CounterBadgeAppearance constants
 * @public
 */
export declare const CounterBadgeAppearance: {
    readonly filled: "filled";
    readonly ghost: "ghost";
};

/**
 * A CounterBadge can have an appearance of filled or ghost
 * @public
 */
export declare type CounterBadgeAppearance = ValuesOf<typeof CounterBadgeAppearance>;

/**
 * CounterBadgeColor constants
 * @public
 */
export declare const CounterBadgeColor: {
    readonly brand: "brand";
    readonly danger: "danger";
    readonly important: "important";
    readonly informative: "informative";
    readonly severe: "severe";
    readonly subtle: "subtle";
    readonly success: "success";
    readonly warning: "warning";
};

/**
 * A CounterBadge can be one of preset colors
 * @public
 */
export declare type CounterBadgeColor = ValuesOf<typeof CounterBadgeColor>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-counter-badge\>
 */
export declare const CounterBadgeDefinition: FASTElementDefinition<typeof CounterBadge>;

/**
 * A CounterBadge shape can be circular or rounded.
 * @public
 */
export declare const CounterBadgeShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
};

/**
 * A CounterBadge can be one of preset colors
 * @public
 */
export declare type CounterBadgeShape = ValuesOf<typeof CounterBadgeShape>;

/**
 * A CounterBadge can be square, circular or rounded.
 * @public
 */
export declare const CounterBadgeSize: {
    readonly tiny: "tiny";
    readonly extraSmall: "extra-small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
};

/**
 * A CounterBadge can be on of several preset sizes.
 * @public
 */
export declare type CounterBadgeSize = ValuesOf<typeof CounterBadgeSize>;

/** Badge styles
 * @public
 */
export declare const CounterBadgeStyles: ElementStyles;

/**
 * The template for the Counter Badge component.
 * @public
 */
export declare const CounterBadgeTemplate: ElementViewTemplate<CounterBadge>;

/**
 * Define all possible CSS display values.
 * @public
 */
declare type CSSDisplayPropertyValue = 'block' | 'contents' | 'flex' | 'grid' | 'inherit' | 'initial' | 'inline' | 'inline-block' | 'inline-flex' | 'inline-grid' | 'inline-table' | 'list-item' | 'none' | 'run-in' | 'table' | 'table-caption' | 'table-cell' | 'table-column' | 'table-column-group' | 'table-footer-group' | 'table-header-group' | 'table-row' | 'table-row-group';

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveAccelerateMax | `curveAccelerateMax`} design token.
 * @public
 */
export declare const curveAccelerateMax = "var(--curveAccelerateMax)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveAccelerateMid | `curveAccelerateMid`} design token.
 * @public
 */
export declare const curveAccelerateMid = "var(--curveAccelerateMid)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveAccelerateMin | `curveAccelerateMin`} design token.
 * @public
 */
export declare const curveAccelerateMin = "var(--curveAccelerateMin)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveDecelerateMax | `curveDecelerateMax`} design token.
 * @public
 */
export declare const curveDecelerateMax = "var(--curveDecelerateMax)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveDecelerateMid | `curveDecelerateMid`} design token.
 * @public
 */
export declare const curveDecelerateMid = "var(--curveDecelerateMid)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveDecelerateMin | `curveDecelerateMin`} design token.
 * @public
 */
export declare const curveDecelerateMin = "var(--curveDecelerateMin)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveEasyEase | `curveEasyEase`} design token.
 * @public
 */
export declare const curveEasyEase = "var(--curveEasyEase)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveEasyEaseMax | `curveEasyEaseMax`} design token.
 * @public
 */
export declare const curveEasyEaseMax = "var(--curveEasyEaseMax)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#curveLinear | `curveLinear`} design token.
 * @public
 */
export declare const curveLinear = "var(--curveLinear)";

/**
 * A Dialog Custom HTML Element.
 *
 * @tag fluent-dialog
 *
 * @public
 */
export declare class Dialog extends FASTElement {
    /**
     * The dialog element
     *
     * @public
     */
    dialog: HTMLDialogElement;
    protected dialogChanged(): void;
    /**
     * The ID of the element that describes the dialog
     *
     * @public
     */
    ariaDescribedby?: string;
    /**
     * The ID of the element that labels the dialog
     *
     * @public
     */
    ariaLabelledby?: string;
    /**
     * The label of the dialog
     *
     * @public
     */
    ariaLabel: string | null;
    /**
     * The type of the dialog modal
     *
     * @public
     */
    type: DialogType;
    protected typeChanged(prev: DialogType | undefined, next: DialogType): void;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle: () => void;
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitToggle: () => void;
    /**
     * Method to show the dialog
     *
     * @public
     */
    show(): void;
    /**
     * Method to hide the dialog
     *
     * @public
     */
    hide(): void;
    /**
     * Handles click events on the dialog overlay for light-dismiss
     *
     * @public
     * @param event - The click event
     * @returns boolean
     */
    clickHandler(event: Event): boolean;
    /**
     * Updates the internal dialog element's attributes based on its type.
     *
     * @internal
     */
    protected updateDialogAttributes(): void;
}

/**
 * Dialog Body component that extends the FASTElement class.
 *
 * @tag fluent-dialog-body
 *
 * @public
 * @extends FASTElement
 */
export declare class DialogBody extends FASTElement {
    /**
     * Handles click event for the close slot
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(event: PointerEvent): boolean | void;
}

/**
 * The Fluent Dialog Body Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-dialog-body\>
 */
export declare const DialogBodyDefinition: FASTElementDefinition<typeof DialogBody>;

/** Dialog Body styles
 * @public
 */
export declare const DialogBodyStyles: ElementStyles;

/**
 * Template for the dialog form
 * @public
 */
export declare const DialogBodyTemplate: ElementViewTemplate;

/**
 * The Fluent Dialog Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-dialog\>
 */
export declare const DialogDefinition: FASTElementDefinition<typeof Dialog>;

/** Dialog styles
 * @public
 */
export declare const DialogStyles: ElementStyles;

/**
 * Template for the Dialog component
 * @public
 */
export declare const DialogTemplate: ElementViewTemplate<Dialog>;

/**
 * Dialog modal type
 * @public
 */
export declare const DialogType: {
    readonly modal: "modal";
    readonly nonModal: "non-modal";
    readonly alert: "alert";
};

export declare type DialogType = ValuesOf<typeof DialogType>;

/**
 * Expose ltr and rtl strings
 * @public
 */
export declare const Direction: {
    readonly ltr: "ltr";
    readonly rtl: "rtl";
};

/**
 * The direction type
 * @public
 */
export declare type Direction = (typeof Direction)[keyof typeof Direction];

/**
 * Applies a CSS display property.
 * Also adds CSS rules to not display the element when the [hidden] attribute is applied to the element.
 * @param display - The CSS display property value
 * @public
 */
export declare function display(displayValue: CSSDisplayPropertyValue): string;

/**
 * A Divider Custom HTML Element.
 * Based on BaseDivider and includes style and layout specific attributes
 *
 * @tag fluent-divider
 *
 * @public
 */
export declare class Divider extends BaseDivider {
    /**
     * @public
     * @remarks
     * Determines the alignment of the content within the divider. Select from start or end. When not specified, the content will be aligned to the center.
     */
    alignContent?: DividerAlignContent;
    /**
     * @public
     * @remarks
     * A divider can have one of the preset appearances. Select from strong, brand, subtle. When not specified, the divider has its default appearance.
     */
    appearance?: DividerAppearance;
    /**
     * @public
     * @remarks
     * Adds padding to the beginning and end of the divider.
     */
    inset?: boolean;
}

/**
 * Align content within divider
 * @public
 */
export declare const DividerAlignContent: {
    readonly center: "center";
    readonly start: "start";
    readonly end: "end";
};

/**
 * The types for DividerAlignContent
 * @public
 */
export declare type DividerAlignContent = ValuesOf<typeof DividerAlignContent>;

/**
 * DividerAppearance - divider color defined by a design token alias.
 * @public
 */
export declare const DividerAppearance: {
    readonly strong: "strong";
    readonly brand: "brand";
    readonly subtle: "subtle";
};

/**
 * The types for Appearance
 * @public
 */
export declare type DividerAppearance = ValuesOf<typeof DividerAppearance>;

/**
 * The Fluent Divider Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-divider\>
 */
export declare const DividerDefinition: FASTElementDefinition<typeof Divider>;

/**
 * Divider orientation
 * @public
 */
export declare const DividerOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

/**
 * The types for Divider orientation
 * @public
 */
export declare type DividerOrientation = ValuesOf<typeof DividerOrientation>;

/**
 * Divider roles
 * @public
 */
export declare const DividerRole: {
    /**
     * The divider semantically separates content
     */
    readonly separator: "separator";
    /**
     * The divider has no semantic value and is for visual presentation only.
     */
    readonly presentation: "presentation";
};

/**
 * The types for Divider roles
 * @public
 */
export declare type DividerRole = ValuesOf<typeof DividerRole>;

/** Divider styles
 * @public
 */
export declare const DividerStyles: ElementStyles;

/**
 * Template for the Divider component
 * @public
 */
export declare const DividerTemplate: ElementViewTemplate<Divider>;

/**
 * A Drawer component that allows content to be displayed in a side panel. It can be rendered as modal or non-modal.
 *
 * @tag fluent-drawer
 *
 * @extends FASTElement
 *
 * @attr type - Determines whether the drawer should be displayed as modal, non-modal, or alert.
 * @attr position - Sets the position of the drawer (start/end).
 * @attr size - Sets the size of the drawer (small/medium/large).
 * @attr ariaDescribedby - The ID of the element that describes the drawer.
 * @attr ariaLabelledby - The ID of the element that labels the drawer.
 *
 * @csspart dialog - The dialog element of the drawer.
 *
 * @slot - Default slot for the content of the drawer.
 *
 * @fires toggle - Event emitted after the dialog's open state changes.
 * @fires beforetoggle - Event emitted before the dialog's open state changes.
 *
 * @method show - Method to show the drawer.
 * @method hide - Method to hide the drawer.
 * @method clickHandler - Handles click events on the drawer.
 * @method cancelHandler - Handles cancel events on the drawer.
 * @method emitToggle - Emits an event after the dialog's open state changes.
 * @method emitBeforeToggle - Emits an event before the dialog's open state changes.
 *
 * @summary A component that provides a drawer for displaying content in a side panel.
 *
 * @tag fluent-drawer
 */
export declare class Drawer extends FASTElement {
    protected roleAttrObserver: MutationObserver;
    /**
     * Determines whether the drawer should be displayed as modal or non-modal
     * When rendered as a modal, an overlay is applied over the rest of the view.
     *
     * @public
     */
    type: DrawerType;
    protected typeChanged(): void;
    /**
     * The ID of the element that labels the drawer.
     *
     * @public
     */
    ariaLabelledby?: string;
    /**
     * The ID of the element that describes the drawer.
     *
     * @public
     */
    ariaDescribedby?: string;
    /**
     * Sets the position of the drawer (start/end).
     *
     * @public
     * @defaultValue start
     */
    position: DrawerPosition;
    /**
     * @public
     * @defaultValue medium
     * Sets the size of the drawer (small/medium/large).
     */
    size: DrawerSize;
    /**
     * The dialog element.
     *
     * @public
     */
    dialog: HTMLDialogElement;
    /** @internal */
    connectedCallback(): void;
    /** @internal */
    disconnectedCallback(): void;
    /**
     * Method to emit an event after the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitToggle: () => void;
    /**
     * Method to emit an event before the dialog's open state changes
     * HTML spec proposal: https://github.com/whatwg/html/issues/9733
     *
     * @public
     */
    emitBeforeToggle: () => void;
    /**
     * Method to show the drawer
     *
     * @public
     */
    show(): void;
    /**
     * Method to hide the drawer
     *
     * @public
     */
    hide(): void;
    /**
     * @public
     * @param event - The click event
     * @returns boolean - Always returns true
     * Handles click events on the drawer.
     */
    clickHandler(event: Event): boolean;
    /**
     * Handles cancel events on the drawer.
     *
     * @public
     */
    cancelHandler(): void;
    protected observeRoleAttr(): void;
    protected updateDialogRole(): void;
}

/**
 * A DrawerBody component to layout drawer content
 *
 * @tag fluent-drawer-body
 *
 * @extends FASTElement
 *
 * @slot title - The title slot
 * @slot close - The close button slot
 * @slot - The default content slot
 * @slot footer - The footer slot
 *
 * @csspart header - The header part of the drawer
 * @csspart content - The content part of the drawer
 * @csspart footer - The footer part of the drawer
 *
 * @summary A component that provides a drawer body for displaying content in a side panel.
 *
 * @tag fluent-drawer-body
 */
export declare class DrawerBody extends FASTElement {
    /**
     * Handles click event for the close slot
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(event: PointerEvent): boolean | void;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-drawer>
 */
export declare const DrawerBodyDefinition: FASTElementDefinition<typeof DrawerBody>;

/** Drawer styles
 * @public
 */
export declare const DrawerBodyStyles: ElementStyles;

export declare const DrawerBodyTemplate: ElementViewTemplate<DrawerBody>;

/**
 *
 * @public
 * @remarks
 * HTML Element: <fluent-drawer>
 */
export declare const DrawerDefinition: FASTElementDefinition<typeof Drawer>;

/**
 * A drawer can be positioned on the left or right side of the viewport.
 */
export declare const DrawerPosition: {
    readonly start: "start";
    readonly end: "end";
};

/**
 * The position of the drawer.
 * @public
 */
export declare type DrawerPosition = ValuesOf<typeof DrawerPosition>;

/**
 * A drawer can be different sizes
 */
export declare const DrawerSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly full: "full";
};

/**
 * The size of the drawer.
 * @public
 */
export declare type DrawerSize = ValuesOf<typeof DrawerSize>;

/** Drawer styles
 * @public
 */
export declare const DrawerStyles: ElementStyles;

export declare const DrawerTemplate: ElementViewTemplate<Drawer>;

/**
 * A drawer can be different sizes
 */
export declare const DrawerType: {
    readonly nonModal: "non-modal";
    readonly modal: "modal";
    readonly inline: "inline";
};

/**
 * The size of the drawer.
 * @public
 */
export declare type DrawerType = ValuesOf<typeof DrawerType>;

/**
 * The Fluent Dropdown Element. Implements {@link @microsoft/fast-foundation#BaseDropdown}.
 *
 * @tag fluent-dropdown
 *
 * @slot - The default slot. Accepts a {@link (Listbox:class)} element.
 * @slot indicator - The indicator slot.
 * @slot control - The control slot. This slot is automatically populated and should not be manually manipulated.
 *
 * @public
 */
export declare class Dropdown extends BaseDropdown {
    /**
     * The appearance of the dropdown.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance: DropdownAppearance;
    /**
     * The size of the dropdown.
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: DropdownSize;
}

/**
 * Values for the `appearance` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownAppearance: {
    filledDarker: string;
    filledLighter: string;
    outline: string;
    transparent: string;
};

/** @public */
export declare type DropdownAppearance = ValuesOf<typeof DropdownAppearance>;

/**
 * The template partial for the dropdown button element. This template is used when the `type` property is set to "dropdown".
 *
 * @public
 * @remarks
 * Since the button element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export declare const dropdownButtonTemplate: ViewTemplate<BaseDropdown, any>;

/**
 * The Fluent Dropdown Element.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-dropdown>`
 */
export declare const DropdownDefinition: FASTElementDefinition<typeof Dropdown>;

/**
 * The template partial for the dropdown input element. This template is used when the `type` property is set to "combobox".
 *
 * @public
 * @remarks
 * Since the input element must be present in the light DOM for ARIA to function correctly, this template should not be
 * overridden.
 * @see {@link BaseDropdown.insertControl}
 */
export declare const dropdownInputTemplate: ViewTemplate<BaseDropdown, any>;

/**
 * A DropdownOption Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#option | ARIA option } role.
 *
 * @tag fluent-dropdown-option
 *
 * @slot - The default slot for the option's content.
 * @slot checked-indicator - The checked indicator.
 * @slot description - Optional description content.
 *
 * @remarks
 * To support single and multiple selection modes with the {@link (BaseDropdown:class)} element, the Option element
 * itself handles form association and value submission, rather than its parent Dropdown element. In this way, the
 * Option element is a variation of the Checkbox element that is specifically designed for use in the Dropdown element.
 *
 * This class is named `DropdownOption` to avoid conflicts with the native `Option` global. Related constructs are also
 * titled with `DropdownOption` to maintain consistency.
 *
 * @public
 */
export declare class DropdownOption extends FASTElement implements Start {
    /**
     * Indicates that the option is active.
     *
     * @public
     */
    active: boolean;
    /**
     * Changes the active state of the option when the active property changes.
     *
     * @param prev - the previous active state
     * @param next - the current active state
     * @internal
     */
    protected activeChanged(prev: boolean, next: boolean): void;
    /**
     * The current selected state of the option.
     *
     * @internal
     */
    currentSelected?: boolean;
    /**
     * Sets the selected property to match the currentSelected state.
     *
     * @param prev - the previous selected state
     * @param next - the current selected state
     * @internal
     */
    currentSelectedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial selected state of the option.
     *
     * @public
     * @remarks
     * HTML Attribute: `checked`
     */
    defaultSelected?: boolean;
    /**
     * Updates the selected state when the `selected` attribute is changed, unless the selected state has been changed by the user.
     *
     * @param prev - The previous initial selected state
     * @param next - The current initial selected state
     * @internal
     */
    protected defaultSelectedChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The collection of slotted description elements.
     *
     * @internal
     */
    descriptionSlot: Node[];
    /**
     * Changes the description state of the option when the description slot changes.
     *
     * @param prev - the previous collection of description elements
     * @param next - the current collection of description elements
     * @internal
     */
    descriptionSlotChanged(prev: Node[] | undefined, next: Node[] | undefined): void;
    /**
     * The current disabled state of the option.
     *
     * @public
     */
    disabled?: boolean;
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    protected disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The initial disabled state of the option.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    disabledAttribute?: boolean;
    /**
     * Sets the disabled state when the `disabled` attribute changes.
     *
     * @param prev - the previous value
     * @param next - the current value
     * @internal
     */
    protected disabledAttributeChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The id of a form to associate the element to.
     * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Element/input#form | `form`} attribute
     *
     * @public
     * @remarks
     * HTML Attribute: `form`
     */
    formAttribute?: string;
    /**
     * Indicates that the option value should sync with the value of the dropdown's control.
     *
     * @public
     * @remarks
     * HTML Attribute: `freeform`
     */
    freeform?: boolean;
    /**
     * The id of the option. If not provided, a unique id will be assigned.
     *
     * @override
     * @public
     * @remarks
     * HTML Attribute: `id`
     */
    id: string;
    /**
     * The initial value of the option.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    initialValue: string;
    /**
     * Sets the value of the option when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    protected initialValueChanged(prev: string, next: string): void;
    /**
     * Indicates that the option is in a multiple selection mode context.
     * @public
     */
    multiple: boolean;
    /**
     * Updates the multiple state of the option when the multiple property changes.
     *
     * @param prev - the previous multiple state
     * @param next - the current multiple state
     */
    multipleChanged(prev: boolean, next: boolean): void;
    /**
     * The name of the option. This option's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    name: string;
    /**
     * Reference to the start slot element.
     *
     * @internal
     */
    start: HTMLSlotElement;
    /**
     * The text to display in the dropdown control when the option is selected.
     *
     * @public
     * @remarks
     * HTML Attribute: `text`
     */
    textAttribute?: string;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form(): HTMLFormElement | null;
    /**
     * The collection of slotted `output` elements, used to display the value when the option is freeform.
     *
     * @internal
     */
    freeformOutputs?: HTMLOutputElement[];
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
    get labels(): ReadonlyArray<HTMLLabelElement>;
    /**
     * The option's current selected state.
     *
     * @public
     */
    get selected(): boolean;
    set selected(next: boolean);
    /**
     * The display text of the option.
     *
     * @public
     * @remarks
     * When the option is freeform, the text is the value of the option.
     */
    get text(): string;
    /**
     * The internal value of the option.
     *
     * @internal
     */
    private _value;
    /**
     * The current value of the option.
     *
     * @public
     */
    get value(): string;
    set value(value: string);
    connectedCallback(): void;
    constructor();
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value: File | string | FormData | null, state?: File | string | FormData | null): void;
    /**
     * Toggles the selected state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleSelected(force?: boolean): void;
}

/**
 * The Fluent Option Element.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-option>`
 */
export declare const DropdownOptionDefinition: FASTElementDefinition<typeof DropdownOption>;

/**
 * The options for the {@link DropdownOption} component.
 *
 * @public
 */
export declare type DropdownOptionOptions = StartOptions<DropdownOption> & {
    checkedIndicator?: StaticallyComposableHTML<DropdownOption>;
};

/**
 * Template options for the {@link (Dropdown:class)} component.
 * @public
 */
export declare type DropdownOptions = {
    indicator?: StaticallyComposableHTML<BaseDropdown>;
};

/**
 * Styles for the {@link (DropdownOption:class)} component.
 *
 * @public
 */
export declare const DropdownOptionStyles: ElementStyles;

/**
 * Template for the Option component.
 * @public
 */
export declare const DropdownOptionTemplate: ElementViewTemplate<DropdownOption>;

/**
 * Values for the `size` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/** @public */
export declare type DropdownSize = ValuesOf<typeof DropdownSize>;

/**
 * Styles for the {@link (Dropdown:class)} component.
 *
 * @public
 */
export declare const DropdownStyles: ElementStyles;

/**
 * Template for the Dropdown component.
 *
 * @public
 */
export declare const DropdownTemplate: ElementViewTemplate<BaseDropdown>;

/**
 * Values  for the `type` attribute of the {@link (Dropdown:class)} component.
 * @public
 */
export declare const DropdownType: {
    readonly combobox: "combobox";
    readonly dropdown: "dropdown";
    readonly select: "select";
};

/** @public */
export declare type DropdownType = ValuesOf<typeof DropdownType>;

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationFast | `durationFast`} design token.
 * @public
 */
export declare const durationFast = "var(--durationFast)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationFaster | `durationFaster`} design token.
 * @public
 */
export declare const durationFaster = "var(--durationFaster)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationGentle | `durationGentle`} design token.
 * @public
 */
export declare const durationGentle = "var(--durationGentle)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationNormal | `durationNormal`} design token.
 * @public
 */
export declare const durationNormal = "var(--durationNormal)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationSlow | `durationSlow`} design token.
 * @public
 */
export declare const durationSlow = "var(--durationSlow)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationSlower | `durationSlower`} design token.
 * @public
 */
export declare const durationSlower = "var(--durationSlower)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationUltraFast | `durationUltraFast`} design token.
 * @public
 */
export declare const durationUltraFast = "var(--durationUltraFast)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#durationUltraSlow | `durationUltraSlow`} design token.
 * @public
 */
export declare const durationUltraSlow = "var(--durationUltraSlow)";

/**
 * A mixin class implementing end slots.
 * @public
 */
declare class End {
    end: HTMLSlotElement;
}

/**
 * End configuration options
 * @public
 */
export declare type EndOptions<TSource = any, TParent = any> = {
    end?: StaticallyComposableHTML<TSource, TParent>;
};

/**
 * The template for the end slot.
 * For use with {@link StartEnd}
 *
 * @public
 */
export declare function endSlotTemplate<TSource extends StartEnd = StartEnd, TParent = any>(options: EndOptions<TSource, TParent>): CaptureType<TSource, TParent>;

/**
 * A Field Custom HTML Element.
 * Based on BaseField and includes style and layout specific attributes
 *
 * @tag fluent-field
 *
 * @public
 */
export declare class Field extends BaseField {
    /**
     * The position of the label relative to the input.
     *
     * @public
     * @remarks
     * HTML Attribute: `label-position`
     */
    labelPosition: FieldLabelPosition;
}

/**
 * The Fluent Field Element
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-field>`
 */
export declare const FieldDefinition: FASTElementDefinition<typeof Field>;

/**
 * Label position values
 * @public
 */
export declare const FieldLabelPosition: {
    readonly above: "above";
    readonly after: "after";
    readonly before: "before";
};

/** @public */
export declare type FieldLabelPosition = ValuesOf<typeof FieldLabelPosition>;

/**
 * The styles for the {@link Field} component.
 *
 * @public
 */
export declare const FieldStyles: ElementStyles;

/**
 * Template for the Field component
 * @public
 */
export declare const FieldTemplate: ElementViewTemplate;

export declare const FluentDesignSystem: Readonly<{
    prefix: "fluent";
    shadowRootMode: "open";
    registry: CustomElementRegistry;
}>;

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontFamilyBase | `fontFamilyBase`} design token.
 * @public
 */
export declare const fontFamilyBase = "var(--fontFamilyBase)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontFamilyMonospace | `fontFamilyMonospace`} design token.
 * @public
 */
export declare const fontFamilyMonospace = "var(--fontFamilyMonospace)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontFamilyNumeric | `fontFamilyNumeric`} design token.
 * @public
 */
export declare const fontFamilyNumeric = "var(--fontFamilyNumeric)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase100 | `fontSizeBase100`} design token.
 * @public
 */
export declare const fontSizeBase100 = "var(--fontSizeBase100)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase200 | `fontSizeBase200`} design token.
 * @public
 */
export declare const fontSizeBase200 = "var(--fontSizeBase200)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase300 | `fontSizeBase300`} design token.
 * @public
 */
export declare const fontSizeBase300 = "var(--fontSizeBase300)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase400 | `fontSizeBase400`} design token.
 * @public
 */
export declare const fontSizeBase400 = "var(--fontSizeBase400)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase500 | `fontSizeBase500`} design token.
 * @public
 */
export declare const fontSizeBase500 = "var(--fontSizeBase500)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase600 | `fontSizeBase600`} design token.
 * @public
 */
export declare const fontSizeBase600 = "var(--fontSizeBase600)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeHero1000 | `fontSizeHero1000`} design token.
 * @public
 */
export declare const fontSizeHero1000 = "var(--fontSizeHero1000)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeHero700 | `fontSizeHero700`} design token.
 * @public
 */
export declare const fontSizeHero700 = "var(--fontSizeHero700)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeHero800 | `fontSizeHero800`} design token.
 * @public
 */
export declare const fontSizeHero800 = "var(--fontSizeHero800)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeHero900 | `fontSizeHero900`} design token.
 * @public
 */
export declare const fontSizeHero900 = "var(--fontSizeHero900)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightBold | `fontWeightBold`} design token.
 * @public
 */
export declare const fontWeightBold = "var(--fontWeightBold)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightMedium | `fontWeightMedium`} design token.
 * @public
 */
export declare const fontWeightMedium = "var(--fontWeightMedium)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightRegular | `fontWeightRegular`} design token.
 * @public
 */
export declare const fontWeightRegular = "var(--fontWeightRegular)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightSemibold | `fontWeightSemibold`} design token.
 * @public
 */
export declare const fontWeightSemibold = "var(--fontWeightSemibold)";

/**
 * Determines the current localization direction of an element.
 *
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @returns the localization direction of the element
 *
 * @public
 */
export declare const getDirection: (rootNode: HTMLElement) => Direction;

/**
 * The base class used for constucting a fluent image custom element
 *
 * @tag fluent-image
 *
 * @public
 */
declare class Image_2 extends FASTElement {
    /**
     * Image layout
     *
     * @public
     * @remarks
     * HTML attribute: block.
     */
    block?: boolean;
    /**
     * Image border
     *
     * @public
     * @remarks
     * HTML attribute: border.
     */
    bordered?: boolean;
    /**
     * Image shadow
     *
     * @public
     * @remarks
     * HTML attribute: shadow.
     */
    shadow?: boolean;
    /**
     * Image fit
     *
     * @public
     * @remarks
     * HTML attribute: fit.
     */
    fit?: ImageFit;
    /**
     * Image shape
     *
     * @public
     * @remarks
     * HTML attribute: shape.
     */
    shape?: ImageShape;
}
export { Image_2 as Image }

/**
 * The Fluent Image Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-image\>
 */
export declare const ImageDefinition: FASTElementDefinition<typeof Image_2>;

/**
 * Image fit
 * @public
 */
export declare const ImageFit: {
    readonly none: "none";
    readonly center: "center";
    readonly contain: "contain";
    readonly cover: "cover";
};

/**
 * Types for image fit
 * @public
 */
export declare type ImageFit = ValuesOf<typeof ImageFit>;

/**
 * Image shape
 * @public
 */
export declare const ImageShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

export declare type ImageShape = ValuesOf<typeof ImageShape>;

/** Image styles
 *
 * @public
 */
export declare const ImageStyles: ElementStyles;

/**
 * Template for the Image component
 * @public
 */
export declare const ImageTemplate: ElementViewTemplate<Image_2>;

/**
 * Predicate function that determines if the element should be considered a dialog.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dialog.
 * @public
 */
export declare function isDialog(element?: Node | null, tagName?: string): element is Dialog;

/**
 * Predicate function that determines if the element should be considered a dropdown.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export declare function isDropdown(element?: Node | null, tagName?: string): element is BaseDropdown;

/**
 * Predicate function that determines if the element should be considered an option.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is an option.
 * @public
 */
export declare function isDropdownOption(value: Node | null, tagName?: string): value is DropdownOption;

/**
 * Predicate function that determines if the element should be considered a listbox.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a listbox.
 * @public
 */
export declare function isListbox(element?: Node | null, tagName?: string): element is Listbox;

/**
 * Predicate function that determines if the element should be considered a tab.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a tab.
 * @public
 */
export declare function isTab(element?: Node | null, tagName?: string): element is Tab;

/**
 * Predicate function that determines if the element should be considered an tree-item.
 *
 * @param element - The element to check.
 * @param tagName - The tag name to check.
 * @returns true if the element is a dropdown.
 * @public
 */
export declare function isTreeItem(element?: Node | null, tagName?: string): element is BaseTreeItem;

/**
 * The base class used for constructing a fluent-label custom element
 *
 * @tag fluent-label
 *
 * @public
 */
export declare class Label extends FASTElement {
    /**
     * 	Specifies font size of a label
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: LabelSize;
    /**
     * 	Specifies font weight of a label
     *
     * @public
     * @remarks
     * HTML Attribute: weight
     */
    weight?: LabelWeight;
    /**
     * 	Specifies styles for label when associated input is disabled
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * 	Specifies styles for label when associated input is a required field
     *
     * @public
     * @remarks
     * HTML Attribute: required
     */
    required: boolean;
}

/**
 * The Fluent Label Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-label\>
 */
export declare const LabelDefinition: FASTElementDefinition<typeof Label>;

/**
 * A Labels font size can be small, medium, or large
 */
export declare const LabelSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * Applies font size to label
 * @public
 */
export declare type LabelSize = ValuesOf<typeof LabelSize>;

/** Label styles
 * @public
 */
export declare const LabelStyles: ElementStyles;

export declare const LabelTemplate: ElementViewTemplate<Label>;

/**
 * A label can have a font weight of regular or strong
 */
export declare const LabelWeight: {
    readonly regular: "regular";
    readonly semibold: "semibold";
};

/**
 * Applies font weight to label
 * @public
 */
export declare type LabelWeight = ValuesOf<typeof LabelWeight>;

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase100 | `lineHeightBase100`} design token.
 * @public
 */
export declare const lineHeightBase100 = "var(--lineHeightBase100)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase200 | `lineHeightBase200`} design token.
 * @public
 */
export declare const lineHeightBase200 = "var(--lineHeightBase200)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase300 | `lineHeightBase300`} design token.
 * @public
 */
export declare const lineHeightBase300 = "var(--lineHeightBase300)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase400 | `lineHeightBase400`} design token.
 * @public
 */
export declare const lineHeightBase400 = "var(--lineHeightBase400)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase500 | `lineHeightBase500`} design token.
 * @public
 */
export declare const lineHeightBase500 = "var(--lineHeightBase500)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase600 | `lineHeightBase600`} design token.
 * @public
 */
export declare const lineHeightBase600 = "var(--lineHeightBase600)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightHero1000 | `lineHeightHero1000`} design token.
 * @public
 */
export declare const lineHeightHero1000 = "var(--lineHeightHero1000)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightHero700 | `lineHeightHero700`} design token.
 * @public
 */
export declare const lineHeightHero700 = "var(--lineHeightHero700)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightHero800 | `lineHeightHero800`} design token.
 * @public
 */
export declare const lineHeightHero800 = "var(--lineHeightHero800)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightHero900 | `lineHeightHero900`} design token.
 * @public
 */
export declare const lineHeightHero900 = "var(--lineHeightHero900)";

/**
 * An Anchor Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a | <a> element }.
 *
 * @tag fluent-link
 *
 * @slot start - Content which can be provided before the link content
 * @slot end - Content which can be provided after the link content
 * @slot - The default slot for link content
 *
 * @public
 */
export declare class Link extends BaseAnchor {
    /**
     * The appearance the link should have.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: LinkAppearance | undefined;
    /**
     * The link is inline with text
     * In chromium browsers, if the link is contained within a semantic
     * text element (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`) or `fluent-text`,
     * `:host-context()` ensures inline links are styled appropriately.
     *
     * @public
     * @remarks
     * HTML Attribute: `inline`
     */
    inline: boolean;
}

/**
 * Link Appearance constants
 * @public
 */
export declare const LinkAppearance: {
    readonly subtle: "subtle";
};

/**
 * An Link can be subtle or the default appearance
 * @public
 */
export declare type LinkAppearance = ValuesOf<typeof LinkAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-link\>
 */
export declare const LinkDefinition: FASTElementDefinition<typeof Link>;

export declare const LinkStyles: ElementStyles;

/**
 * Link target values.
 *
 * @public
 */
export declare const LinkTarget: {
    readonly _self: "_self";
    readonly _blank: "_blank";
    readonly _parent: "_parent";
    readonly _top: "_top";
};

/**
 * Type for link target values.
 *
 * @public
 */
export declare type LinkTarget = ValuesOf<typeof AnchorTarget>;

/**
 * The template for the Link component.
 * @public
 */
export declare const LinkTemplate: ElementViewTemplate<Link>;

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox } role.
 *
 * @tag fluent-listbox
 *
 * @slot - The default slot for the options.
 *
 * @remarks
 * The listbox component represents a list of options that can be selected.
 * It is intended to be used in conjunction with the {@link BaseDropdown | Dropdown} component.
 *
 * @public
 */
export declare class Listbox extends FASTElement {
    /**
     * A reference to the default slot element.
     *
     * @internal
     */
    defaultSlot: HTMLSlotElement;
    /**
     * Calls the `slotchangeHandler` when the `defaultSlot` element is assigned
     * via the `ref` directive in the template.
     *
     * @internal
     */
    protected defaultSlotChanged(): void;
    /**
     * Indicates whether the listbox allows multiple selection.
     *
     * @public
     */
    multiple?: boolean;
    /**
     * Updates the multiple selection state of the listbox and its options.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     */
    multipleChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The collection of all child options.
     *
     * @public
     */
    options: DropdownOption[];
    /**
     * Updates the enabled options collection when properties on the child options change.
     *
     * @param prev - the previous options
     * @param next - the current options
     *
     * @internal
     */
    optionsChanged(prev: DropdownOption[] | undefined, next: DropdownOption[] | undefined): void;
    /**
     * The index of the first selected and enabled option.
     * @internal
     */
    selectedIndex: number;
    /**
     * Reference to the parent dropdown element.
     * @internal
     */
    dropdown?: BaseDropdown;
    /**
     * Handles the `beforetoggle` event on the listbox.
     *
     * @param e - the toggle event
     * @returns true to allow the default popover behavior, undefined to prevent it
     * @internal
     */
    beforetoggleHandler(e: ToggleEvent): boolean | undefined;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The collection of child options that are not disabled.
     *
     * @internal
     */
    get enabledOptions(): DropdownOption[];
    /**
     * The collection of child options that are selected.
     *
     * @public
     */
    get selectedOptions(): DropdownOption[];
    /**
     * Sets the `selected` state on a target option when clicked.
     *
     * @param e - The pointer event
     * @public
     */
    clickHandler(e: PointerEvent): boolean | void;
    constructor();
    connectedCallback(): void;
    /**
     * Handles observable subscriptions for the listbox.
     *
     * @param source - The source of the observed change
     * @param propertyName - The name of the property that changed
     *
     * @internal
     */
    handleChange(source: any, propertyName?: string): void;
    /**
     * Selects an option by index.
     *
     * @param index - The index of the option to select.
     * @public
     */
    selectOption(index?: number): void;
    /**
     * Handles the `slotchange` event for the default slot.
     * Sets the `options` property to the list of slotted options.
     *
     * @param e - The slotchange event
     * @public
     */
    slotchangeHandler(e?: Event): void;
}

/**
 * The Fluent Listbox Element
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-listbox>`
 */
export declare const ListboxDefinition: FASTElementDefinition<typeof Listbox>;

/**
 * Styles for the {@link (Listbox:class)} component.
 *
 * @public
 */
export declare const ListboxStyles: ElementStyles;

/**
 * Template for the Listbox component.
 *
 * @public
 */
export declare const ListboxTemplate: ElementViewTemplate<Listbox>;

/**
 * Generates a template for the {@link (Dropdown:class)} component.
 *
 * @returns The template object.
 *
 * @public
 */
export declare function listboxTemplate<T extends Listbox>(): ElementViewTemplate<T>;

/**
 * A Menu component that provides a customizable menu element.
 *
 * @tag fluent-menu
 *
 * @class Menu
 * @extends FASTElement
 *
 * @attr open-on-hover - Determines if the menu should open on hover.
 * @attr open-on-context - Determines if the menu should open on right click.
 * @attr close-on-scroll - Determines if the menu should close on scroll.
 * @attr persist-on-item-click - Determines if the menu open state should persist on click of menu item.
 * @attr split - Determines if the menu is in split state.
 *
 * @cssproperty --menu-max-height - The max-height of the menu.
 *
 * @slot primary-action - Slot for the primary action elements. Used when in `split` state.
 * @slot trigger - Slot for the trigger elements.
 * @slot - Default slot for the menu list.
 *
 * @method connectedCallback - Called when the element is connected to the DOM. Sets up the component.
 * @method disconnectedCallback - Called when the element is disconnected from the DOM. Removes event listeners.
 * @method setComponent - Sets the component state.
 * @method toggleMenu - Toggles the open state of the menu.
 * @method closeMenu - Closes the menu.
 * @method openMenu - Opens the menu.
 * @method focusMenuList - Focuses on the menu list.
 * @method focusTrigger - Focuses on the menu trigger.
 * @method openOnHoverChanged - Called whenever the 'openOnHover' property changes.
 * @method persistOnItemClickChanged - Called whenever the 'persistOnItemClick' property changes.
 * @method openOnContextChanged - Called whenever the 'openOnContext' property changes.
 * @method closeOnScrollChanged - Called whenever the 'closeOnScroll' property changes.
 * @method addListeners - Adds event listeners.
 * @method removeListeners - Removes event listeners.
 * @method menuKeydownHandler - Handles keyboard interaction for the menu.
 * @method triggerKeydownHandler - Handles keyboard interaction for the trigger.
 * @method documentClickHandler - Handles document click events to close the menu when a click occurs outside of the menu or the trigger.
 *
 * @summary The Menu component functions as a customizable menu element.
 *
 * @tag fluent-menu
 *
 * @public
 */
export declare class Menu extends FASTElement {
    /**
     * Determines if the menu should open on hover.
     * @public
     */
    openOnHover?: boolean;
    /**
     * Determines if the menu should open on right click.
     * @public
     */
    openOnContext?: boolean;
    /**
     * Determines if the menu should close on scroll.
     * @public
     */
    closeOnScroll?: boolean;
    /**
     * Determines if the menu open state should persis on click of menu item
     * @public
     */
    persistOnItemClick?: boolean;
    /**
     * Determines if the menu is in split state.
     * @public
     */
    split?: boolean;
    /**
     * Holds the slotted menu list.
     * @public
     */
    slottedMenuList: HTMLElement[];
    /**
     * Sets up the component when the slotted menu list changes.
     * @param prev - The previous items in the slotted menu list.
     * @param next - The new items in the slotted menu list.
     * @internal
     */
    slottedMenuListChanged(prev: HTMLElement[] | undefined, next: HTMLElement[] | undefined): void;
    /**
     * Holds the slotted triggers.
     * @public
     */
    slottedTriggers: HTMLElement[];
    /**
     * Ensures the trigger is properly set up when the slotted triggers change.
     * This includes setting ARIA attributes and adding event listeners based on the current property values.
     *
     * @param prev - The previous items in the slotted triggers list.
     * @param next - The current items in the slotted triggers list.
     * @internal
     */
    slottedTriggersChanged(prev: HTMLElement[] | undefined, next: HTMLElement[] | undefined): void;
    /**
     * Holds the primary slot element.
     * @public
     */
    primaryAction: HTMLSlotElement;
    /**
     * Defines whether the menu is open or not.
     * @internal
     */
    private _open;
    /**
     * The trigger element of the menu.
     * @internal
     */
    private _trigger?;
    /**
     * The menu list element of the menu which has the popover behavior.
     * @internal
     */
    private _menuList?;
    /**
     * @internal
     */
    private _triggerAbortController?;
    /**
     * @internal
     */
    private _menuListAbortController?;
    /**
     * Called when the element is connected to the DOM.
     * Sets up the component.
     * @public
     */
    connectedCallback(): void;
    /**
     * Called when the element is disconnected from the DOM.
     * Removes event listeners.
     * @public
     */
    disconnectedCallback(): void;
    /**
     * Sets the component.
     * @deprecated This method is no longer used. Trigger and menu-list listeners are now
     * managed by their respective slot-changed callbacks.
     * @public
     */
    setComponent(): void;
    /**
     * Toggles the open state of the menu.
     * @public
     */
    toggleMenu: () => void;
    /**
     * Closes the menu.
     * @public
     */
    closeMenu: (event?: Event) => void;
    /**
     * Opens the menu.
     * @public
     */
    openMenu: (e?: Event) => void;
    /**
     * Focuses on the menu list.
     * @public
     */
    focusMenuList(): void;
    /**
     * Focuses on the menu trigger.
     * @public
     */
    focusTrigger(): void;
    /**
     * Handles the 'toggle' event on the popover.
     * @public
     * @param e - the event
     * @returns void
     */
    toggleHandler: (e: Event) => void;
    /**
     * Called whenever the 'openOnHover' property changes.
     * Adds or removes a 'mouseover' event listener to the trigger based on the new value.
     *
     * @param oldValue - The previous value of 'openOnHover'.
     * @param newValue - The new value of 'openOnHover'.
     * @public
     */
    openOnHoverChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Called whenever the 'persistOnItemClick' property changes.
     * Adds or removes a 'click' event listener to the menu list based on the new value.
     * @public
     * @param oldValue - The previous value of 'persistOnItemClick'.
     * @param newValue - The new value of 'persistOnItemClick'.
     */
    persistOnItemClickChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Called whenever the 'openOnContext' property changes.
     * Adds or removes a 'contextmenu' event listener to the trigger based on the new value.
     * @public
     * @param oldValue - The previous value of 'openOnContext'.
     * @param newValue - The new value of 'openOnContext'.
     */
    openOnContextChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Called whenever the 'closeOnScroll' property changes.
     * Adds or removes a 'closeOnScroll' event listener to the trigger based on the new value.
     * @public
     * @param oldValue - The previous value of 'closeOnScroll'.
     * @param newValue - The new value of 'closeOnScroll'.
     */
    closeOnScrollChanged(oldValue: boolean, newValue: boolean): void;
    /**
     * Adds trigger-related event listeners.
     * @internal
     */
    private addTriggerListeners;
    /**
     * Adds menu-list event listeners.
     * @internal
     */
    private addMenuListListeners;
    /**
     * Handles keyboard interaction for the menu. Closes the menu and focuses on the trigger when the Escape key is
     * pressed. Closes the menu when the Tab key is pressed.
     *
     * @param e - the keyboard event
     * @public
     */
    menuKeydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Handles keyboard interaction for the trigger. Toggles the menu when the Space or Enter key is pressed. If the menu
     * is open, focuses on the menu list.
     *
     * @param e - the keyboard event
     * @public
     */
    triggerKeydownHandler: (e: KeyboardEvent) => boolean | void;
    /**
     * Handles document click events to close a menu opened with contextmenu in popover="manual" mode.
     * @internal
     * @param e - The event triggered on document click.
     */
    private documentClickHandler;
}

/**
 * The base class used for constructing a fluent-menu-button custom element
 *
 * @tag fluent-menu-button
 *
 * @public
 */
export declare class MenuButton extends Button {
}

/**
 * Menu Button Appearance constants
 * @public
 */
export declare const MenuButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * A Menu Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export declare type MenuButtonAppearance = ValuesOf<typeof MenuButtonAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-button\>
 */
export declare const MenuButtonDefinition: FASTElementDefinition<typeof MenuButton>;

/**
 * A Menu Button can be square, circular or rounded.
 * @public
 */
export declare const MenuButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * A Menu Button can be square, circular or rounded
 * @public
 */
export declare type MenuButtonShape = ValuesOf<typeof MenuButtonShape>;

/**
 * A Menu Button can be a size of small, medium or large.
 * @public
 */
export declare const MenuButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * A Menu Button can be on of several preset sizes.
 * @public
 */
export declare type MenuButtonSize = ValuesOf<typeof MenuButtonSize>;

/**
 * The template for the Button component.
 * @public
 */
export declare const MenuButtonTemplate: ElementViewTemplate<MenuButton>;

/**
 * The Fluent Menu Element.
 *
 * @public
 * @remarks
 * HTML Element: <fluent-menu>
 */
export declare const MenuDefinition: FASTElementDefinition<typeof Menu>;

/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @tag fluent-menu-item
 *
 * @slot indicator - The checkbox or radio indicator
 * @slot start - Content which can be provided before the menu item content
 * @slot - The default slot for menu item content
 * @slot end - Content which can be provided after the menu item content
 * @slot submenu-glyph - The submenu expand/collapse indicator
 * @slot submenu - Used to nest menu's within menu items
 * @csspart content - The element wrapping the menu item content
 * @fires change - Fires a custom 'change' event when a non-submenu item with a role of `menuitemcheckbox`, `menuitemradio`, or `menuitem` is invoked
 *
 * @public
 */
export declare class MenuItem extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The disabled state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * Handles changes to disabled attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: MenuItemRole;
    /**
     * Handles changes to role attribute element internals properties
     * @param prev - the previous state
     * @param next - the next state
     */
    roleChanged(prev: MenuItemRole | undefined, next: MenuItemRole | undefined): void;
    /**
     * The checked value of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    checked: boolean;
    /**
     * Handles changes to checked attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    protected checkedChanged(prev: boolean, next: boolean): void;
    /**
     * The hidden attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: hidden
     */
    hidden: boolean;
    /**
     * The submenu slotted content.
     *
     * @internal
     */
    slottedSubmenu: HTMLElement[];
    /**
     * Sets the submenu and updates its position.
     *
     * @internal
     */
    protected slottedSubmenuChanged(prev: HTMLElement[] | undefined, next: HTMLElement[]): void;
    /**
     * @internal
     */
    submenu: HTMLElement | undefined;
    connectedCallback(): void;
    /**
     * @internal
     */
    handleMenuItemKeyDown: (e: KeyboardEvent) => boolean;
    /**
     * @internal
     */
    handleMenuItemClick: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    handleMouseOver: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    handleMouseOut: (e: MouseEvent) => boolean;
    /**
     * Setup required ARIA on open/close
     * @internal
     */
    handleToggle: (e: Event) => void;
    /** @internal */
    handleSubmenuFocusOut: (e: FocusEvent) => void;
    /**
     * @internal
     */
    private invoke;
    /**
     * Set fallback position of menu on open when CSS anchor not supported
     * @internal
     */
    setSubmenuPosition: () => void;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export declare interface MenuItem extends StartEnd {
}

export declare type MenuItemColumnCount = 0 | 1 | 2;

/**
 * @public
 * @remarks
 * HTML Element: <fluent-menu-item>
 */
export declare const MenuItemDefinition: FASTElementDefinition<typeof MenuItem>;

/**
 * Menu Item configuration options
 * @public
 */
export declare type MenuItemOptions = StartEndOptions<MenuItem> & {
    indicator?: StaticallyComposableHTML<MenuItem>;
    submenuGlyph?: StaticallyComposableHTML<MenuItem>;
};

/**
 * Menu items roles.
 * @public
 */
export declare const MenuItemRole: {
    /**
     * The menu item has a "menuitem" role
     */
    readonly menuitem: "menuitem";
    /**
     * The menu item has a "menuitemcheckbox" role
     */
    readonly menuitemcheckbox: "menuitemcheckbox";
    /**
     * The menu item has a "menuitemradio" role
     */
    readonly menuitemradio: "menuitemradio";
};

/**
 * The types for menu item roles
 * @public
 */
export declare type MenuItemRole = ValuesOf<typeof MenuItemRole>;

/** MenuItem styles
 * @public
 */
export declare const MenuItemStyles: ElementStyles;

export declare const MenuItemTemplate: ElementViewTemplate<MenuItem>;

/**
 * A MenuList Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @tag fluent-menu-list
 *
 * @slot - The default slot for the menu items
 *
 * @public
 */
export declare class MenuList extends BaseMenuList {
    private fg?;
    private fgItems?;
    disconnectedCallback(): void;
    setItems(): void;
}

/**
 * @public
 * @remarks
 * HTML Element: <fluent-menu-list>
 */
export declare const MenuListDefinition: FASTElementDefinition<typeof MenuList>;

/** MenuList styles
 * @public
 */
export declare const MenuListStyles: ElementStyles;

export declare const MenuListTemplate: ElementViewTemplate<MenuList>;

/** Menu styles
 * @public
 */
export declare const MenuStyles: ElementStyles;

export declare const MenuTemplate: ElementViewTemplate<Menu>;

/**
 * A Message Bar Custom HTML Element.
 *
 * @tag fluent-message-bar
 *
 * @slot actions - Content that can be provided for the actions
 * @slot dismiss - Content that can be provided for the dismiss button
 * @slot - The default slot for the content
 * @public
 */
export declare class MessageBar extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    constructor();
    /**
     * Sets the shape of the Message Bar.
     *
     * @public
     * @remarks
     * HTML Attribute: `shape`
     */
    shape?: MessageBarShape;
    /**
     * Sets the layout of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `layout`
     */
    layout?: MessageBarLayout;
    /**
     * Sets the intent of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `intent`
     */
    intent?: MessageBarIntent;
    /**
     * Method to emit a `dismiss` event when the message bar is dismissed
     *
     * @public
     */
    dismissMessageBar: () => void;
}

/**
 * The Fluent MessageBar Element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-message-bar>`
 */
export declare const MessageBarDefinition: FASTElementDefinition<typeof MessageBar>;

/**
 * The `intent` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarIntent: {
    readonly success: "success";
    readonly warning: "warning";
    readonly error: "error";
    readonly info: "info";
};

export declare type MessageBarIntent = ValuesOf<typeof MessageBarIntent>;

/**
 * The `layout` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarLayout: {
    readonly multiline: "multiline";
    readonly singleline: "singleline";
};

export declare type MessageBarLayout = ValuesOf<typeof MessageBarLayout>;

/**
 * The `shape` variations for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarShape: {
    readonly rounded: "rounded";
    readonly square: "square";
};

export declare type MessageBarShape = ValuesOf<typeof MessageBarShape>;

/**
 * Styles for the MessageBar component.
 *
 * @public
 */
export declare const MessageBarStyles: ElementStyles;

/**
 * The template for the MessageBar component.
 * @type ElementViewTemplate
 */
export declare const MessageBarTemplate: ElementViewTemplate<MessageBar>;

/**
 * Standard orientation values
 * @public
 */
export declare const Orientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

/**
 * The orientation type
 * @public
 */
export declare type Orientation = (typeof Orientation)[keyof typeof Orientation];

/**
 * A Progress HTML Element.
 * Based on BaseProgressBar and includes style and layout specific attributes
 *
 * @tag fluent-progress-bar
 *
 * @public
 */
export declare class ProgressBar extends BaseProgressBar {
    /**
     * The thickness of the progress bar
     *
     * The thickness of the progress bar
     *
     * HTML Attribute: `thickness`
     *
     * @public
     */
    thickness?: ProgressBarThickness;
    /**
     * The shape of the progress bar
     * The shape of the progress bar
     *
     * HTML Attribute: `shape`
     *
     * @public
     */
    shape?: ProgressBarShape;
}

/**
 * The Fluent ProgressBar Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-progress-bar\>
 */
export declare const ProgressBarDefinition: FASTElementDefinition<typeof ProgressBar>;

/**
 * ProgressBarShape Constants
 * @public
 */
export declare const ProgressBarShape: {
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * Applies bar shape to the content
 * @public
 */
export declare type ProgressBarShape = ValuesOf<typeof ProgressBarShape>;

/** ProgressBar styles
 * @public
 */
export declare const ProgressBarStyles: ElementStyles;

export declare const ProgressBarTemplate: ElementViewTemplate<ProgressBar>;

/**
 * ProgressBarThickness Constants
 * @public
 */
export declare const ProgressBarThickness: {
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * Applies bar thickness to the content
 * @public
 */
export declare type ProgressBarThickness = ValuesOf<typeof ProgressBarThickness>;

/**
 * ProgressBarValidationState Constants
 * @public
 */
export declare const ProgressBarValidationState: {
    readonly success: "success";
    readonly warning: "warning";
    readonly error: "error";
};

/**
 * Applies validation state to the content
 * @public
 */
export declare type ProgressBarValidationState = ValuesOf<typeof ProgressBarValidationState>;

declare type PropertyNameForCalculation = 'max' | 'value';

/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radio | ARIA `radio` role}.
 *
 * @tag fluent-radio
 *
 * @slot checked-indicator - The checked indicator slot
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
export declare class Radio extends BaseCheckbox {
    constructor();
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @param prev - the previous value of the `disabled` property
     * @param next - the current value of the `disabled` property
     * @internal
     * @override
     */
    protected disabledChanged(prev: boolean | undefined, next: boolean | undefined): void;
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * To make a group of radio controls required, see `RadioGroup.required`.
     */
    protected requiredChanged(): void;
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * The radio form value is controlled by the `RadioGroup` component.
     */
    setFormValue(): void;
    /**
     * Sets the validity of the control.
     *
     * @internal
     * @override
     * @remarks
     * The radio component does not have a `required` attribute, so this method always sets the validity to `true`.
     */
    setValidity(): void;
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     * @override
     * @remarks
     * The radio checked state is controlled by the `RadioGroup` component, so the `force` parameter defaults to `true`.
     */
    toggleChecked(force?: boolean): void;
}

/**
 * @public
 */
export declare type RadioControl = Pick<HTMLInputElement, 'checked' | 'disabled' | 'focus' | 'setAttribute' | 'getAttribute'>;

/**
 * The Fluent Radio Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-radio\>
 */
export declare const RadioDefinition: FASTElementDefinition<typeof Radio>;

/**
 * A Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @tag fluent-radio-group
 *
 * @slot - The default slot for the radio group
 *
 * @public
 */
export declare class RadioGroup extends BaseRadioGroup {
    private fg;
    private fgItems;
    disconnectedCallback(): void;
    radiosChanged(prev: Radio[] | undefined, next: Radio[] | undefined): void;
}

/**
 * The Fluent RadioGroup Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-radio-group\>
 */
export declare const RadioGroupDefinition: FASTElementDefinition<typeof RadioGroup>;

/**
 * Radio Group orientation
 * @public
 */
export declare const RadioGroupOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

/**
 * Types of Radio Group orientation
 * @public
 */
export declare type RadioGroupOrientation = ValuesOf<typeof RadioGroupOrientation>;

/** RadioGroup styles
 * @public
 */
export declare const RadioGroupStyles: ElementStyles;

export declare const RadioGroupTemplate: ElementViewTemplate<RadioGroup>;

/**
 * Radio configuration options
 * @public
 */
export declare type RadioOptions = {
    checkedIndicator?: StaticallyComposableHTML<Radio>;
};

/**
 * Styles for the Radio component
 *
 * @public
 */
export declare const RadioStyles: ElementStyles;

/**
 * Template for the Radio component
 *
 * @public
 */
export declare const RadioTemplate: ElementViewTemplate<Radio>;

/**
 * A Rating Display Custom HTML Element.
 * Based on BaseRatingDisplay and includes style and layout specific attributes
 *
 * @tag fluent-rating-display
 *
 * @public
 */
export declare class RatingDisplay extends BaseRatingDisplay {
    /**
     * The color of the rating display icons.
     *
     * @public
     * @default `marigold`
     * @remarks
     * HTML Attribute: `color`
     */
    color?: RatingDisplayColor;
    /**
     * The size of the component.
     *
     * @public
     * @default 'medium'
     * @remarks
     * HTML Attribute: `size`
     */
    size?: RatingDisplaySize;
    /**
     * Renders a single filled icon with a label next to it.
     *
     * @public
     * @remarks
     * HTML Attribute: `compact`
     */
    compact: boolean;
}

/**
 * The color of the Rating Display items can be `neutral`, `brand`, or `marigold`.
 * @public
 */
export declare const RatingDisplayColor: {
    readonly neutral: "neutral";
    readonly brand: "brand";
    readonly marigold: "marigold";
};

/**
 * The Rating Display items can be one of several colors.
 * @public
 */
export declare type RatingDisplayColor = ValuesOf<typeof RatingDisplayColor>;

/**
 * The definition for the Fluent Rating Display component.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-rating-display>`
 */
export declare const RatingDisplayDefinition: FASTElementDefinition<typeof RatingDisplay>;

/**
 * The size of a Rating Display can be `small`, `medium`, or `large`.
 * @public
 */
export declare const RatingDisplaySize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * A Rating Display can be one of several preset sizes.
 * @public
 */
export declare type RatingDisplaySize = ValuesOf<typeof RatingDisplaySize>;

/**
 * The styles for the Rating Display component.
 *
 * @public
 */
export declare const RatingDisplayStyles: ElementStyles;

/**
 * The template for the Rating Display component.
 *
 * @public
 */
export declare const RatingDisplayTemplate: ElementViewTemplate<RatingDisplay>;

/**
 * @internal
 */
export declare const roleForMenuItem: {
    [value in keyof typeof MenuItemRole]: (typeof MenuItemRole)[value];
};

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
 * CSS custom property value for the {@link @fluentui/tokens#shadow16 | `shadow16`} design token.
 * @public
 */
export declare const shadow16 = "var(--shadow16)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow16Brand | `shadow16Brand`} design token.
 * @public
 */
export declare const shadow16Brand = "var(--shadow16Brand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow2 | `shadow2`} design token.
 * @public
 */
export declare const shadow2 = "var(--shadow2)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow28 | `shadow28`} design token.
 * @public
 */
export declare const shadow28 = "var(--shadow28)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow28Brand | `shadow28Brand`} design token.
 * @public
 */
export declare const shadow28Brand = "var(--shadow28Brand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow2Brand | `shadow2Brand`} design token.
 * @public
 */
export declare const shadow2Brand = "var(--shadow2Brand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow4 | `shadow4`} design token.
 * @public
 */
export declare const shadow4 = "var(--shadow4)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow4Brand | `shadow4Brand`} design token.
 * @public
 */
export declare const shadow4Brand = "var(--shadow4Brand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow64 | `shadow64`} design token.
 * @public
 */
export declare const shadow64 = "var(--shadow64)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow64Brand | `shadow64Brand`} design token.
 * @public
 */
export declare const shadow64Brand = "var(--shadow64Brand)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow8 | `shadow8`} design token.
 * @public
 */
export declare const shadow8 = "var(--shadow8)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow8Brand | `shadow8Brand`} design token.
 * @public
 */
export declare const shadow8Brand = "var(--shadow8Brand)";

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

/**
 * @public
 */
export declare interface SliderConfiguration {
    max?: string;
    min?: string;
    orientation?: SliderOrientation;
    direction?: Direction;
    disabled?: boolean;
}

/**
 * The Fluent Slider Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-slider\>
 */
export declare const SliderDefinition: FASTElementDefinition<typeof Slider>;

/**
 * @public
 */
export declare const SliderMode: {
    readonly singleValue: "single-value";
};

/**
 * The types for the selection mode of the slider
 * @public
 */
export declare type SliderMode = ValuesOf<typeof SliderMode>;

/**
 * Slider configuration options
 * @public
 */
export declare type SliderOptions = {
    thumb?: StaticallyComposableHTML<Slider>;
};

/**
 * @public
 */
export declare const SliderOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

/**
 * The types for the orientation of the slider
 * @public
 */
export declare type SliderOrientation = ValuesOf<typeof SliderOrientation>;

/**
 * SliderSize Constants
 * @public
 */
export declare const SliderSize: {
    readonly small: "small";
    readonly medium: "medium";
};

/**
 * Applies bar height to the slider rail and diameter to the slider thumbs
 * @public
 */
export declare type SliderSize = ValuesOf<typeof SliderSize>;

/** Text styles
 * @public
 */
export declare const SliderStyles: ElementStyles;

export declare const SliderTemplate: ElementViewTemplate<Slider>;

/**
 * Synthetic type for slotted input elements
 * @public
 */
export declare type SlottableInput = HTMLElement & ElementInternals & {
    elementInternals?: ElementInternals;
    required: boolean;
    disabled: boolean;
    readOnly: boolean;
    checked?: boolean;
    value?: string;
};

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalL | `spacingHorizontalL`} design token.
 * @public
 */
export declare const spacingHorizontalL = "var(--spacingHorizontalL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalM | `spacingHorizontalM`} design token.
 * @public
 */
export declare const spacingHorizontalM = "var(--spacingHorizontalM)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalMNudge | `spacingHorizontalMNudge`} design token.
 * @public
 */
export declare const spacingHorizontalMNudge = "var(--spacingHorizontalMNudge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalNone | `spacingHorizontalNone`} design token.
 * @public
 */
export declare const spacingHorizontalNone = "var(--spacingHorizontalNone)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalS | `spacingHorizontalS`} design token.
 * @public
 */
export declare const spacingHorizontalS = "var(--spacingHorizontalS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalSNudge | `spacingHorizontalSNudge`} design token.
 * @public
 */
export declare const spacingHorizontalSNudge = "var(--spacingHorizontalSNudge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXL | `spacingHorizontalXL`} design token.
 * @public
 */
export declare const spacingHorizontalXL = "var(--spacingHorizontalXL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXS | `spacingHorizontalXS`} design token.
 * @public
 */
export declare const spacingHorizontalXS = "var(--spacingHorizontalXS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXXL | `spacingHorizontalXXL`} design token.
 * @public
 */
export declare const spacingHorizontalXXL = "var(--spacingHorizontalXXL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXXS | `spacingHorizontalXXS`} design token.
 * @public
 */
export declare const spacingHorizontalXXS = "var(--spacingHorizontalXXS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXXXL | `spacingHorizontalXXXL`} design token.
 * @public
 */
export declare const spacingHorizontalXXXL = "var(--spacingHorizontalXXXL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalL | `spacingVerticalL`} design token.
 * @public
 */
export declare const spacingVerticalL = "var(--spacingVerticalL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalM | `spacingVerticalM`} design token.
 * @public
 */
export declare const spacingVerticalM = "var(--spacingVerticalM)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalMNudge | `spacingVerticalMNudge`} design token.
 * @public
 */
export declare const spacingVerticalMNudge = "var(--spacingVerticalMNudge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalNone | `spacingVerticalNone`} design token.
 * @public
 */
export declare const spacingVerticalNone = "var(--spacingVerticalNone)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalS | `spacingVerticalS`} design token.
 * @public
 */
export declare const spacingVerticalS = "var(--spacingVerticalS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalSNudge | `spacingVerticalSNudge`} design token.
 * @public
 */
export declare const spacingVerticalSNudge = "var(--spacingVerticalSNudge)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXL | `spacingVerticalXL`} design token.
 * @public
 */
export declare const spacingVerticalXL = "var(--spacingVerticalXL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXS | `spacingVerticalXS`} design token.
 * @public
 */
export declare const spacingVerticalXS = "var(--spacingVerticalXS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXXL | `spacingVerticalXXL`} design token.
 * @public
 */
export declare const spacingVerticalXXL = "var(--spacingVerticalXXL)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXXS | `spacingVerticalXXS`} design token.
 * @public
 */
export declare const spacingVerticalXXS = "var(--spacingVerticalXXS)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXXXL | `spacingVerticalXXXL`} design token.
 * @public
 */
export declare const spacingVerticalXXXL = "var(--spacingVerticalXXXL)";

/**
 * A Spinner Custom HTML Element.
 * Based on BaseSpinner and includes style and layout specific attributes
 *
 * @tag fluent-spinner
 *
 * @public
 */
export declare class Spinner extends BaseSpinner {
    /**
     * The size of the spinner
     *
     * @public
     * @remarks
     * HTML Attribute: size
     */
    size?: SpinnerSize;
    /**
     * The appearance of the spinner
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    appearance?: SpinnerAppearance;
}

/**
 * SpinnerAppearance constants
 * @public
 */
export declare const SpinnerAppearance: {
    readonly primary: "primary";
    readonly inverted: "inverted";
};

/**
 * A Spinner's appearance can be either primary or inverted
 * @public
 */
export declare type SpinnerAppearance = ValuesOf<typeof SpinnerAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-spinner\>
 */
export declare const SpinnerDefinition: FASTElementDefinition<typeof Spinner>;

/**
 * SpinnerSize constants
 * @public
 */
export declare const SpinnerSize: {
    readonly tiny: "tiny";
    readonly extraSmall: "extra-small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
    readonly extraLarge: "extra-large";
    readonly huge: "huge";
};

/**
 * A Spinner's size can be either small, tiny, extra-small, medium, large, extra-large, or huge
 * @public
 */
export declare type SpinnerSize = ValuesOf<typeof SpinnerSize>;

export declare const SpinnerStyles: ElementStyles;

export declare const SpinnerTemplate: ViewTemplate<Spinner, any>;

/**
 * A mixin class implementing start slots.
 * @public
 */
declare class Start {
    start: HTMLSlotElement;
}

/**
 * A mixin class implementing start and end slots.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
export declare class StartEnd implements Start, End {
    start: HTMLSlotElement;
    end: HTMLSlotElement;
}

/**
 * Start/End configuration options
 * @public
 */
export declare type StartEndOptions<TSource = any, TParent = any> = StartOptions<TSource, TParent> & EndOptions<TSource, TParent>;

/**
 * Start configuration options
 * @public
 */
export declare type StartOptions<TSource = any, TParent = any> = {
    start?: StaticallyComposableHTML<TSource, TParent>;
};

/**
 * The template for the start slots.
 * For use with {@link StartEnd}
 *
 * @public
 */
export declare function startSlotTemplate<TSource extends Pick<StartEnd, 'start'> = StartEnd, TParent = any>(options: StartOptions<TSource, TParent>): CaptureType<TSource, TParent>;

/**
 * A value that can be statically composed into a
 * foundation template.
 * @remarks
 * When providing a string, take care to ensure that it is
 * safe and will not enable an XSS attack.
 * @public
 */
declare type StaticallyComposableHTML<TSource = any, TParent = any> = string | HTMLDirective | SyntheticViewTemplate<TSource, TParent> | undefined;

/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThick | `strokeWidthThick`} design token.
 * @public
 */
export declare const strokeWidthThick = "var(--strokeWidthThick)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThicker | `strokeWidthThicker`} design token.
 * @public
 */
export declare const strokeWidthThicker = "var(--strokeWidthThicker)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThickest | `strokeWidthThickest`} design token.
 * @public
 */
export declare const strokeWidthThickest = "var(--strokeWidthThickest)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThin | `strokeWidthThin`} design token.
 * @public
 */
export declare const strokeWidthThin = "var(--strokeWidthThin)";

/**
 * The styles for the Button component.
 *
 * @public
 */
declare const styles: ElementStyles;
export { styles as ButtonStyles }
export { styles as MenuButtonStyles }

/**
 * A Switch Custom HTML Element.
 * Based on BaseCheckbox and includes style and layout specific attributes
 *
 * @tag fluent-switch
 *
 */
export declare class Switch extends BaseCheckbox {
    constructor();
}

/**
 * The Fluent Switch Element.
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-switch\>
 */
export declare const SwitchDefinition: FASTElementDefinition<typeof Switch>;

/**
 * SwitchLabelPosition Constants
 * @public
 */
export declare const SwitchLabelPosition: {
    readonly above: "above";
    readonly after: "after";
    readonly before: "before";
};

/**
 * Applies label position
 * @public
 */
export declare type SwitchLabelPosition = ValuesOf<typeof SwitchLabelPosition>;

export declare type SwitchOptions = {
    switch?: StaticallyComposableHTML<Switch>;
};

export declare const SwitchStyles: ElementStyles;

export declare const SwitchTemplate: ElementViewTemplate<Switch>;

/**
 * Tab extends the FASTTab and is a child of the TabList
 *
 * @tag fluent-tab
 */
export declare class Tab extends FASTElement {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    protected disabledChanged(prev: boolean, next: boolean): void;
    /**
     * Internal text content stylesheet, used to set the content of the `::after`
     * pseudo element to prevent layout shift when the font weight changes on selection.
     * @internal
     */
    private styles?;
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    constructor();
    connectedCallback(): void;
    private setDisabledSideEffect;
}

export declare interface Tab extends StartEnd {
}

export declare const TabDefinition: FASTElementDefinition<typeof Tab>;

/**
 * A Tablist component.
 *
 * @tag fluent-tablist
 *
 * @public
 */
export declare class Tablist extends BaseTablist {
    /**
     * appearance
     * There are two modes of appearance: transparent and subtle.
     */
    appearance?: TablistAppearance;
    /**
     * size
     * defaults to medium.
     * Used to set the size of all the tab controls, which effects text size and margins. Three sizes: small, medium and large.
     */
    size?: TablistSize;
    private fg?;
    private fgItems?;
    disconnectedCallback(): void;
    tabsChanged(prev: Tab[] | undefined, next: Tab[] | undefined): void;
}

/**
 * The appearance of the component
 * @public
 */
export declare const TablistAppearance: {
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * The types for the Tablist appearance
 * @public
 */
export declare type TablistAppearance = ValuesOf<typeof TablistAppearance>;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-tablist\>
 */
export declare const TablistDefinition: FASTElementDefinition<typeof Tablist>;

/**
 * The orientation of the component
 * @public
 */
export declare const TablistOrientation: {
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

/**
 * The types for the Tablist orientation
 * @public
 */
export declare type TablistOrientation = ValuesOf<typeof TablistOrientation>;

/**
 * The size of the component
 * @public
 */
export declare const TablistSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * The types for the Tablist size
 * @public
 */
export declare type TablistSize = ValuesOf<typeof TablistSize>;

/**
 * @public
 */
export declare const TablistStyles: ElementStyles;

/**
 * @public
 */
export declare const TablistTemplate: ViewTemplate<Tablist, any>;

/**
 * Tab configuration options
 * @public
 */
export declare type TabOptions = StartEndOptions<Tab>;

export declare const TabStyles: ElementStyles;

export declare const TabTemplate: ElementViewTemplate<Tab, any>;

/**
 * The base class used for constructing a fluent-text custom element
 *
 * @tag fluent-text
 *
 * @public
 */
declare class Text_2 extends FASTElement {
    /**
     * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
     *
     * @internal
     */
    elementInternals: ElementInternals;
    /**
     * The text will not wrap
     * NOTE: In Fluent UI React v9 this is "wrap"
     * Boolean attributes which default to true in HTML can't be switched off in the DOM
     *
     * @public
     * @remarks
     * HTML Attribute: nowrap
     */
    nowrap: boolean;
    /**
     * The text truncates
     *
     * @public
     * @remarks
     * HTML Attribute: truncate
     */
    truncate: boolean;
    /**
     * The text style is italic
     *
     * @public
     * @remarks
     * HTML Attribute: italic
     */
    italic: boolean;
    /**
     * The text style is underline
     *
     * @public
     * @remarks
     * HTML Attribute: underline
     */
    underline: boolean;
    /**
     * The text style is strikethrough
     *
     * @public
     * @remarks
     * HTML Attribute: strikethrough
     */
    strikethrough: boolean;
    /**
     * An text can take up the width of its container.
     *
     * @public
     * @remarks
     * HTML Attribute: block
     */
    block: boolean;
    /**
     * THe Text size
     *
     * @public
     * @remarks
     * HTML Attribute: size
     *
     */
    size?: TextSize;
    /**
     * THe Text font
     *
     * @public
     * @remarks
     * HTML Attribute: font
     */
    font?: TextFont;
    /**
     * The Text weight
     *
     * @public
     * @remarks
     * HTML Attribute: weight
     */
    weight?: TextWeight;
    /**
     * The Text alignment
     *
     * @public
     * @remarks
     * HTML Attribute: align
     */
    align?: TextAlign;
}
export { Text_2 as Text }

/**
 * TextAlign Constants
 * @public
 */
export declare const TextAlign: {
    readonly start: "start";
    readonly end: "end";
    readonly center: "center";
    readonly justify: "justify";
};

/**
 * Aligns the content
 * @public
 */
export declare type TextAlign = ValuesOf<typeof TextAlign>;

/**
 * The Fluent TextArea Element.
 *
 * @tag fluent-text-area
 *
 */
export declare class TextArea extends BaseTextArea {
    protected labelSlottedNodesChanged(): void;
    /**
     * Indicates the visual appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance: TextAreaAppearance;
    /**
     * Indicates whether the textarea should be a block-level element.
     *
     * @public
     * @remarks
     * HTML Attribute: `block`
     */
    block: boolean;
    /**
     * Sets the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `size`
     */
    size?: TextAreaSize;
    /**
     * @internal
     */
    handleChange(_: any, propertyName: string): void;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
}

/**
 * Values for the `appearance` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaAppearance: {
    readonly outline: "outline";
    readonly filledLighter: "filled-lighter";
    readonly filledDarker: "filled-darker";
};

export declare type TextAreaAppearance = ValuesOf<typeof TextAreaAppearance>;

/**
 * Allowed values for `appearance` when `display-shadow` is set to true.
 *
 * @public
 */
export declare const TextAreaAppearancesForDisplayShadow: Partial<TextAreaAppearance[]>;

/**
 * Values for the `autocomplete` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaAutocomplete: {
    readonly on: "on";
    readonly off: "off";
};

export declare type TextAreaAutocomplete = ValuesOf<typeof TextAreaAutocomplete>;

/**
 * The Fluent Textarea Element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-textarea>`
 */
export declare const TextAreaDefinition: FASTElementDefinition<typeof TextArea>;

/**
 * Values for the `resize` attribute on TextArea elements.
 */
export declare const TextAreaResize: {
    readonly none: "none";
    readonly both: "both";
    readonly horizontal: "horizontal";
    readonly vertical: "vertical";
};

export declare type TextAreaResize = ValuesOf<typeof TextAreaResize>;

/**
 * Values for the `size` attribute on TextArea elements.
 *
 * @public
 */
export declare const TextAreaSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

export declare type TextAreaSize = ValuesOf<typeof TextAreaSize>;

/**
 * Styles for the TextArea component.
 *
 * @public
 */
export declare const TextAreaStyles: ElementStyles;

/**
 * @internal
 */
export declare const TextAreaTemplate: ElementViewTemplate<TextArea>;

/**
 * The Fluent Text Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-text\>
 */
export declare const TextDefinition: FASTElementDefinition<typeof Text_2>;

/**
 * TextFont Constants
 * @public
 */
export declare const TextFont: {
    readonly base: "base";
    readonly numeric: "numeric";
    readonly monospace: "monospace";
};

/**
 * Applies font family to the content
 * @public
 */
export declare type TextFont = ValuesOf<typeof TextFont>;

/**
 * A Text Input Custom HTML Element.
 * Based on BaseTextInput and includes style and layout specific attributes
 *
 * @tag fluent-text-input
 *
 * @public
 */
export declare class TextInput extends BaseTextInput {
    /**
     * Indicates the styled appearance of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: `appearance`
     */
    appearance?: TextInputAppearance;
    /**
     * Sets the size of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `control-size`
     */
    controlSize?: TextInputControlSize;
}

/**
 * @internal
 * @privateRemarks
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/rushstack/issues/1308
 */
export declare interface TextInput extends StartEnd {
}

/**
 * Values for the `appearance` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputAppearance: {
    readonly outline: "outline";
    readonly underline: "underline";
    readonly filledLighter: "filled-lighter";
    readonly filledDarker: "filled-darker";
};

export declare type TextInputAppearance = ValuesOf<typeof TextInputAppearance>;

/**
 * Values for the `control-size` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputControlSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

export declare type TextInputControlSize = ValuesOf<typeof TextInputControlSize>;

/**
 * The Fluent TextInput Element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-text-input>`
 */
export declare const TextInputDefinition: FASTElementDefinition<typeof TextInput>;

/**
 * TextInput configuration options.
 *
 * @public
 */
export declare type TextInputOptions = StartEndOptions<TextInput>;

/**
 * Styles for the TextInput component.
 *
 * @public
 */
export declare const TextInputStyles: ElementStyles;

/**
 * @internal
 */
export declare const TextInputTemplate: ElementViewTemplate<TextInput>;

/**
 * Values for the `type` attribute on TextInput elements.
 *
 * @public
 */
export declare const TextInputType: {
    readonly email: "email";
    readonly password: "password";
    readonly tel: "tel";
    readonly text: "text";
    readonly url: "url";
};

export declare type TextInputType = ValuesOf<typeof TextInputType>;

/**
 * TextSize constants
 * @public
 */
export declare const TextSize: {
    readonly _100: "100";
    readonly _200: "200";
    readonly _300: "300";
    readonly _400: "400";
    readonly _500: "500";
    readonly _600: "600";
    readonly _700: "700";
    readonly _800: "800";
    readonly _900: "900";
    readonly _1000: "1000";
};

/**
 * The type for TextSize
 * The font size and line height based on the theme tokens
 * @public
 */
export declare type TextSize = ValuesOf<typeof TextSize>;

/** Text styles
 * @public
 */
export declare const TextStyles: ElementStyles;

/**
 * @internal
 */
export declare const TextTemplate: ElementViewTemplate<Text_2>;

/**
 * TextWeight Constants
 * @public
 */
export declare const TextWeight: {
    readonly medium: "medium";
    readonly regular: "regular";
    readonly semibold: "semibold";
    readonly bold: "bold";
};

/**
 * Applies font weight to the content
 * @public
 */
export declare type TextWeight = ValuesOf<typeof TextWeight>;

/**
 * Not using the `Theme` type from `@fluentui/tokens` package to allow custom
 * tokens to be added.
 * @public
 */
export declare type Theme = Record<string, string | number>;

/**
 * The base class used for constructing a `<fluent-toggle-button>` custom element.
 *
 * @tag fluent-toggle-button
 *
 * @public
 */
export declare class ToggleButton extends Button {
    /**
     * Indicates the pressed state of the control.
     *
     * @public
     * @remarks
     * HTML Attribute: `pressed`
     */
    pressed: boolean;
    /**
     * Updates the pressed state when the `pressed` property changes.
     *
     * @internal
     */
    protected pressedChanged(): void;
    /**
     * Indicates the mixed state of the control. This property takes precedence over `pressed`.
     *
     * @public
     * @remarks
     * HTML Attribute: `mixed`
     */
    mixed?: boolean;
    /**
     * Updates the pressed state when the `mixed` property changes.
     *
     * @param previous - the previous mixed state
     * @param next - the current mixed state
     * @internal
     */
    protected mixedChanged(): void;
    /**
     * Toggles the pressed state of the button.
     *
     * @override
     */
    protected press(): void;
    connectedCallback(): void;
    /**
     * Sets the `aria-pressed` attribute based on the `pressed` and `mixed` properties.
     *
     * @internal
     */
    private setPressedState;
}

/**
 * Toggle Button Appearance constants
 * @public
 */
export declare const ToggleButtonAppearance: {
    readonly primary: "primary";
    readonly outline: "outline";
    readonly subtle: "subtle";
    readonly transparent: "transparent";
};

/**
 * A Toggle Button can be secondary, primary, outline, subtle, transparent
 * @public
 */
export declare type ToggleButtonAppearance = ValuesOf<typeof ToggleButtonAppearance>;

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-toggle-button\>
 */
export declare const ToggleButtonDefinition: FASTElementDefinition<typeof ToggleButton>;

/**
 * A Toggle Button can be square, circular or rounded.
 * @public
 */
export declare const ToggleButtonShape: {
    readonly circular: "circular";
    readonly rounded: "rounded";
    readonly square: "square";
};

/**
 * A Toggle Button can be square, circular or rounded
 * @public
 */
export declare type ToggleButtonShape = ValuesOf<typeof ToggleButtonShape>;

/**
 * A Toggle Button can be a size of small, medium or large.
 * @public
 */
export declare const ToggleButtonSize: {
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "large";
};

/**
 * A Toggle Button can be on of several preset sizes.
 * @public
 */
export declare type ToggleButtonSize = ValuesOf<typeof ToggleButtonSize>;

/**
 * The styles for the ToggleButton component.
 *
 * @public
 * @privateRemarks
 * TODO: Need to support icon hover styles
 */
export declare const ToggleButtonStyles: ElementStyles;

/**
 * The template for the ToggleButton component.
 * @public
 */
export declare const ToggleButtonTemplate: ElementViewTemplate<ToggleButton>;

/**
 * A Tooltip Custom HTML Element.
 * Based on ARIA APG Tooltip Pattern {@link https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ }
 *
 * @tag fluent-tooltip
 *
 * @public
 */
export declare class Tooltip extends FASTElement {
    /**
     * The attached element internals
     */
    elementInternals: ElementInternals;
    /**
     * The item ID
     *
     * @public
     * @remarks
     * HTML Attribute: id
     */
    id: string;
    /**
     * Set the delay for the tooltip
     */
    delay?: number;
    /**
     * The default delay for the tooltip
     * @internal
     */
    private defaultDelay;
    /**
     * Set the positioning of the tooltip
     */
    positioning?: TooltipPositioningOption;
    /**
     * Updates the fallback styles when the positioning changes.
     *
     * @internal
     */
    positioningChanged(): void;
    /**
     * The id of the anchor element for the tooltip
     */
    anchor: string;
    /**
     * Reference to the anchor element
     * @internal
     */
    private get anchorElement();
    /**
     * Reference to the anchor positioning style element
     * @internal
     */
    protected anchorPositioningStyleElement: HTMLStyleElement | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Shows the tooltip
     * @param delay - Number of milliseconds to delay showing the tooltip
     * @internal
     */
    showTooltip(delay?: number): void;
    /**
     * Hide the tooltip
     * @param delay - Number of milliseconds to delay hiding the tooltip
     * @internal
     */
    hideTooltip(delay?: number): void;
    /**
     * Show the tooltip on mouse enter
     */
    mouseenterAnchorHandler: () => void;
    /**
     * Hide the tooltip on mouse leave
     */
    mouseleaveAnchorHandler: () => void;
    /**
     * Show the tooltip on focus
     */
    focusAnchorHandler: () => void;
    /**
     * Hide the tooltip on blur
     */
    blurAnchorHandler: () => void;
    private setFallbackStyles;
}

/**
 * The {@link Tooltip } custom element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-tooltip>`
 */
export declare const TooltipDefinition: FASTElementDefinition<typeof Tooltip>;

/**
 * The TooltipPositioning options and their corresponding CSS values
 * @public
 */
export declare const TooltipPositioningOption: {
    readonly 'above-start': "block-start span-inline-end";
    readonly above: "block-start";
    readonly 'above-end': "block-start span-inline-start";
    readonly 'below-start': "block-end span-inline-end";
    readonly below: "block-end";
    readonly 'below-end': "block-end span-inline-start";
    readonly 'before-top': "inline-start span-block-end";
    readonly before: "inline-start";
    readonly 'before-bottom': "inline-start span-block-start";
    readonly 'after-top': "inline-end span-block-end";
    readonly after: "inline-end";
    readonly 'after-bottom': "inline-end span-block-start";
};

/**
 * The TooltipPositioning type
 * @public
 */
export declare type TooltipPositioningOption = ValuesOf<typeof TooltipPositioningOption>;

/**
 * Styles for the tooltip component
 * @public
 */
export declare const TooltipStyles: ElementStyles;

/**
 * Template for the tooltip component
 * @public
 */
export declare const TooltipTemplate: ViewTemplate<Tooltip, any>;

/**
 * The Fluent Tree Element. Implements {@link @microsoft/fast-foundation#BaseTree}.
 *
 * @tag fluent-tree
 *
 */
export declare class Tree extends BaseTree {
    /**
     * The size of the tree item element
     * The size of the tree item element
     *
     * HTML Attribute: size
     *
     * @public
     */
    size: TreeItemSize;
    protected sizeChanged(): void;
    /**
     * The appearance variants of the tree item element
     * The appearance variants of the tree item element
     *
     * HTML Attribute: appearance
     *
     * @public
     */
    appearance: TreeItemAppearance;
    protected appearanceChanged(): void;
    private fg?;
    private fgItems?;
    /**
     * child tree items supered change event
     * @internal
     */
    childTreeItemsChanged(): void;
    disconnectedCallback(): void;
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
     */
    updateSizeAndAppearance(): void;
    /** @internal */
    itemToggleHandler(): void;
}

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-tree\>
 */
export declare const TreeDefinition: FASTElementDefinition<typeof Tree>;

/**
 * The Fluent Tree Item Element. Implements {@link @microsoft/fast-foundation#BaseTreeItem}.
 *
 * @tag fluent-tree-item
 *
 */
export declare class TreeItem extends BaseTreeItem {
    /**
     * The size of the tree item element
     * @public
     */
    size: TreeItemSize;
    /**
     * Handles changes to the size attribute
     * we update the child tree items' size based on the size
     *  @internal
     */
    protected sizeChanged(): void;
    /**
     * The size of the tree item element
     * @public
     */
    appearance: TreeItemAppearance;
    /**
     * Handles changes to the appearance attribute
     *
     * @internal
     */
    protected appearanceChanged(): void;
    /**
     * child tree items supered change event
     * @internal
     */
    childTreeItemsChanged(): void;
    /**
     * 1. Update the child items' size based on the tree's size
     * 2. Update the child items' appearance based on the tree's appearance
     *
     * @public
     */
    updateSizeAndAppearance(): void;
}

export declare const TreeItemAppearance: {
    readonly subtle: "subtle";
    readonly subtleAlpha: "subtle-alpha";
    readonly transparent: "transparent";
};

export declare type TreeItemAppearance = ValuesOf<typeof TreeItemAppearance>;

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-tree-item\>
 */
export declare const TreeItemDefinition: FASTElementDefinition<typeof TreeItem>;

export declare const TreeItemSize: {
    readonly small: "small";
    readonly medium: "medium";
};

export declare type TreeItemSize = ValuesOf<typeof TreeItemSize>;

export declare const TreeItemStyles: ElementStyles;

export declare const TreeItemTemplate: ViewTemplate<TreeItem, any>;

export declare const TreeStyles: ElementStyles;

export declare const TreeTemplate: ViewTemplate<Tree, any>;

export declare const typographyBody1StrongerStyles: CSSDirective;

export declare const typographyBody1StrongStyles: CSSDirective;

export declare const typographyBody1Styles: CSSDirective;

export declare const typographyBody2Styles: CSSDirective;

export declare const typographyCaption1StrongerStyles: CSSDirective;

export declare const typographyCaption1StrongStyles: CSSDirective;

export declare const typographyCaption1Styles: CSSDirective;

export declare const typographyCaption2StrongStyles: CSSDirective;

export declare const typographyCaption2Styles: CSSDirective;

export declare const typographyDisplayStyles: CSSDirective;

export declare const typographyLargeTitleStyles: CSSDirective;

export declare const typographySubtitle1Styles: CSSDirective;

export declare const typographySubtitle2StrongerStyles: CSSDirective;

export declare const typographySubtitle2Styles: CSSDirective;

export declare const typographyTitle1Styles: CSSDirective;

export declare const typographyTitle2Styles: CSSDirective;

export declare const typographyTitle3Styles: CSSDirective;

/**
 * Synthetic type for slotted message elements
 * @public
 */
export declare const ValidationFlags: {
    readonly badInput: "bad-input";
    readonly customError: "custom-error";
    readonly patternMismatch: "pattern-mismatch";
    readonly rangeOverflow: "range-overflow";
    readonly rangeUnderflow: "range-underflow";
    readonly stepMismatch: "step-mismatch";
    readonly tooLong: "too-long";
    readonly tooShort: "too-short";
    readonly typeMismatch: "type-mismatch";
    readonly valueMissing: "value-missing";
    readonly valid: "valid";
};

/** @public */
export declare type ValidationFlags = ValuesOf<typeof ValidationFlags>;

/**
 * Helper for enumerating a type from a const object
 * Example: export type Foo = ValuesOf\<typeof Foo\>
 * @public
 */
declare type ValuesOf<T> = T[keyof T];

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexBackground | `zIndexBackground`} design token.
 * @public
 */
export declare const zIndexBackground = "var(--zIndexBackground)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexContent | `zIndexContent`} design token.
 * @public
 */
export declare const zIndexContent = "var(--zIndexContent)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexDebug | `zIndexDebug`} design token.
 * @public
 */
export declare const zIndexDebug = "var(--zIndexDebug)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexFloating | `zIndexFloating`} design token.
 * @public
 */
export declare const zIndexFloating = "var(--zIndexFloating)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexMessages | `zIndexMessages`} design token.
 * @public
 */
export declare const zIndexMessages = "var(--zIndexMessages)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexOverlay | `zIndexOverlay`} design token.
 * @public
 */
export declare const zIndexOverlay = "var(--zIndexOverlay)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexPopup | `zIndexPopup`} design token.
 * @public
 */
export declare const zIndexPopup = "var(--zIndexPopup)";

/**
 * CSS custom property value for the {@link @fluentui/tokens#zIndexPriority | `zIndexPriority`} design token.
 * @public
 */
export declare const zIndexPriority = "var(--zIndexPriority)";

export { }
