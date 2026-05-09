/* color palette used in both darkTheme and teamsDarkTheme */ "use strict";
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
const _colorPalette = require("../global/colorPalette.js");
const _sharedColorNames = require("../sharedColorNames.js");
const _statusColorMapping = require("../statusColorMapping.js");
const statusColorPaletteTokens = _sharedColorNames.statusSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background1`]: _colorPalette.statusSharedColors[sharedColor].shade40,
        [`colorPalette${color}Background2`]: _colorPalette.statusSharedColors[sharedColor].shade30,
        [`colorPalette${color}Background3`]: _colorPalette.statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Foreground1`]: _colorPalette.statusSharedColors[sharedColor].tint30,
        [`colorPalette${color}Foreground2`]: _colorPalette.statusSharedColors[sharedColor].tint40,
        [`colorPalette${color}Foreground3`]: _colorPalette.statusSharedColors[sharedColor].tint20,
        [`colorPalette${color}BorderActive`]: _colorPalette.statusSharedColors[sharedColor].tint30,
        [`colorPalette${color}Border1`]: _colorPalette.statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Border2`]: _colorPalette.statusSharedColors[sharedColor].tint20
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patches
statusColorPaletteTokens.colorPaletteRedForeground3 = _colorPalette.statusSharedColors.red.tint30;
statusColorPaletteTokens.colorPaletteRedBorder2 = _colorPalette.statusSharedColors.red.tint30;
statusColorPaletteTokens.colorPaletteGreenForeground3 = _colorPalette.statusSharedColors.green.tint40;
statusColorPaletteTokens.colorPaletteGreenBorder2 = _colorPalette.statusSharedColors.green.tint40;
statusColorPaletteTokens.colorPaletteDarkOrangeForeground3 = _colorPalette.statusSharedColors.darkOrange.tint30;
statusColorPaletteTokens.colorPaletteDarkOrangeBorder2 = _colorPalette.statusSharedColors.darkOrange.tint30;
statusColorPaletteTokens.colorPaletteRedForegroundInverted = _colorPalette.statusSharedColors.red.primary;
statusColorPaletteTokens.colorPaletteGreenForegroundInverted = _colorPalette.statusSharedColors.green.primary;
statusColorPaletteTokens.colorPaletteYellowForegroundInverted = _colorPalette.statusSharedColors.yellow.shade30;
const personaColorPaletteTokens = _sharedColorNames.personaSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background2`]: _colorPalette.personaSharedColors[sharedColor].shade30,
        [`colorPalette${color}Foreground2`]: _colorPalette.personaSharedColors[sharedColor].tint40,
        [`colorPalette${color}BorderActive`]: _colorPalette.personaSharedColors[sharedColor].tint30
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patches
personaColorPaletteTokens.colorPaletteDarkRedBackground2 = _colorPalette.personaSharedColors.darkRed.shade20;
personaColorPaletteTokens.colorPalettePlumBackground2 = _colorPalette.personaSharedColors.plum.shade20;
const colorPaletteTokens = {
    ...statusColorPaletteTokens,
    ...personaColorPaletteTokens
};
const colorStatusTokens = Object.entries(_statusColorMapping.statusColorMapping).reduce((acc, [statusColor, sharedColor])=>{
    const color = statusColor.slice(0, 1).toUpperCase() + statusColor.slice(1);
    // TODO: double check the mapping with design - see the one-off patches above
    const statusColorTokens = {
        [`colorStatus${color}Background1`]: _colorPalette.mappedStatusColors[sharedColor].shade40,
        [`colorStatus${color}Background2`]: _colorPalette.mappedStatusColors[sharedColor].shade30,
        [`colorStatus${color}Background3`]: _colorPalette.mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Foreground1`]: _colorPalette.mappedStatusColors[sharedColor].tint30,
        [`colorStatus${color}Foreground2`]: _colorPalette.mappedStatusColors[sharedColor].tint40,
        [`colorStatus${color}Foreground3`]: _colorPalette.mappedStatusColors[sharedColor].tint20,
        [`colorStatus${color}BorderActive`]: _colorPalette.mappedStatusColors[sharedColor].tint30,
        [`colorStatus${color}ForegroundInverted`]: _colorPalette.mappedStatusColors[sharedColor].shade10,
        [`colorStatus${color}Border1`]: _colorPalette.mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Border2`]: _colorPalette.mappedStatusColors[sharedColor].tint20
    };
    return Object.assign(acc, statusColorTokens);
}, {});
// one-off overrides for colorStatus tokens
colorStatusTokens.colorStatusDangerBackground3Hover = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.danger].shade10;
colorStatusTokens.colorStatusDangerBackground3Pressed = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.danger].shade20;
colorStatusTokens.colorStatusDangerForeground3 = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.danger].tint40;
colorStatusTokens.colorStatusDangerBorder2 = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.danger].tint30;
colorStatusTokens.colorStatusSuccessForeground3 = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.success].tint40;
colorStatusTokens.colorStatusSuccessBorder2 = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.success].tint40;
colorStatusTokens.colorStatusWarningForegroundInverted = _colorPalette.mappedStatusColors[_statusColorMapping.statusColorMapping.warning].shade20;
