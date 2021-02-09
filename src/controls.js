import {start} from 'tone';

import Tune from './tune.js';
import Pitch from './pitch.js'
import Keyboard from './keyboard.js';
import {sliderVolume} from './utility.js';
import setupMidiInput from './input.js';
import {clearMetrics, updateMetrics} from './metrics.js';
import updateDynamicTuning from './dynamictuning.js';
import updateCircleOfFifthsTuning from './circletuning.js';
import './style.css';

var tune;
var fundamental;
var keyboard;

const C4 = 60;

function setFundamental(pitchClass) {
    fundamental = new Pitch(parseInt(pitchClass) + C4);
    tune.tonicize(fundamental.frequencyHz);
    document.getElementById("fundamental").innerHTML = "<strong>" + fundamental.getNoteName() + "</strong> " + fundamental.centsFromEqualPrint + " <em>(" + fundamental.frequencyHz.toFixed(2) + ")</em>";
}

function noteOn(e) {
    // convert from midi to scale
    var note = tune.note(e.note.number - fundamental.midiNoteNumber - 12, 1);

    // Check if this note is already playing
    var playing = keyboard.getPlayingPitch(e.note.number);
    if (playing) {
        console.log("this key is already pressed: " + playing.getNoteName());
    }

    // Make a pitch
    var pitch = new Pitch(e.note.number, note);

    // dynamic and circle of fifths tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, fundamental, pitch); // this also plays the note
    }
    else if (document.getElementById("circle").checked) {
        updateCircleOfFifthsTuning(keyboard, fundamental, pitch); // this also plays the note
    }
    else {
        keyboard.play(pitch);
    }

    updateMetrics(keyboard, fundamental);
}

function noteOff(e) {
    // release the note(s) that are currently held from this midi key
    var playing = keyboard.getPlayingPitch(e.note.number);
    if (playing) {
        keyboard.release(playing);
    }
    else {
        console.log("released note that was not pressed: " + e.note.name + e.note.octave);
    }

    // dynamic and circle of fifths tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, fundamental);
    }
    else if (document.getElementById("circle").checked) {
        updateCircleOfFifthsTuning(keyboard, fundamental);
    }

    updateMetrics(keyboard, fundamental);
}

window.onload = function() {
    // Controls
    [...document.getElementsByName("temperament")].forEach((elem) => {
        elem.onclick = () => {
            tune.loadScale(elem.value);
        };
    });

    [...document.getElementsByName("tonic")].forEach((elem) => {
        elem.onclick = () => {
            // elem.value is the number of semitones above C3
            setFundamental(elem.value);
        };
    });

    document.getElementById("clearNotes").onclick = function() {
        keyboard.clear();
        clearMetrics(keyboard);
    }

    document.getElementById("volslider").oninput = function() {
        keyboard.volume =  sliderVolume(this.value);
    }

    // Start audio system
    document.getElementById("enterBtn").addEventListener('click', async () => {
        var succeeded = setupMidiInput(noteOn, noteOff);
        if (succeeded) {
            // start tone.js
            await start();

            // initialize keyboard
            keyboard = new Keyboard();

            // set the volume
            keyboard.volume = sliderVolume(document.getElementById("volslider").value);

            // create a Tune.js instance
            tune = new Tune();

            // Load the selected scale
            var scale = document.querySelector('input[name="temperament"]:checked').value;
            tune.loadScale(scale);

            // Set the fundamental using equal temperament and checked tonic
            var pitchClass = document.querySelector('input[name="tonic"]:checked').value;
            setFundamental(pitchClass);

            // change UI
            document.getElementById("enterScreen").className = "entered";
        }
    });
}