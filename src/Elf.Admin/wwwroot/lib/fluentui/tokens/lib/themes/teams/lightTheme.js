import { createLightTheme } from "../../utils/createLightTheme.js";
import { brandTeams, brandTeamsV21 } from "../../global/brandColors.js";
import { fontFamilies } from "../../alias/teamsFontFamilies.js";
export const teamsLightTheme = {
    ...createLightTheme(brandTeams),
    ...fontFamilies
};
export const teamsLightV21Theme = {
    ...createLightTheme(brandTeamsV21),
    ...fontFamilies
};
