import {start, Frequency} from 'tone';

import Tune from './tune.js';
import Pitch from './pitch.js'
import Keyboard from './keyboard.js';
import {differenceInCents, sliderVolume} from './utility.js';
import setupMidiInput from './input.js';
import {clearMetrics, updateMetrics} from './metrics.js';
import updateDynamicTuning from './dynamictuning.js';
import './style.css';

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

function noteOn(e) {
    // convert from midi to scale
    var note = tune.note(e.note.number - fundamental['semitonesFromC3'] - 60, 1);

    // Check if this note is already playing
    var playing = keyboard.getPitch(e.note.number);
    if (playing) {
        console.log("this key is already pressed: " + playing.getNoteName());
    }

    // Make a pitch
    var pitch = new Pitch(e.note.number, note);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, tune, fundamental, pitch); // this also plays the note
        updateMetrics(keyboard);
    }
    else {
        keyboard.play(pitch);
    }

    updateMetrics(keyboard);
}

function noteOff(e) {
    // release the note(s) that are currently held from this midi key
    var playing = keyboard.getPitch(e.note.number);
    if (playing) {
        keyboard.release(playing);
    }
    else {
        console.log("released note that was not pressed: " + e.note.name + e.note.octave);
    }

    updateMetrics(keyboard);

    // dynamic tuning
    if (document.getElementById("dynamic").checked) {
        updateDynamicTuning(keyboard, tune, fundamental);
        updateMetrics(keyboard);
    }
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
            var semitones = elem.value
            // set fundamental using equal temperament
            var freq = Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);
        };
    });

    document.getElementById("clearNotes").onclick = function() {
        keyboard.clear();
        clearMetrics(keyboard);
        updateMetrics(keyboard);
    }

    document.getElementById("volslider").oninput = function() {
        keyboard.volume =  sliderVolume(this.value);
    }

    // Start audio system
    document.getElementById("enterBtn").addEventListener('click', async () => {
        var succeeded = setupMidiInput(noteOn, noteOff);

        if (succeeded) {
            // start the audio system
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
            var semitones = document.querySelector('input[name="tonic"]:checked').value;
            var freq = Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);

            // change UI
            document.getElementById("enterScreen").className = "entered";
        }
    });
}