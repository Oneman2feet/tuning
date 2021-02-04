import Pitch from './pitch.js';
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

    clear() {
        this.pitches = {};
    }

    toString() {
        return Object.values(this.pitches).map((pitch) => pitch.toString());
    }
}