import Pitch from './pitch.js';
import Scale from './scale.js';
import Keyboard from './keyboard.js';
import CircleOfFifths from './circleoffifths.js';
import updateDynamicTuning from './dynamictuning.js';
import {tuneChord} from './utility.js';

export default function updateCircleOfFifthsTuning(keyboard, fundamental, noteToPlay) {
    if (noteToPlay) {
        // queue the pitch for analysis
        keyboard.queuePitch(noteToPlay);
    }

    var chord = keyboard.chord;
    var chordType = keyboard.chord.type;
    if (chordType && chordType.tuning) {

        // Get the root and type of the current chord
        var root = chord.root;
        var chordType = chord.type;

        // Only move the tonic if the chord is a non-passing chord (major or seventh chord)
        if (chordType.type && chordType.type == "anchor") {
            // If the current tonic is the fundamental, jump wherever you'd like to
            if (CircleOfFifths.getTonic() == fundamental.pitchClass) {
                CircleOfFifths.setTonicPitch(root);
            }
            // If the root of the chord is the fundamental, return to it
            else if (root.pitchClass == fundamental.pitchClass) {
                CircleOfFifths.setTonicPitch(root);
            }
            // If the root of the chord is within two steps away, move towards it
            else if (root.pitchClass == CircleOfFifths.getSupertonic() || root.pitchClass == CircleOfFifths.getDominant()) {
                CircleOfFifths.moveToDominant();
            }
            else if (root.pitchClass == CircleOfFifths.getSubtonic() || root.pitchClass == CircleOfFifths.getSubdominant()) {
                CircleOfFifths.moveToSubdominant();
            }
        }

        // If the root is within one step, tune by circle of fifths ratio with fallback on current root tuning
        if (root.pitchClass == CircleOfFifths.getTonic() || root.pitchClass == CircleOfFifths.getDominant() || root.pitchClass == CircleOfFifths.getSubdominant()) {
            var scale = new Scale(fundamental);
            var ratio = scale.toCircleOfFifthsRatio(root);

            if (ratio) {
                var anchor = new Pitch(root.midiNoteNumber, fundamental.frequencyHz * ratio);
                anchor.resetOctave();
                tuneChord(keyboard, anchor, noteToPlay);
            }
            else {
                tuneChord(keyboard, root, noteToPlay);
            }
        }
        // Otherwise, fallback on dynamic tuning relative to the circle of fifths tonic
        else {
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