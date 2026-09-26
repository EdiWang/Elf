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
    createDarkTheme: function() {
        return _utils.createDarkTheme;
    },
    createHighContrastTheme: function() {
        return _utils.createHighContrastTheme;
    },
    createLightTheme: function() {
        return _utils.createLightTheme;
    },
    createTeamsDarkTheme: function() {
        return _utils.createTeamsDarkTheme;
    },
    teamsDarkTheme: function() {
        return _themes.teamsDarkTheme;
    },
    teamsDarkV21Theme: function() {
        return _themes.teamsDarkV21Theme;
    },
    teamsHighContrastTheme: function() {
        return _themes.teamsHighContrastTheme;
    },
    teamsLightTheme: function() {
        return _themes.teamsLightTheme;
    },
    teamsLightV21Theme: function() {
        return _themes.teamsLightV21Theme;
    },
    themeToTokensObject: function() {
        return _themeToTokensObject.themeToTokensObject;
    },
    tokens: function() {
        return _tokens.tokens;
    },
    typographyStyles: function() {
        return _global.typographyStyles;
    },
    webDarkTheme: function() {
        return _themes.webDarkTheme;
    },
    webLightTheme: function() {
        return _themes.webLightTheme;
    }
});
const _themes = require("./themes/index.js");
const _utils = require("./utils/index.js");
const _themeToTokensObject = require("./themeToTokensObject.js");
const _tokens = require("./tokens.js");
const _global = require("./global/index.js");
