import {lcm} from 'mathjs';
import {Frequency} from 'tone';

import {chordTypes, chordTunings, reduceChord} from './chords.js';
import {differenceInCents, midiToNotation, toPitchClass} from './utility.js';

// GLOBALS
var tuningList = {};

export default function updateMetrics(keyboard, activeNotes) {
    updateNotes(keyboard);
    updateNoteRatios(keyboard);
    updateImpliedFundamental(keyboard);
    updateLowestSharedOvertone(keyboard);
    var currentChord = updateChordNames(keyboard, activeNotes);
    updateChordTunings();
    updateTuningList(activeNotes);
    return currentChord;
}

function updateNotes(keyboard) {
    var pitches = Object.values(keyboard.pitches).reverse();
    pitches = pitches.map((pitch) => "<tr><td>" + pitch.getNoteName() + "</td><td>" + pitch.centsFromEqualPrint + "</td></tr>").join("");
    document.getElementById("notes").innerHTML = pitches;
}

function updateTuningList(activeNotes) {
    for (var key in activeNotes) {
        if (activeNotes[key]) {
            // calculate notename and cents offset
            var noteName = key.replace(/[0-9]/g, '');
            var equal = Frequency(key).toFrequency();
            var cents = differenceInCents(activeNotes[key], equal);

            // update data structure with new tuning
            if (!tuningList[noteName]) {
                tuningList[noteName] = new Set();
            }
            tuningList[noteName].add(cents);
        }
    }

    // parse tuningList and update UI
    var list = Object.keys(tuningList).sort().map((noteName) => "<tr><td>" + noteName + "</td><td>" + Array.from(tuningList[noteName]).join(", ") + "</td></tr>").join("");
    document.getElementById("tuningList").innerHTML = list;
}

function updateNoteRatios(keyboard) {
    document.getElementById("ratios").innerHTML = keyboard.frequencyRatios.join("/");
}

function updateImpliedFundamental(keyboard) {
    var undertone = keyboard.undertone;
    if (undertone) {
        document.getElementById("undertone").innerHTML = undertone.getNoteName();
    }
    else {
        document.getElementById("undertone").innerHTML = "";
    }
}

function updateLowestSharedOvertone(keyboard) {
    var overtone = keyboard.overtone;
    if (overtone) {
        document.getElementById("overtone").innerHTML = overtone.getNoteName();
    }
    else {
        document.getElementById("overtone").innerHTML = "";
    }
}

function updateChordNames(keyboard, activeNotes) {
    // TODO remove dependency on currentChord data structure
    var currentChord = {};
    var notes = [];
    for (var key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(Frequency(key).toMidi());
        }
    }
    notes.sort();
    var bass = notes[0];
    // make mapping of midi notes to integer notation
    currentChord.midi = {};
    for (var note in notes) {
        currentChord.midi[notes[note]] = toPitchClass(notes[note] - bass);
    }
    // reduce to integer notation, drop all notes to the same octave
    currentChord.integer = [...new Set(notes.map(note => currentChord.midi[note]))].sort((a, b) => a - b).join(",");


    // Using keyboard
    var chordType = keyboard.chordType;
    if (chordType) {
        if (chordType.notation)
        {
            var shortName = chordType.notation.replace("X", keyboard.root.getPitchClassName()).replace("Y", keyboard.bass.getPitchClassName());
            document.getElementById("chordtype").innerHTML = shortName;
        }
        else
        {
            var fullName = keyboard.root.getNoteName() + " " + chordType.type; // old long notation for chord
            document.getElementById("chordtype").innerHTML = fullName;
        }
    }
    else {
        document.getElementById("chordtype").innerHTML = "";
    }

    // TODO remove
    return currentChord;
}

function updateChordTunings() {
    var ratios = document.getElementById("ratios").innerHTML;
    var chordTuning = chordTunings[reduceChord(ratios)];
    if (chordTuning) {
        document.getElementById("chordtuning").innerHTML = chordTuning;
    }
    else {
        document.getElementById("chordtuning").innerHTML = "";
    }
}