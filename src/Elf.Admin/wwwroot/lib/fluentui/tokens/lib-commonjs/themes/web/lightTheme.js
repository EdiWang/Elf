"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "webLightTheme", {
    enumerable: true,
    get: function() {
        return webLightTheme;
    }
});
const _createLightTheme = require("../../utils/createLightTheme.js");
const _brandColors = require("../../global/brandColors.js");
const webLightTheme = (0, _createLightTheme.createLightTheme)(_brandColors.brandWeb);
