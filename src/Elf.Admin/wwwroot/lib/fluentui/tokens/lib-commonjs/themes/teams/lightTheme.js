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
    teamsLightTheme: function() {
        return teamsLightTheme;
    },
    teamsLightV21Theme: function() {
        return teamsLightV21Theme;
    }
});
const _createLightTheme = require("../../utils/createLightTheme.js");
const _brandColors = require("../../global/brandColors.js");
const _teamsFontFamilies = require("../../alias/teamsFontFamilies.js");
const teamsLightTheme = {
    ...(0, _createLightTheme.createLightTheme)(_brandColors.brandTeams),
    ..._teamsFontFamilies.fontFamilies
};
const teamsLightV21Theme = {
    ...(0, _createLightTheme.createLightTheme)(_brandColors.brandTeamsV21),
    ..._teamsFontFamilies.fontFamilies
};
