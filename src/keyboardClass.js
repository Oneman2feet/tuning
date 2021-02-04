import Pitch from './pitch.js';
import {Frequency} from 'tone';
import {gcd, lcm} from 'mathjs';
import {chordTypes} from './chords.js';

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

    // Returns a pitch of the given pitch class, if any
    getPitchClass(pitchClass) {
        return this.pitchList.find((pitch) => pitch.pitchClass == pitchClass);
    }

    removePitch(midiNoteNumber) {
        console.log("removing " + midiNoteNumber);
        delete this.pitches[midiNoteNumber];
    }

    get pitchList() {
        return Object.values(this.pitches);
    }

    // Returns a list of integers in reduced form
    get frequencyRatios() {
        var notes = this.pitchList;
        if (notes.length > 1) {
            var ratios = notes.map((pitch) => Pitch.getFrequencyRatio(pitch, notes[0]));
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
        var notes = this.pitchList;
        if (notes.length > 1)
        {
            // The implied fundamental of a series of notes
            // is given by the relative frequency ratios of those notes
            var fundamentalFreq = this.bass.frequencyHz / this.frequencyRatios[0];
            var midiValue = Frequency(fundamentalFreq).toMidi(); // shortcut - round to nearest equal tempered key
            return new Pitch(midiValue, fundamentalFreq);
        }
        return notes[0];
    }

    // Returns a pitch representing the lowest shared overtone
    get overtone() {
        var notes = this.pitchList;
        if (notes.length > 1)
        {
            // The lowest shared overtone of a series of notes
            // is by definition the smallest integer solution to
            // ax=by=cz=...
            // where a,b,c are the integer frequency ratios of those notes.
            // When the smallest nonzero integer solution is found,
            // each of these terms will evaluate to the least common multiple
            // of their coefficients.
            // Therefore, the frequency of the lowest overtone can be found
            // as the frequency of the lowest note divided by its coefficient
            //  times the least common multiple of the whole ratio.
            var ratios = this.frequencyRatios;
            var x = lcm.apply(this, ratios);
            var overtoneFreq = x / ratios[0] * notes[0].frequencyHz;
            var midiValue = Frequency(overtoneFreq).toMidi();
            return new Pitch(midiValue, overtoneFreq);
        }
        return notes[0];
    }

    // Returns the lowest pitch
    get bass() {
        return this.pitchList[0];
    }

    // Returns an array of notes in integer notation
    get chord() {
        var notes = this.pitchList;
        return notes.map((pitch) => Pitch.differenceInSemitones(pitch, this.bass));
    }

    // Equivalence class for chords. Reduces all notes to within an octave of the bass.
    get chordClass() {
        return Array.from(new Set(this.chord.map((integer) => integer % 12))).sort((a,b) => a-b);
    }

    // Returns the integer notation of a given pitch relative to the current chord
    // Assumes that this pitch is in the chord already
    getInteger(pitch) {
        return Pitch.differenceInSemitones(pitch, this.bass) % 12;
    }

    get chordType() {
        return chordTypes[this.chordClass.join(",")];
    }

    // Returns the pitch corresponding to the root of the chord as per chord inference.
    get root() {
        var rootInteger = this.chordClass[this.chordType.root];
        var bass = this.bass;

        // find the lowest pitch matching the root
        return this.pitchList.find((pitch) => Pitch.differenceInSemitones(pitch, bass) == rootInteger);
    }

    clear() {
        this.pitches = {};
    }

    toString() {
        return this.pitchList.map((pitch) => pitch.toString());
    }
}