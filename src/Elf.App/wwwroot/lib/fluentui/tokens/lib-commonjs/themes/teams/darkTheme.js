"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    teamsDarkTheme: function() {
        return teamsDarkTheme;
    },
    teamsDarkV21Theme: function() {
        return teamsDarkV21Theme;
    }
});
const _createTeamsDarkTheme = require("../../utils/createTeamsDarkTheme.js");
const _brandColors = require("../../global/brandColors.js");
const _teamsFontFamilies = require("../../alias/teamsFontFamilies.js");
const teamsDarkTheme = {
    ...(0, _createTeamsDarkTheme.createTeamsDarkTheme)(_brandColors.brandTeams),
    ..._teamsFontFamilies.fontFamilies
};
const teamsDarkV21Theme = {
    ...(0, _createTeamsDarkTheme.createTeamsDarkTheme)(_brandColors.brandTeamsV21),
    ..._teamsFontFamilies.fontFamilies
};
