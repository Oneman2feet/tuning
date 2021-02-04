import {Frequency} from 'tone';

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
        return noteName(useFlats).replace(/[0-9]/g, "");
    }

    // Just like subtraction, the result is positive if the first argument is greater
    differenceInCents(pitchA, pitchB) {
        return Math.round(1200 * Math.log(pitchA.frequencyHz / pitchB.frequencyHz) / Math.log(2));
    }

    differenceInCentsPrint(pitchA, pitchB) {
        var cents = differenceInCents(pitchA, pitchB);
        cents = (cents < 0 ? "" : "+") + cents; // add +/-
        return cents;
    }

    get centsFromEqual() {
        var equal = new Pitch(midiNoteNumber);
        return differenceInCents(this, equal);
    }
}