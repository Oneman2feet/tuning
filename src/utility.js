/*
 *  Utility methods that don't make sense in any of the main classes.
 */
import Pitch from './pitch.js';
import Keyboard from './keyboard.js';

// play higher frequencies softer
export function volOfFreq(freq) {
    var vol = Math.min(1, 15000 / Math.pow(freq, 2));
    return vol;
}

// convert slider value to perceptual loudness value [0,1]
export function sliderVolume(value) {
    if (value == 0) return -Infinity; // go to true zero
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

export function tuneChord(keyboard, anchor, noteToPlay) {
    // Update UI
    Keyboard.removeAnchor();
    Keyboard.setAnchor(anchor);

    // based on the frequency ratios of the dynamic tuning
    // and the anchor note and frequency
    // compute the frequencies needed for the chord
    var tuningMap = keyboard.chord.tuningMap;

    var anchorRatio = tuningMap[keyboard.chord.getInteger(anchor)];
    var harmonicSeriesFundamental = anchor.frequencyHz / anchorRatio;

    // for each note in the chord, compute the adjusted frequency to use
    keyboard.chord.pitchList.forEach((pitch) => {
        // determine what the ratio will be above the fundamental
        var currentRatio = keyboard.chord.tuningMap[keyboard.chord.getInteger(pitch)];
        var tuned = new Pitch(pitch.midiNoteNumber, harmonicSeriesFundamental * currentRatio);
        tuned.resetOctave();

        // adjust the noteToPlay without retune since it is still queued
        if (noteToPlay && pitch.midiNoteNumber == noteToPlay.midiNoteNumber) {
            noteToPlay.frequencyHz = tuned.frequencyHz;
        }
        // adjust any note that should be retuned
        else if (Pitch.differenceInCents(pitch, tuned) !== 0)
        {
            keyboard.retune(pitch, tuned);
        }
    });
}