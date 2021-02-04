import {now, Frequency} from 'tone';

import {chordTypes} from './chords.js';
import {differenceInCents, toPitchClass, volOfFreq} from './utility.js';
import {activateKey} from './keyboard.js';
import Pitch from './pitch.js';

/*
 * DYNAMIC TUNING
 */

// given an anchor note, tune the current chord
// using the chord types dictionary
function tuneDynamically(keyboard, synth, anchor, notes, activeNotes, currentChord, noteToPlay) {
    var chordInt = currentChord.integer;
    var dynamicTuning = chordTypes[chordInt].tuning;
    var anchorInt = currentChord.midi[anchor.midi];

    // based on the frequency ratios of the dynamic tuning
    // and the anchor note and frequency
    // compute the frequencies needed for the chord
    var anchorIndex = chordInt.split(",").findIndex(el => el==anchorInt);
    var anchorRatio = dynamicTuning.split(":")[anchorIndex];
    var harmonicSeriesFundamental = anchor.freq / anchorRatio;

    // for each note in the chord, compute the adjusted frequency to use
    for (var note in notes) {
        var currentName = notes[note].name;
        var currentMidi = notes[note].midi;
        var currentInt = currentChord.midi[currentMidi]
        var currentIndex = chordInt.split(",").findIndex(el => el==currentInt);
        var currentRatio = dynamicTuning.split(":")[currentIndex];
        var currentFreq = harmonicSeriesFundamental * currentRatio;

        // calculate cents difference and change octaves as needed
        var equal = Frequency(currentName).toFrequency();

        while (parseInt(differenceInCents(currentFreq, equal)) > 600) {
            currentFreq /= 2;
        }

        while (parseInt(differenceInCents(currentFreq, equal)) < -600) {
            currentFreq *= 2;
        }

        // always play this note if this is the noteToPlay
        if (activeNotes[currentName]==noteToPlay) {
            synth.triggerAttack(currentFreq, now(), volOfFreq(currentFreq));
            keyboard.addPitch(new Pitch(currentMidi, currentFreq));
            activeNotes[currentName] = currentFreq;

            // update visualization
            activateKey(currentMidi, currentFreq);
        }
        else if (parseInt(differenceInCents(currentFreq, activeNotes[currentName]))!==0)//activeNotes[currentName]!=currentFreq)
        {
            console.log("adjusting note from " + activeNotes[currentName] + " to " + currentFreq);
            // TODO: change pitch without triggering a new attack
            synth.triggerRelease(activeNotes[currentName], now());
            synth.triggerAttack(currentFreq, now(), volOfFreq(currentFreq));
            keyboard.getPitch(currentMidi).frequencyHz = currentFreq;
            activeNotes[currentName] = currentFreq;

            // update visualization
            activateKey(currentMidi, currentFreq);
        }
    }
}

export default function updateDynamicTuning(keyboard, synth, tune, activeNotes, currentChord, fundamental, noteToPlay, noteToPlayMidi) {
    if (chordTypes[currentChord.integer]
        && chordTypes[currentChord.integer]
        && chordTypes[currentChord.integer].tuning) {
        var notes = [];
        for (var key in activeNotes) {
            if (activeNotes[key]) {
                notes.push({"name": key, "pitchClass": toPitchClass(Frequency(key).toMidi()), "midi": Frequency(key).toMidi(), "freq": activeNotes[key]});
            }
        }

        var tuned = false;
        var anchorPriority = [0, 7, 5, 9, 2, 4, 11, 3, 8, 10, 1, 6]; // 0=I (tonic), 7=V, 5=IV, 9=vi, 2=ii, 4=iii, 11=vii, 3=biii, 8=bvi, 10=bvii, 1=#I, 6=bV
        var anchorIndex = 0;

        while (!tuned && anchorIndex < anchorPriority.length) {
            // see if anchor is being played
            var anchorPitch = toPitchClass(fundamental['semitonesFromC3'] + anchorPriority[anchorIndex]);
            var anchorNote = notes.find(el => el.pitchClass == anchorPitch);

            // if so, tune around it
            if (anchorNote) {
                // tune the anchor to the fundamental first
                var just = tune.note(anchorNote.midi - fundamental['semitonesFromC3'] - 60, 1);

                // calculate cents difference and change octaves as needed
                var equal = Frequency(anchorNote.name).toFrequency();

                while (parseInt(differenceInCents(just, equal)) > 600) {
                    just /= 2;
                }

                while (parseInt(differenceInCents(just, equal)) < -600) {
                    just *= 2;
                }

                anchorNote.freq = just;

                console.log("tuning around "+anchorNote.name);
                tuneDynamically(keyboard, synth, anchorNote, notes, activeNotes, currentChord, noteToPlay);
                tuned = true;
            }

            // otherwise move on to the next anchor
            anchorIndex++;
        }

        // Fallback on playing the note
        if (!tuned && noteToPlay!==undefined) {
            synth.triggerAttack(noteToPlay, now(), volOfFreq(noteToPlay));//, e.velocity);
            keyboard.addPitch(new Pitch(noteToPlayMidi, noteToPlay));

            // update visualization
            activateKey(noteToPlayMidi, noteToPlay);
        }
    }
    else if (noteToPlay!==undefined) {
        synth.triggerAttack(noteToPlay, now(), volOfFreq(noteToPlay));//, e.velocity);
        keyboard.addPitch(new Pitch(noteToPlayMidi, noteToPlay));

        // update visualization
        activateKey(noteToPlayMidi, noteToPlay);
    }
}