import Pitch from './pitch.js';
import Keyboard from './keyboard.js';
import {tuneChord} from './utility.js';

export default function updateDynamicTuning(keyboard, fundamental, noteToPlay) {
    if (noteToPlay) {
        // queue the pitch for analysis
        keyboard.queuePitch(noteToPlay);
    }

    var chordType = keyboard.chord.type;
    if (chordType && chordType.tuning) {
        var tuned = false;
        var anchorPriority = [0, 7, 5, 9, 2, 4, 11, 3, 8, 10, 1, 6]; // 0=I (tonic), 7=V, 5=IV, 9=vi, 2=ii, 4=iii, 11=vii, 3=biii, 8=bvi, 10=bvii, 1=#I, 6=bV
        var anchorIndex = 0;

        while (!tuned && anchorIndex < anchorPriority.length) {
            // see if anchor is being played
            var anchorPitchClass = Pitch.toPitchClass(fundamental.midiNoteNumber + anchorPriority[anchorIndex]);
            var anchor = keyboard.getPlayingPitchClass(anchorPitchClass);

            // leave the new note for last
            // TODO: unless it is the fundamental!!
            if (anchor && ((anchor.pitchClass == fundamental.pitchClass) || !(noteToPlay && noteToPlay.midiNoteNumber == anchor.midiNoteNumber))) {
                tuneChord(keyboard, anchor, noteToPlay);
                tuned = true;
            }

            // otherwise move on to the next anchor
            anchorIndex++;
        }
    }
    else {
        Keyboard.removeAnchor();
    }

    if (noteToPlay) {
        keyboard.pushQueue();
    }
}