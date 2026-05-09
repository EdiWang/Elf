import { createHighContrastTheme } from "../../utils/createHighContrastTheme.js";
import { fontFamilies } from "../../alias/teamsFontFamilies.js";
export const teamsHighContrastTheme = {
    ...createHighContrastTheme(),
    ...fontFamilies
};
