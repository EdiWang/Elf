import { FASTElement } from '@microsoft/fast-element';
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
