import type { Tab } from '../tab/tab.js';
import { BaseTablist } from './tablist.base.js';
import { TablistAppearance, type TablistSize } from './tablist.options.js';
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
