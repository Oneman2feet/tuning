/*
 *  Utility methods that don't make sense in any of the main classes.
 */

// play higher frequencies softer
export function volOfFreq(freq) {
    var vol = Math.min(1, 15000 / Math.pow(freq, 2));
    return vol;
}

// convert slider value to perceptual loudness value [0,1]
export function sliderVolume(value) {
    return 8.3 + 1000 / (-value-20); // y-intercept of -40, x-intercept of 0
}

export function colorFromCents(cents) {
    var sign = parseInt(cents) >= 0 ? 1 : -1;
    var normalized = Math.pow(Math.abs(parseInt(cents)), 0.3) / Math.pow(100, 0.3);
    var hue = 60 + Math.floor(60 * sign * normalized);  // go from green to red
    var saturation = 95; // not completely bright
    var lightness = 40; // a bit darker
    return "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
}