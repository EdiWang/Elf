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
    webDarkTheme: function() {
        return _darkTheme.webDarkTheme;
    },
    webLightTheme: function() {
        return _lightTheme.webLightTheme;
    }
});
const _lightTheme = require("./lightTheme.js");
const _darkTheme = require("./darkTheme.js");
