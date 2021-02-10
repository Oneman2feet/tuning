import Pitch from './pitch.js';
import Scale from './scale.js';
import Keyboard from './keyboard.js';
import CircleOfFifths from './circleoffifths.js';
import updateDynamicTuning from './dynamictuning.js';

function tuneChord(keyboard, anchor, noteToPlay) {
    // Update UI
    Keyboard.removeAnchor();
    Keyboard.setAnchor(anchor);

    // based on the frequency ratios of the dynamic tuning
    // and the anchor note and frequency
    // compute the frequencies needed for the chord
    var tuningMap = keyboard.chord.tuningMap;

    var anchorRatio = tuningMap[keyboard.chord.getInteger(anchor)];
    var harmonicSeriesFundamental = anchor.frequencyHz / anchorRatio;

    // for each note in the chord, compute the adjusted frequency to use
    keyboard.chord.pitchList.forEach((pitch) => {
        // determine what the ratio will be above the fundamental
        var currentRatio = keyboard.chord.tuningMap[keyboard.chord.getInteger(pitch)];
        var tuned = new Pitch(pitch.midiNoteNumber, harmonicSeriesFundamental * currentRatio);
        tuned.resetOctave();

        // adjust the noteToPlay without retune since it is still queued
        if (noteToPlay && pitch.midiNoteNumber == noteToPlay.midiNoteNumber) {
            noteToPlay.frequencyHz = tuned.frequencyHz;
        }
        // adjust any note that should be retuned
        else if (Pitch.differenceInCents(pitch, tuned) !== 0)
        {
            keyboard.retune(pitch, tuned);
        }
    });
}

export default function updateCircleOfFifthsTuning(keyboard, fundamental, noteToPlay) {
    if (noteToPlay) {
        // queue the pitch for analysis
        keyboard.queuePitch(noteToPlay);
    }

    var chord = keyboard.chord;
    var chordType = keyboard.chord.type;
    if (chordType && chordType.tuning) {

        // TODO: first detect if a chord is full enough to decide on (aka not just a unison or interval)

        // Get the root of the current chord
        var root = chord.root;

        // If the root of the chord is two steps away, move towards it
        if (root.pitchClass == CircleOfFifths.getSupertonic()) {
            CircleOfFifths.moveToDominant();
        }
        else if (root.pitchClass == CircleOfFifths.getSubtonic()) {
            CircleOfFifths.moveToSubdominant();
        }

        // If the root of the chord is the fundamental, return to it
        if (root.pitchClass == fundamental.pitchClass) {
            CircleOfFifths.setTonicPitch(root);
        }

        // If the root is within one step, tune by circle of fifths ratio with fallback on current root tuning
        if (root.pitchClass == CircleOfFifths.getTonic() || root.pitchClass == CircleOfFifths.getDominant() || root.pitchClass == CircleOfFifths.getSubdominant()) {
            var scale = new Scale(fundamental);
            var ratio = scale.toCircleOfFifthsRatio(root);

            if (ratio) {
                var anchor = new Pitch(root.midiNoteNumber, fundamental.frequencyHz * ratio);
                anchor.resetOctave();
                console.log(anchor.toString());
                tuneChord(keyboard, anchor, noteToPlay);
            }
            else {
                tuneChord(keyboard, root, noteToPlay);
            }
        }
        else {
            console.log("fallback");
            // Otherwise, fallback on dynamic tuning relative to the circle of fifths tonic
            // Todo make the tonic justly tuned
            keyboard.clearQueue();
            updateDynamicTuning(keyboard, new Pitch(CircleOfFifths.getTonic()), noteToPlay)
        }
    }
    else {
        Keyboard.removeAnchor();
    }

    if (noteToPlay) {
        keyboard.pushQueue();
    }
}