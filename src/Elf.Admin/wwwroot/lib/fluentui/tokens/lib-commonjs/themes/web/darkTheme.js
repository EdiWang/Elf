"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "webDarkTheme", {
    enumerable: true,
    get: function() {
        return webDarkTheme;
    }
});
const _createDarkTheme = require("../../utils/createDarkTheme.js");
const _brandColors = require("../../global/brandColors.js");
const webDarkTheme = (0, _createDarkTheme.createDarkTheme)(_brandColors.brandWeb);
