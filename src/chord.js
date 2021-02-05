import Pitch from './pitch.js';
import {Frequency} from 'tone';
import {gcd, lcm} from 'mathjs';
import {chordTypes, chordTunings} from './chordTypes.js';

export default class Chord {

    // A chord is a collection of pitches
    // Each pitch has an integer representing the interval between it and the bass
    // Pitches should be specified as an array increasing by midiNoteNumber
    constructor(pitchList) {
        this.pitchList = pitchList;
    }

    // Returns a pitch in the chord matching the midi note number, if any
    getPitch(midiNoteNumber) {
        return this.pitchList.find((pitch) => pitch.midiNoteNumber = midiNoteNumber);
    }

    // Returns a pitch in the chord of the given pitch class, if any
    getPitchClass(pitchClass) {
        return this.pitchList.find((pitch) => pitch.pitchClass == pitchClass);
    }

    // Returns a list of integers in reduced form
    get frequencyRatios() {
        if (this.pitchList.length > 1) {
            var ratios = this.pitchList.map((pitch) => Pitch.getFrequencyRatio(pitch, this.bass));
            var den = ratios.reduce((den, ratio) => den * ratio.d, 1);
            var ratios = ratios.map((frac) => Math.round(frac * den)); // rounding for floating point errors
            var greatestCommonDivisor = gcd.apply(null, ratios);
            ratios = ratios.map(ratio => ratio / greatestCommonDivisor); // reduce ratio by gcd
            return ratios;
        }
        return [];
    }

    // Returns a frequency ratio list with octaves reduced
    get frequencyRatioEquivalenceClass() {
        var removeOctave = function(number) {
            var num = parseInt(number);
            while (num % 2 == 0) {
                num /= 2;
            }
            return num;
        };
        return Array.from(new Set(this.frequencyRatios.map(removeOctave))).sort();
    }

    // Returns a pitch representing the implied fundamental
    get undertone() {
        if (this.pitchList.length > 1)
        {
            // The implied fundamental of a series of notes
            // is given by the relative frequency ratios of those notes
            var fundamentalFreq = this.bass.frequencyHz / this.frequencyRatios[0];
            var midiValue = Frequency(fundamentalFreq).toMidi(); // shortcut - round to nearest equal tempered key
            return new Pitch(midiValue, fundamentalFreq);
        }
        return this.bass;
    }

    // Returns a pitch representing the lowest shared overtone
    get overtone() {
        if (this.pitchList.length > 1)
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
            var overtoneFreq = x / ratios[0] * this.bass.frequencyHz;
            var midiValue = Frequency(overtoneFreq).toMidi();
            return new Pitch(midiValue, overtoneFreq);
        }
        return this.bass;
    }

    get tuning() {
        return chordTunings[this.frequencyRatioEquivalenceClass.join("/")];
    }

    // Returns the lowest pitch
    get bass() {
        return this.pitchList[0];
    }

    // Returns an array of notes in integer notation
    get integerNotation() {
        return this.pitchList.map((pitch) => Pitch.differenceInSemitones(pitch, this.bass));
    }

    // Integer notation with all notes reduced to within an octave of the bass.
    get equivalenceClass() {
        return Array.from(new Set(this.integerNotation.map((integer) => integer % 12))).sort((a,b) => a-b);
    }

    // Returns the integer notation of a given pitch relative to the current chord
    // Assumes that this pitch is in the chord already
    getInteger(pitch) {
        return Pitch.differenceInSemitones(pitch, this.bass) % 12;
    }

    // Returns an object mapping a pitch to its value in single octave integer notation
    get equivalenceClassMap() {
        var map = {};
        this.pitchList.forEach((pitch) => {
            map[pitch] = this.getInteger(pitch);
        });
        return map;
    }

    get type() {
        return chordTypes[this.equivalenceClass.join(",")];
    }

    get name() {
        var type = this.type;
        if (type) {
            return this.root.getNoteName() + " " + type.name;
        }
    }

    get notation() {
        var type = this.type;
        if (type && type.notation) {
            return type.notation.replace("X", this.root.getPitchClassName()).replace("Y", this.bass.getPitchClassName());
        }
    }

    // Returns the pitch corresponding to the root of the chord as per chord inference.
    get root() {
        var rootInteger = this.equivalenceClass[this.type.root];
        var bass = this.bass;

        // find the lowest pitch matching the root
        return this.pitchList.find((pitch) => Pitch.differenceInSemitones(pitch, bass) == rootInteger);
    }

    toString() {
        return this.pitchList.map((pitch) => pitch.toString());
    }
}