/*
 *  Utility methods for computing with midi, pitch classes, frequencies, etc.
 */

// returns [0,11] for pitch class
function toPitchClass(semitones) {
    return ((semitones % 12) + 12) % 12;
}

// compute interval between two frequencies in unit of cents
function differenceInCents(a, b) {
    var cents = Math.round(1200 * Math.log(a / b) / Math.log(2));
    cents = (cents < 0 ? "" : "+") + cents; // add +/-
    return cents;
}

// convert midi key number to a properly typeset note name
function midiToNotation(midi) {
    return Tone.Frequency(midi, "midi").toNote().replace(/[0-9]/g, "").replace("#", "\u266f");
}

// play higher frequencies softer
function volOfFreq(freq) {
    var vol = Math.min(1, 15000 / Math.pow(freq, 2));
    return vol;
}