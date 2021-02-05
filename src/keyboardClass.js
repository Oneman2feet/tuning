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

    clear() {
        this.pitches = {};
    }

    toString() {
        return this.pitchList.map((pitch) => pitch.toString());
    }
}