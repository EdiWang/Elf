import { Direction } from '../utils/direction.js';
import { limit } from '../utils/numbers.js';
/**
 * Converts a pixel coordinate on the track to a percent of the track's range
 */
export function convertPixelToPercent(pixelPos, minPosition, maxPosition, direction) {
    let pct = limit(0, 1, (pixelPos - minPosition) / (maxPosition - minPosition));
    if (direction === Direction.rtl) {
        pct = 1 - pct;
    }
    return pct;
}
//# sourceMappingURL=slider-utilities.js.map