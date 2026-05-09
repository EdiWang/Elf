import { createTeamsDarkTheme } from "../../utils/createTeamsDarkTheme.js";
import { brandTeams, brandTeamsV21 } from "../../global/brandColors.js";
import { fontFamilies } from "../../alias/teamsFontFamilies.js";
export const teamsDarkTheme = {
    ...createTeamsDarkTheme(brandTeams),
    ...fontFamilies
};
export const teamsDarkV21Theme = {
    ...createTeamsDarkTheme(brandTeamsV21),
    ...fontFamilies
};
