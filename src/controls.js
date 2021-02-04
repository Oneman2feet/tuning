import {now, start, PolySynth, Frequency} from 'tone';

import Tune from './tune.js';
import Pitch from './pitch.js'
import Keyboard from './keyboardClass.js';
import {differenceInCents, volOfFreq} from './utility.js';
import setupMidiInput from './input.js';
import {activateKey, deactivateKey, deactivateAllKeys, generateKeyboard} from './keyboard.js';
import updateMetrics from './metrics.js';
import updateDynamicTuning from './dynamictuning.js';
import './style.css';

var synth;
var tune;
var fundamental = {
   "frequency": undefined,
   "semitonesFromC3": undefined
};
var activeNotes = {};

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

    // Make a pitch
    var pitch = new Pitch(e.note.number, note);
    keyboard.addPitch(pitch);
    console.log(keyboard.frequencyRatios);
    //console.log(keyboard.toString());

    // keep track of this note
    var notename = e.note.name + e.note.octave;
    if (activeNotes[notename]) {
        console.log("this key is already pressed: " + notename);
        synth.triggerRelease([activeNotes[notename]], now());
    }
    else {
        activeNotes[notename] = note;
    }

    var currentChord = updateMetrics(activeNotes);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(synth, tune, activeNotes, currentChord, fundamental, note, e.note.number); // this also plays the note
        updateMetrics(activeNotes);
    }
    else {
        synth.triggerAttack(note, now(), volOfFreq(note));//, e.velocity);

        // make this note active in the visualization
        activateKey(e.note.number, note);
    }
}

function noteOff(e) {
    // update keyboard class
    keyboard.removePitch(e.note.number);

    // release the note(s) that are currently held from this midi key
    var notename = e.note.name + e.note.octave;
    if (activeNotes[notename]) {
        synth.triggerRelease([activeNotes[notename]], now());
        delete activeNotes[notename];

        // make this note inactive in the visualization
        deactivateKey(e.note.number);
    }
    else {
        console.log("released note that was not pressed: " + notename);
    }

    var currentChord = updateMetrics(activeNotes);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(synth, tune, activeNotes, currentChord, fundamental);
        updateMetrics(activeNotes);
    }
}

window.onload = function() {
    // UI
    generateKeyboard();

    // Experimental keyboard class
    keyboard = new Keyboard();

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
        activeNotes = {};
        deactivateAllKeys();
        updateMetrics(activeNotes);
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