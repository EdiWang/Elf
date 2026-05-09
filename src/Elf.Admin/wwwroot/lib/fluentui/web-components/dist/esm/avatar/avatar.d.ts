import { BaseAvatar } from './avatar.base.js';
import { type AvatarActive, type AvatarAppearance, AvatarColor, AvatarNamedColor, type AvatarShape, type AvatarSize } from './avatar.options.js';
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
