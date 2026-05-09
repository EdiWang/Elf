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
        return _darkTheme.teamsDarkTheme;
    },
    teamsDarkV21Theme: function() {
        return _darkTheme.teamsDarkV21Theme;
    },
    teamsHighContrastTheme: function() {
        return _highContrastTheme.teamsHighContrastTheme;
    },
    teamsLightTheme: function() {
        return _lightTheme.teamsLightTheme;
    },
    teamsLightV21Theme: function() {
        return _lightTheme.teamsLightV21Theme;
    }
});
const _lightTheme = require("./lightTheme.js");
const _darkTheme = require("./darkTheme.js");
const _highContrastTheme = require("./highContrastTheme.js");
