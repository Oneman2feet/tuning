import Pitch from './pitch.js';
import {Frequency} from 'tone';
import {gcd} from 'mathjs';

export default class Keyboard {
    constructor() {
        this.pitches = {};
    }

    addPitch(pitch) {
        // todo check if already added
        this.pitches[pitch.midiNoteNumber] = pitch;
    }

    getPitch(midiNoteNumber) {
        return this.pitches[midiNoteNumber];
    }

    removePitch(midiNoteNumber) {
        delete this.pitches[midiNoteNumber];
    }

    // Returns a list of integers in reduced form
    get frequencyRatios() {
        var notes = Object.values(this.pitches);
        if (notes.length > 1) {
            var lowest = notes[0];
            var ratios = notes.map((pitch) => Pitch.getFrequencyRatio(pitch, lowest));
            var den = ratios.reduce((den, ratio) => den * ratio.d, 1);
            var ratios = ratios.map((frac) => Math.round(frac * den)); // rounding for floating point errors
            var greatestCommonDivisor = gcd.apply(null, ratios);
            ratios = ratios.map(ratio => ratio / greatestCommonDivisor); // reduce ratio by gcd
            return ratios;
        }
        return [];
    }

    // Returns a pitch representing the implied fundamental
    get undertone() {
        var notes = Object.values(this.pitches);
        if (notes.length > 1)
        {
            // The implied fundamental of a series of notes
            // is given by the relative frequency ratios of those notes
            var fundamentalFreq = notes[0].frequencyHz / this.frequencyRatios[0];
            var midiValue = Frequency(fundamentalFreq).toMidi(); // shortcut - round to nearest equal tempered key
            return new Pitch(midiValue, fundamentalFreq);
        }
        return notes[0];
    }

    clear() {
        this.pitches = {};
    }

    toString() {
        return Object.values(this.pitches).map((pitch) => pitch.toString());
    }
}