import { Direction } from '../utils/direction.js';
/**
 * Converts a pixel coordinate on the track to a percent of the track's range
 */
export declare function convertPixelToPercent(pixelPos: number, minPosition: number, maxPosition: number, direction?: Direction): number;
