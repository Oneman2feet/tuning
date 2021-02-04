import {lcm} from 'mathjs';
import {Frequency} from 'tone';

import {chordTypes, chordTunings, reduceChord} from './chords.js';
import {differenceInCents, midiToNotation, toPitchClass} from './utility.js';

// GLOBALS
var tuningList = {};

export default function updateMetrics(keyboard, activeNotes) {
    updateNotes(activeNotes);
    updateNoteRatios(keyboard);
    updateImpliedFundamental(keyboard);
    updateLowestSharedOvertone(keyboard, activeNotes);
    //updateStability(activeNotes);
    var currentChord = updateChordNames(activeNotes);
    updateChordTunings();
    updateTuningList(activeNotes);
    return currentChord;
}

function updateNotes(activeNotes) {
    var notes = [];
    for (var key in activeNotes) {
        if (activeNotes[key]) {
            var equal = Frequency(key).toFrequency();
            var cents = differenceInCents(activeNotes[key], equal);
            notes.push({
                "name": key,
                "freq": activeNotes[key],
                "cents": cents
            });
        }
    }
    notes.sort((a, b) => b.freq - a.freq); // high notes first
    notes = notes.map((el) => "<tr><td>" + el.name + "</td><td>" + el.cents + "</td></tr>").join("");
    document.getElementById("notes").innerHTML = notes;
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

function updateLowestSharedOvertone(keyboard, activeNotes) {
    // The lowest shared overtone of a series of notes
    // is by definition the smallest integer solution to
    // ax=by=cz=...
    // where a,b,c are the integer frequency ratios of those notes.
    // When the smallest nonzero integer solution is found,
    // each of these terms will evaluate to the least common multiple
    // of their coefficients.
    // Therefore, the frequency of the lowest overtone can be found
    // as the frequency of the lowest note divided by its coefficient
    //  times the least common multiple of the whole ratio.
    var overtone = "";
    var notes = [];
    for (var key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    if (notes.length > 1)
    {
        notes.sort(); // sort notes lowest to highest
        var x = lcm.apply(this, keyboard.frequencyRatios);
        var freq = x / keyboard.frequencyRatios[0] * notes[0];
        overtone = Frequency(freq).toNote();
    }
    document.getElementById("overtone").innerHTML = overtone;
}

function updateStability(activeNotes) {
    var notes = [];
    var partials = [...Array(Math.pow(2,4)).keys()];
    var stability = "";
    for (var key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    if (notes.length > 1)
    {
        var overtones = notes.map(note => partials.map(partial => note*partial));

        // intersection of sorted arrays, two pointers method using comparitor
        var intersection = function(equal, a, b) {
            var common = [];
            var i = 0;
            var j = 0;

            while (i < a.length && j < b.length)
            {
                if (equal(a[i],b[j])) {
                    common.push(a[i]);
                    i++;
                    j++;
                }
                else if (a[i] < b[j]) {
                    i++;
                }
                else {
                    j++;
                }
            }

            return common
        }

        // loose equality function for two frequencies within one cent
        var isEqual = function(a, b) {
            return parseInt(differenceInCents(a, b))===0;
        }

        // find all shared overtones
        var sharedHarmonics = overtones.reduce(intersection.bind(this, isEqual));
        stability = sharedHarmonics.map(freq => Frequency(freq).toNote()).toString();//sharedHarmonics.length;
    }
    document.getElementById("stability").innerHTML = stability;
}

function updateChordNames(activeNotes) {
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
    var chordType = chordTypes[currentChord.integer];
    if (chordType) {
        // find out what note is the root using the midi mapping
        var rootInt = currentChord.integer.split(",")[chordType.root];
        var rootMidi = Object.keys(currentChord.midi).find(key => currentChord.midi[key]==rootInt);
        var root = midiToNotation(rootMidi);
        if (chordType.notation)
        {
            var bassMidi = Object.keys(currentChord.midi).find(key => currentChord.midi[key]==0);
            var bass = midiToNotation(bassMidi);
            var shortName = chordType.notation.replace("X", root).replace("Y", bass);
            document.getElementById("chordtype").innerHTML = shortName;
        }
        else
        {
            var fullName = root + " " + chordType.type; // old long notation for chord
            document.getElementById("chordtype").innerHTML = fullName;
        }
    }
    else {
        document.getElementById("chordtype").innerHTML = "";
    }
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