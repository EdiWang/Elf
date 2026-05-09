"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDarkTheme", {
    enumerable: true,
    get: function() {
        return createDarkTheme;
    }
});
const _darkColorPalette = require("../alias/darkColorPalette.js");
const _darkColor = require("../alias/darkColor.js");
const _index = require("../global/index.js");
const _shadows = require("./shadows.js");
const _durations = require("../global/durations.js");
const _curves = require("../global/curves.js");
const _spacings = require("../global/spacings.js");
const createDarkTheme = (brand)=>{
    const colorTokens = (0, _darkColor.generateColorTokens)(brand);
    return {
        ..._index.borderRadius,
        ..._index.fontSizes,
        ..._index.lineHeights,
        ..._index.fontFamilies,
        ..._index.fontWeights,
        ..._index.strokeWidths,
        ..._spacings.horizontalSpacings,
        ..._spacings.verticalSpacings,
        ..._durations.durations,
        ..._curves.curves,
        ...colorTokens,
        ..._darkColorPalette.colorPaletteTokens,
        ..._darkColorPalette.colorStatusTokens,
        ...(0, _shadows.createShadowTokens)(colorTokens.colorNeutralShadowAmbient, colorTokens.colorNeutralShadowKey),
        ...(0, _shadows.createShadowTokens)(colorTokens.colorBrandShadowAmbient, colorTokens.colorBrandShadowKey, 'Brand')
    };
};
