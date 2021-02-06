import {now, start, PolySynth, Frequency} from 'tone';

import Tune from './tune.js';
import Pitch from './pitch.js'
import Keyboard from './keyboard.js';
import {differenceInCents, volOfFreq} from './utility.js';
import setupMidiInput from './input.js';
import {clearMetrics, updateMetrics} from './metrics.js';
import updateDynamicTuning from './dynamictuning.js';
import './style.css';

var synth;
var tune;
var fundamental = {
   "frequency": undefined,
   "semitonesFromC3": undefined
};

var keyboard;

function setFundamental(freq, semitones) {
    fundamental['frequency'] = freq;
    fundamental['semitonesFromC3'] = semitones;
    tune.tonicize(freq);
    var equal = Frequency("C3").transpose(semitones);
    document.getElementById("fundamental").innerHTML = "<strong>" + equal.toNote() + "</strong> " + differenceInCents(freq, equal.toFrequency()) + " <em>(" + freq.toFixed(2) + ")</em>";
}

function adjustFundamental(ratio, semitones) {
    var freq = fundamental['frequency'] * ratio;
    var semi = parseInt(fundamental['semitonesFromC3']) + parseInt(semitones);
    setFundamental(freq, semi);
}

function noteOn(e) {
    // convert from midi to scale
    var note = tune.note(e.note.number - fundamental['semitonesFromC3'] - 60, 1);

    // Release this note if already playing
    var playing = keyboard.getPitch(e.note.number);
    if (playing) {
        console.log("this key is already pressed: " + playing.getNoteName());
        synth.triggerRelease(playing.frequencyHz, now());
    }

    // Make a pitch
    var pitch = new Pitch(e.note.number, note);
    keyboard.addPitch(pitch);

    updateMetrics(keyboard);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, synth, tune, fundamental, note, e.note.number); // this also plays the note
        updateMetrics(keyboard);
    }
    else {
        synth.triggerAttack(note, now(), volOfFreq(note));//, e.velocity);

        // make this note active in the visualization
        Keyboard.activateKey(pitch);
    }
}

function noteOff(e) {
    // release the note(s) that are currently held from this midi key
    var playing = keyboard.getPitch(e.note.number);
    if (playing) {
        synth.triggerRelease(playing.frequencyHz, now());
        keyboard.removePitch(playing.midiNoteNumber);

        // make this note inactive in the visualization
        Keyboard.deactivateKey(playing);
    }
    else {
        console.log("released note that was not pressed: " + e.note.name + e.note.octave);
    }

    updateMetrics(keyboard);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, synth, tune, fundamental);
        updateMetrics(keyboard);
    }
}

window.onload = function() {
    // Initialize keyboard with UI
    keyboard = new Keyboard();
    Keyboard.draw();

    // Controls
    [...document.getElementsByName("temperament")].forEach((elem) => {
        elem.onclick = () => {
            tune.loadScale(elem.value);
        };
    });

    [...document.getElementsByName("tonic")].forEach((elem) => {
        elem.onclick = () => {
            // elem.value is the number of semitones above C3
            var semitones = elem.value
            // set fundamental using equal temperament
            var freq = Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);
        };
    });

    document.getElementById("clearNotes").onclick = function() {
        synth.releaseAll();
        keyboard.clear();
        Keyboard.deactivateAllKeys();
        clearMetrics(keyboard);
        updateMetrics(keyboard);
    }

    document.getElementById("volslider").oninput = function() {
        synth.volume.value =  8.3 + 1000 / (-this.value-20); // y-intercept of -40, x-intercept of 0
    }

    // Start audio system
    document.getElementById("enterBtn").addEventListener('click', async () => {
        var succeeded = setupMidiInput(noteOn, noteOff);

        if (succeeded) {
            await start();

            // create a synth and connect it to the main output (your speakers)
            synth = new PolySynth().toDestination();

            synth.set({
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

            // set the volume
            synth.volume.value = 8.3 + 1000 / (-document.getElementById("volslider").value-20);

            // create a Tune.js instance
            tune = new Tune();

            // Load the selected scale
            var scale = document.querySelector('input[name="temperament"]:checked').value;
            tune.loadScale(scale);

            // Set the fundamental using equal temperament and checked tonic
            var semitones = document.querySelector('input[name="tonic"]:checked').value;
            var freq = Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);

            // change UI
            document.getElementById("enterScreen").className = "entered";
        }
    });
}