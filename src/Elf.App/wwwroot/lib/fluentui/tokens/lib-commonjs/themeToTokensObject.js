"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "themeToTokensObject", {
    enumerable: true,
    get: function() {
        return themeToTokensObject;
    }
});
function themeToTokensObject(theme) {
    const tokens = {};
    const keys = Object.keys(theme);
    for (const key of keys){
        tokens[key] = `var(--${String(key)})`;
    }
    return tokens;
}
