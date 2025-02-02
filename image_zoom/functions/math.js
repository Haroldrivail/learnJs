/**
 * Clamps a value between min and max
 * @param {number} value - value to clamp
 * @param {number} min - minimum value
 * @param {number} max - maximum value
 * @returns {number} clamped value
 */
export function clamp(value, min, max) {
    // if (value> max) {
    //     return max;
    // }else if (value < min) { 
    //     return min;
    // }
    // return value;

    return Math.min(Math.max(value, min), max);
}