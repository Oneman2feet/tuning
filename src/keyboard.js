import './keyboard.css';

import Chord from './chord.js';
import {now} from 'tone';
import {volOfFreq} from './utility.js';

// Constant for which pitch classes are black keys
const blackKeys = [1,3,6,8,10];

// Keyboard class manages the playing of pitches to create chords.
// A pitch can be played or stopped, visual feedback is shown in UI.
// Sound is managed with a synth from tone.js
export default class Keyboard {

    constructor(synth) {
        this.synth = synth;
        this.pitches = {};
    }

    play(pitch) {
        this.synth.triggerAttack(pitch.frequencyHz, now(), volOfFreq(pitch.frequencyHz));
    }

    release(pitch) {
        this.synth.triggerRelease(pitch.frequencyHz, now());
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
        this.synth.releaseAll();
    }

    static draw() {
        var container = document.getElementById("keyboard");
        var midiStart = 36;
        var numKeys = 37;
        for (var i=0; i<numKeys; i++)
        {
            var midiVal = midiStart + i;
            var blackKey = blackKeys.includes(midiVal % 12);
            var key = document.createElement("div");
            key.classList = "key";
            if (blackKey) {
                key.classList.add("blackKey");
            }
            key.dataset.midiValue = midiVal;
            container.appendChild(key);
        }
    }

    static activateKey(pitch) {
        [...document.querySelectorAll('#keyboard .key[data-midi-value="' + pitch.midiNoteNumber + '"]')].forEach((key) => {
            key.classList.add("active");
    
            // annotate key with tuning information
            var cents = pitch.centsFromEqualPrint;
            if (cents != key.innerHTML) {
                if (key.innerHTML!=="") {
                    key.classList.add("newAdjustment");
                }
                key.innerHTML = cents;
            }
            else {
                key.innerHTML = "";
            }
        });
    }

    static deactivateKey(pitch) {
        [...document.querySelectorAll('#keyboard .key[data-midi-value="' + pitch.midiNoteNumber + '"]')].forEach((key) => {
            key.classList.remove("active");
            key.classList.remove("newAdjustment");
        });
    }

    static deactivateAllKeys() {
        [...document.querySelectorAll('#keyboard .key')].forEach((key) => {
            key.classList.remove("active");
        });
    }

    toString() {
        return this.pitchList.map((pitch) => pitch.toString());
    }
}