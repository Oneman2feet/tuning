import { colorFromCents } from "./utility";

// GLOBALS
var tuningList = {};

// TODO migrate to chord only?
export function updateMetrics(keyboard) {
    // Pitch analysis
    updateNotes(keyboard);
    updateTuningList(keyboard);

    // Chord analysis
    var chord = keyboard.chord;
    updateNoteRatios(chord);
    updateImpliedFundamental(chord);
    updateLowestSharedOvertone(chord);
    updateChordNames(chord);
    updateChordTunings(chord);

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
    var list = Object.keys(tuningList).sort().map((pitchClass) => "<tr><td>" + pitchClass + "</td><td>" + Array.from(tuningList[pitchClass]).map((cents) => "<span style='color:" + colorFromCents(cents) + ";'>" + cents + "</span>").join(", ") + "</td></tr>").join("");
    document.getElementById("tuningList").innerHTML = list;
}

function updateNoteRatios(chord) {
    document.getElementById("ratios").innerHTML = chord.frequencyRatios.join("/");
}

function updateImpliedFundamental(chord) {
    var undertone = chord.undertone;
    if (undertone) {
        document.getElementById("undertone").innerHTML = undertone.getNoteName();
    }
    else {
        document.getElementById("undertone").innerHTML = "";
    }
}

function updateLowestSharedOvertone(chord) {
    var overtone = chord.overtone;
    if (overtone) {
        document.getElementById("overtone").innerHTML = overtone.getNoteName();
    }
    else {
        document.getElementById("overtone").innerHTML = "";
    }
}

function updateChordNames(chord) {
    var notation = chord.notation;
    var name = chord.name;
    if (notation) {
        document.getElementById("chordtype").innerHTML = notation;
    }
    else if (name) {
        document.getElementById("chordtype").innerHTML = name;
    }
    else {
        document.getElementById("chordtype").innerHTML = "";
    }
}

function updateChordTunings(chord) {
    var tuning = chord.tuning;
    if (tuning) {
        document.getElementById("chordtuning").innerHTML = tuning;
    }
    else {
        document.getElementById("chordtuning").innerHTML = "";
    }
}