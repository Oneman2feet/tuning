import {Frequency} from 'tone';
import {Fraction} from 'mathjs';

export default class Pitch {
    // A Pitch is a midi key played at a particular frequency.
    constructor(midiNoteNumber, frequencyHz) {
        this.midiNoteNumber = midiNoteNumber;

        if (frequencyHz) {
            this.frequencyHz = frequencyHz;
        }
        else {
            // Fallback on equal temperament
            this.frequencyHz = Frequency(midiNoteNumber, "midi").toFrequency();
        }
    }

    // Returns the pitch's equal-tempered counterpart
    get equal() {
        return new Pitch(this.midiNoteNumber);
    }

    // Pitch class is semitones away from C
    get pitchClass() {
        return Pitch.toPitchClass(this.midiNoteNumber);
    }

    // Equivalence class for semitones independant of octave
    // Returns [0, 11]
    static toPitchClass(semitones) {
        return ((semitones % 12) + 12) % 12;
    }

    // Using scientific pitch notation
    getNoteName(useSharps) {
        var notation = Frequency(this.midiNoteNumber, "midi").toNote();
        if (!useSharps && notation.includes("#")) {
            // Flat the note above this one
            notation = Frequency(this.midiNoteNumber + 1, "midi").toNote();
            return notation[0] + "\u266d" + notation.slice(1);
        }
        return notation.replace("#", "\u266f");
    }

    // Without octave numbers
    getPitchClassName(useSharps) {
        return this.getNoteName(useSharps).replace(/[0-9]/g, "");
    }

    // Interval as frequency ratio
    static getFrequencyRatio(pitchA, pitchB) {
        return new Fraction(pitchA.frequencyHz / pitchB.frequencyHz).simplify()
    }

    // Just like subtraction, the result is positive if the first argument is greater
    static differenceInCents(pitchA, pitchB) {
        return Math.round(1200 * Math.log(pitchA.frequencyHz / pitchB.frequencyHz) / Math.log(2));
    }

    static differenceInCentsPrint(pitchA, pitchB) {
        var cents = Pitch.differenceInCents(pitchA, pitchB);
        cents = (cents < 0 ? "" : "+") + cents; // add +/-
        return cents;
    }

    get centsFromEqual() {
        return Pitch.differenceInCents(this, this.equal);
    }

    get centsFromEqualPrint() {
        return Pitch.differenceInCentsPrint(this, this.equal);
    }

    // Just like subtraction, the result is positive if the first argument is greater
    static differenceInSemitones(pitchA, pitchB) {
        return pitchA.midiNoteNumber - pitchB.midiNoteNumber;
    }

    // Moves this pitch by an integer number of octaves
    shiftOctave(number) {
        this.midiNoteNumber += number * 12;
        this.frequencyHz *= Math.pow(2, number);
    }

    // Adjusts the octave of this pitch to match its midi note number
    resetOctave() {
        while (this.centsFromEqual > 600) {
            this.frequencyHz /= 2;
        }

        while (this.centsFromEqual < -600) {
            this.frequencyHz *= 2;
        }
    }

    toString() {
        return this.getNoteName() + " " + this.centsFromEqualPrint;
    }
}