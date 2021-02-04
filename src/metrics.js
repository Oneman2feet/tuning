import {chordTunings, reduceChord} from './chords.js';

// GLOBALS
var tuningList = {};

export function updateMetrics(keyboard) {
    updateNotes(keyboard);
    updateNoteRatios(keyboard);
    updateImpliedFundamental(keyboard);
    updateLowestSharedOvertone(keyboard);
    updateChordNames(keyboard);
    updateChordTunings(keyboard);
    updateTuningList(keyboard);
}

export function clearMetrics(keyboard) {
    tuningList = {};
    updateTuningList(keyboard);
}

function updateNotes(keyboard) {
    var pitches = keyboard.pitchList.reverse();
    pitches = pitches.map((pitch) => "<tr><td>" + pitch.getNoteName() + "</td><td>" + pitch.centsFromEqualPrint + "</td></tr>").join("");
    document.getElementById("notes").innerHTML = pitches;
}

function updateTuningList(keyboard) {
    keyboard.pitchList.forEach((pitch) => {
        var pitchClass = pitch.getPitchClassName();
        if (!tuningList[pitchClass]) {
            tuningList[pitchClass] = new Set();
        }
        // update data structure with new tuning
        tuningList[pitchClass].add(pitch.centsFromEqualPrint);
    });

    // parse tuningList and update UI
    var list = Object.keys(tuningList).sort().map((pitchClass) => "<tr><td>" + pitchClass + "</td><td>" + Array.from(tuningList[pitchClass]).join(", ") + "</td></tr>").join("");
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

function updateChordNames(keyboard) {
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
}

function updateChordTunings(keyboard) {
    var ratios = keyboard.frequencyRatios.join("/");
    var chordTuning = chordTunings[reduceChord(ratios)];
    if (chordTuning) {
        document.getElementById("chordtuning").innerHTML = chordTuning;
    }
    else {
        document.getElementById("chordtuning").innerHTML = "";
    }
}