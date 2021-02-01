/*
 *  Utility methods for computing with midi, pitch classes, frequencies, etc.
 */
import {Frequency} from 'tone';

// compute interval between two frequencies in unit of cents
export function differenceInCents(a, b) {
    var cents = Math.round(1200 * Math.log(a / b) / Math.log(2));
    cents = (cents < 0 ? "" : "+") + cents; // add +/-
    return cents;
}

// convert midi key number to a properly typeset note name
export function midiToNotation(midi) {
    return Frequency(midi, "midi").toNote().replace(/[0-9]/g, "").replace("#", "\u266f");
}

// returns [0,11] for pitch class
export function toPitchClass(semitones) {
    return ((semitones % 12) + 12) % 12;
}

// play higher frequencies softer
export function volOfFreq(freq) {
    var vol = Math.min(1, 15000 / Math.pow(freq, 2));
    return vol;
}