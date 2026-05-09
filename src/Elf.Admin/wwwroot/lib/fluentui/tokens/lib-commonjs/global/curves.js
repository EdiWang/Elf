"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "curves", {
    enumerable: true,
    get: function() {
        return curves;
    }
});
const curves = {
    curveAccelerateMax: 'cubic-bezier(0.9,0.1,1,0.2)',
    curveAccelerateMid: 'cubic-bezier(1,0,1,1)',
    curveAccelerateMin: 'cubic-bezier(0.8,0,0.78,1)',
    curveDecelerateMax: 'cubic-bezier(0.1,0.9,0.2,1)',
    curveDecelerateMid: 'cubic-bezier(0,0,0,1)',
    curveDecelerateMin: 'cubic-bezier(0.33,0,0.1,1)',
    curveEasyEaseMax: 'cubic-bezier(0.8,0,0.2,1)',
    curveEasyEase: 'cubic-bezier(0.33,0,0.67,1)',
    curveLinear: 'cubic-bezier(0,0,1,1)'
};
