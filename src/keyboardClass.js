import Pitch from './pitch.js';
import {chordTypes} from './chordTypes.js';
import Chord from './chord.js';

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
        delete this.pitches[midiNoteNumber];
    }

    get pitchList() {
        return Object.values(this.pitches);
    }

    get chord() {
        return new Chord(this.pitchList);
    }

    // Returns a list of integers in reduced form
    get frequencyRatios() {
        return new Chord(this.pitchList).frequencyRatios;
    }

    // Returns a pitch representing the implied fundamental
    get undertone() {
        return new Chord(this.pitchList).undertone;
    }

    // Returns a pitch representing the lowest shared overtone
    get overtone() {
        return new Chord(this.pitchList).overtone;
    }

    // Returns the lowest pitch
    get bass() {
        return this.pitchList[0];
    }

    // Returns an array of notes in integer notation
    get chordInteger() {
        var notes = this.pitchList;
        return notes.map((pitch) => Pitch.differenceInSemitones(pitch, this.bass));
    }

    // Equivalence class for chords. Reduces all notes to within an octave of the bass.
    get chordClass() {
        return Array.from(new Set(this.chordInteger.map((integer) => integer % 12))).sort((a,b) => a-b);
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