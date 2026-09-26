"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fontFamilies", {
    enumerable: true,
    get: function() {
        return fontFamilies;
    }
});
const _fonts = require("../global/fonts.js");
const fontFamilies = {
    ..._fonts.fontFamilies,
    fontFamilyBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif'
};
