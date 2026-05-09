/**
 * Get (up to 2 characters) initials based on display name of the persona.
 *
 * @param displayName - The full name of the person or entity
 * @param isRtl - Whether the display is in RTL
 * @param options - Extra options to control the behavior of getInitials
 *
 * @returns The 1 or 2 character initials based on the name. Or an empty string if no initials
 * could be derived from the name.
 *
 * @internal
 */
export declare function getInitials(displayName: string | undefined | null, isRtl: boolean, options?: {
    /** Should initials be generated from phone numbers (default false) */
    allowPhoneInitials?: boolean;
    /** Returns only the first initial */
    firstInitialOnly?: boolean;
}): string;
