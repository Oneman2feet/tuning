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

    // Pitch class is semitones away from C
    // Returns [0, 11]
    get pitchClass() {
        return ((this.midiNoteNumber % 12) + 12) % 12;
    }

    // Using scientific pitch notation
    getNoteName(useFlats) {
        var notation = Frequency(this.midiNoteNumber, "midi").toNote();
        if (useFlats && notation.includes("#")) {
            // Flat the note above this one
            notation = Frequency(this.midiNoteNumber + 1, "midi").toNote();
            return notation[0] + "\u266d" + notation.slice(1);
        }
        return notation.replace("#", "\u266f");
    }

    // Without octave numbers
    getPitchClassName(useFlats) {
        return this.getNoteName(useFlats).replace(/[0-9]/g, "");
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
        var equal = new Pitch(this.midiNoteNumber);
        return Pitch.differenceInCents(this, equal);
    }

    get centsFromEqualPrint() {
        var equal = new Pitch(this.midiNoteNumber);
        return Pitch.differenceInCentsPrint(this, equal);
    }

    // Just like subtraction, the result is positive if the first argument is greater
    static differenceInSemitones(pitchA, pitchB) {
        return pitchA.midiNoteNumber -  pitchB.midiNoteNumber;
    }

    toString() {
        return this.getNoteName() + " " + this.centsFromEqualPrint;
    }
}