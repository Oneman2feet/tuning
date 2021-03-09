import Pitch from './pitch.js';
import Keyboard from './keyboard.js';
import {tuneChord} from './utility.js';

export default function updateFollowedTuning(keyboard, fundamental, noteToPlay) {
    if (noteToPlay) {
        // queue the pitch for analysis
        keyboard.queuePitch(noteToPlay);
    }

    var chordType = keyboard.chord.type;
    if (chordType && chordType.tuning) {
        var followed = keyboard.getFollowedPitch();
        if (followed) {
            tuneChord(keyboard, followed, noteToPlay);
        }
        else {
            console.log("nothing to follow");
        }
    }
    else {
        Keyboard.removeAnchor();
    }
    
    if (noteToPlay) {
        keyboard.pushQueue();
    }
}