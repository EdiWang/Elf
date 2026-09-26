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
    colorPaletteTokens: function() {
        return colorPaletteTokens;
    },
    colorStatusTokens: function() {
        return colorStatusTokens;
    }
});
const _colors = require("../global/colors.js");
const _sharedColorNames = require("../sharedColorNames.js");
const _statusColorMapping = require("../statusColorMapping.js");
const statusColorPaletteTokens = _sharedColorNames.statusSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background1`]: _colors.hcCanvas,
        [`colorPalette${color}Background2`]: _colors.hcCanvas,
        [`colorPalette${color}Background3`]: _colors.hcCanvasText,
        [`colorPalette${color}Foreground1`]: _colors.hcCanvasText,
        [`colorPalette${color}Foreground2`]: _colors.hcCanvasText,
        [`colorPalette${color}Foreground3`]: _colors.hcCanvasText,
        [`colorPalette${color}BorderActive`]: _colors.hcHighlight,
        [`colorPalette${color}Border1`]: _colors.hcCanvasText,
        [`colorPalette${color}Border2`]: _colors.hcCanvasText
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patches
statusColorPaletteTokens.colorPaletteRedForegroundInverted = _colors.hcCanvasText;
statusColorPaletteTokens.colorPaletteGreenForegroundInverted = _colors.hcCanvasText;
statusColorPaletteTokens.colorPaletteYellowForegroundInverted = _colors.hcCanvasText;
const personaColorPaletteTokens = _sharedColorNames.personaSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background2`]: _colors.hcCanvas,
        [`colorPalette${color}Foreground2`]: _colors.hcCanvasText,
        [`colorPalette${color}BorderActive`]: _colors.hcHighlight
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
const colorPaletteTokens = {
    ...statusColorPaletteTokens,
    ...personaColorPaletteTokens
};
const colorStatusTokens = Object.entries(_statusColorMapping.statusColorMapping).reduce((acc, [statusColor, sharedColor])=>{
    const color = statusColor.slice(0, 1).toUpperCase() + statusColor.slice(1);
    // TODO: double check the mapping with design
    const statusColorTokens = {
        [`colorStatus${color}Background1`]: _colors.hcCanvas,
        [`colorStatus${color}Background2`]: _colors.hcCanvas,
        [`colorStatus${color}Background3`]: _colors.hcCanvasText,
        [`colorStatus${color}Foreground1`]: _colors.hcCanvasText,
        [`colorStatus${color}Foreground2`]: _colors.hcCanvasText,
        [`colorStatus${color}Foreground3`]: _colors.hcCanvasText,
        [`colorStatus${color}BorderActive`]: _colors.hcHighlight,
        [`colorStatus${color}ForegroundInverted`]: _colors.hcCanvasText,
        [`colorStatus${color}Border1`]: _colors.hcCanvasText,
        [`colorStatus${color}Border2`]: _colors.hcCanvasText
    };
    return Object.assign(acc, statusColorTokens);
}, {});
// one-off overrides for colorStatus tokens
colorStatusTokens.colorStatusDangerBackground3Hover = _colors.hcHighlight;
colorStatusTokens.colorStatusDangerBackground3Pressed = _colors.hcHighlight;
