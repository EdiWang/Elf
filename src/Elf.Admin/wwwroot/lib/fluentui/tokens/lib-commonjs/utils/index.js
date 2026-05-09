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
        return _createDarkTheme.createDarkTheme;
    },
    createHighContrastTheme: function() {
        return _createHighContrastTheme.createHighContrastTheme;
    },
    createLightTheme: function() {
        return _createLightTheme.createLightTheme;
    },
    createTeamsDarkTheme: function() {
        return _createTeamsDarkTheme.createTeamsDarkTheme;
    }
});
const _createLightTheme = require("./createLightTheme.js");
const _createDarkTheme = require("./createDarkTheme.js");
const _createTeamsDarkTheme = require("./createTeamsDarkTheme.js");
const _createHighContrastTheme = require("./createHighContrastTheme.js");
