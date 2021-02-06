/*
 *  Utility methods that don't make sense in any of the main classes.
 */

// compute interval between two frequencies in unit of cents
export function differenceInCents(a, b) {
    var cents = Math.round(1200 * Math.log(a / b) / Math.log(2));
    cents = (cents < 0 ? "" : "+") + cents; // add +/-
    return cents;
}

// play higher frequencies softer
export function volOfFreq(freq) {
    var vol = Math.min(1, 15000 / Math.pow(freq, 2));
    return vol;
}

// convert slider value to perceptual loudness value [0,1]
export function sliderVolume(value) {
    return 8.3 + 1000 / (-value-20); // y-intercept of -40, x-intercept of 0
}