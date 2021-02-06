import Pitch from './pitch.js';

function tuneChord(keyboard, anchor, noteToPlay) {
    var chordClass = keyboard.chord.equivalenceClass;
    var dynamicTuning = keyboard.chord.type.tuning;
    var anchorInt = keyboard.chord.getInteger(anchor);

    // based on the frequency ratios of the dynamic tuning
    // and the anchor note and frequency
    // compute the frequencies needed for the chord
    var anchorIndex = chordClass.findIndex(el => el==anchorInt);
    var anchorRatio = dynamicTuning.split(":")[anchorIndex];
    var harmonicSeriesFundamental = anchor.frequencyHz / anchorRatio;

    // for each note in the chord, compute the adjusted frequency to use
    keyboard.pitchList.forEach((pitch) => {
        // determine what the ratio will be above the fundamental
        var currentInteger = keyboard.chord.getInteger(pitch);
        var currentIndex = chordClass.findIndex(el => el==currentInteger);
        var currentRatio = dynamicTuning.split(":")[currentIndex];
        var currPitch = new Pitch(pitch.midiNoteNumber, harmonicSeriesFundamental * currentRatio);
        currPitch.resetOctave();

        // always play this note if this is the noteToPlay
        if (noteToPlay && pitch.midiNoteNumber == noteToPlay.midiNoteNumber) {
            keyboard.play(currPitch);
        }
        // adjust any note that should be retuned
        else if (Pitch.differenceInCents(keyboard.getPitch(pitch.midiNoteNumber), currPitch) !== 0)
        {
            //console.log("adjusting note from " + pitch.toString() + " to " + currPitch.toString());
            keyboard.retune(pitch, currPitch);
        }
    });
}

export default function updateDynamicTuning(keyboard, tune, fundamental, noteToPlay) {
    if (noteToPlay) {
        // add the note without playing it for analysis
        keyboard.addPitch(noteToPlay);
    }

    var chordType = keyboard.chord.type;
    if (chordType && chordType.tuning) {
        var tuned = false;
        var anchorPriority = [0, 7, 5, 9, 2, 4, 11, 3, 8, 10, 1, 6]; // 0=I (tonic), 7=V, 5=IV, 9=vi, 2=ii, 4=iii, 11=vii, 3=biii, 8=bvi, 10=bvii, 1=#I, 6=bV
        var anchorIndex = 0;

        while (!tuned && anchorIndex < anchorPriority.length) {
            // see if anchor is being played
            var anchorPitchClass = Pitch.toPitchClass(fundamental['semitonesFromC3'] + anchorPriority[anchorIndex]);
            var anchor = keyboard.chord.getPitchClass(anchorPitchClass);
            if (anchor) {
                // tune the anchor to the fundamental first
                var just = new Pitch(anchor.midiNoteNumber, tune.note(anchor.midiNoteNumber - fundamental['semitonesFromC3'] - 60, 1));
                just.resetOctave();

                //console.log("tuning around " + just.getNoteName());
                tuneChord(keyboard, just, noteToPlay);

                tuned = true;
            }

            // otherwise move on to the next anchor
            anchorIndex++;
        }
        // Fallback on playing the note
        if (!tuned) {
            console.log("should be impossible");
        }
    }
    else if (noteToPlay) {
        keyboard.play(noteToPlay);
    }
}