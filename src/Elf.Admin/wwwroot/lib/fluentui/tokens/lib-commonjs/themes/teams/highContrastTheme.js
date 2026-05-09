"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "teamsHighContrastTheme", {
    enumerable: true,
    get: function() {
        return teamsHighContrastTheme;
    }
});
const _createHighContrastTheme = require("../../utils/createHighContrastTheme.js");
const _teamsFontFamilies = require("../../alias/teamsFontFamilies.js");
const teamsHighContrastTheme = {
    ...(0, _createHighContrastTheme.createHighContrastTheme)(),
    ..._teamsFontFamilies.fontFamilies
};
