import './keyboard.css';

import Chord from './chord.js';
import {now, PolySynth} from 'tone';
import {colorFromCents, volOfFreq} from './utility.js';

// Constant for which pitch classes are black keys
const blackKeys = [1,3,6,8,10];

// Keyboard class manages the playing of pitches to create chords.
// A pitch can be played or stopped, visual feedback is shown in UI.
// Sound is managed with a synth from tone.js
export default class Keyboard {

    constructor() {
        // create a synth and connect it to the main output
        this.synth = new PolySynth().toDestination();

        // configure the synth
        this.synth.set({
            "envelope": {
                "attack": 0.1,
                "decay": 0
            },
            "oscillator": {
                "type": "custom", // set to "custom" for partials to be used
                "partialCount": 16,
                "partials": [
                    1, 0.1, 0.2, 0.1, 0.2, 0.01,
                    0.008, 0.008, 0.0025, 0.004, 0.0025, 0.0025, 0.004, 0.0025, 0.0005, 0.0025
                ]
            }
        });

        // no notes playing yet, none queued
        this.pitches = {};
        this.queue = [];

        // initialize UI
        Keyboard.draw();
    }

    play(pitch) {
        // Sound
        this.synth.triggerAttack(pitch.frequencyHz, now(), volOfFreq(pitch.frequencyHz));
        // Data
        this.addPlayingPitch(pitch);
        // Visual
        Keyboard.activateKey(pitch);
    }

    release(pitch) {
        // Sound
        this.synth.triggerRelease(pitch.frequencyHz, now());
        // Data
        this.removePlayingPitch(pitch.midiNoteNumber);
        // Visual
        Keyboard.deactivateKey(pitch);
    }

    // TODO: change pitch without triggering a new attack
    retune(pitch, newPitch) {
        // Sound
        this.synth.triggerRelease(pitch.frequencyHz, now());
        this.synth.triggerAttack(newPitch.frequencyHz, now(), volOfFreq(newPitch.frequencyHz));
        // Data
        if (pitch.midiNoteNumber == newPitch.midiNoteNumber) {
            //this.pitches[pitch.midiNoteNumber] = newPitch;
            pitch.frequencyHz = newPitch.frequencyHz;
        }
        else {
            console.log("trying to retune two pitches of different midi note numbers");
        }
        // Visual
        Keyboard.deactivateKey(pitch);
        Keyboard.activateKey(newPitch);
    }

    clear() {
        // Sound
        this.synth.releaseAll();
        // Data
        this.pitches = {};
        // Visual
        Keyboard.deactivateAllKeys();
    }

    set volume(volume) {
        this.synth.volume.value = volume;
    }

    addPlayingPitch(pitch) {
        // todo check if already added
        this.pitches[pitch.midiNoteNumber] = pitch;
    }

    // Add a pitch to be played at a later time, used for chord analysis
    queuePitch(pitch) {
        this.queue.push(pitch);
    }

    // Play all notes in the queue
    pushQueue() {
        this.queue.forEach((pitch) => {
            this.play(pitch);
        });
        this.queue = [];
    }

    getPlayingPitch(midiNoteNumber) {
        return this.pitches[midiNoteNumber];
    }

    // Returns a pitch of the given pitch class, if any playing
    getPlayingPitchClass(pitchClass) {
        return this.pitchList.find((pitch) => pitch.pitchClass == pitchClass);
    }

    removePlayingPitch(midiNoteNumber) {
        delete this.pitches[midiNoteNumber];
    }

    // List of all playing pitches
    get pitchList() {
        return Object.values(this.pitches);
    }

    // Chord using all playing and queued pitches
    get chord() {
        return new Chord(this.pitchList.concat(this.queue).sort((a, b) => a.frequencyHz - b.frequencyHz));
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
            key.style.backgroundColor = colorFromCents(pitch.centsFromEqualPrint);
    
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
            key.style.backgroundColor = "";
        });
    }

    static deactivateAllKeys() {
        [...document.querySelectorAll('#keyboard .key')].forEach((key) => {
            key.classList.remove("active");
            key.style.backgroundColor = "";
        });
    }

    static setAnchor(pitch) {
        [...document.querySelectorAll('#keyboard .key[data-midi-value="' + pitch.midiNoteNumber + '"]')].forEach((key) => {
            key.classList.add("anchor");
        });
    }

    static removeAnchor() {
        [...document.querySelectorAll('#keyboard .key')].forEach((key) => {
            key.classList.remove("anchor");
        });
    }

    toString() {
        return "Playing: " + this.pitchList.map((pitch) => pitch.toString()) + "; Queued: " + this.queue.map((pitch) => pitch.toString());
    }
}