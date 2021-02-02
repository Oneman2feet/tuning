import {now, Frequency} from 'tone';

import {chordTypes} from './chords.js';
import {differenceInCents, toPitchClass, volOfFreq} from './utility.js';

/*
 * DYNAMIC TUNING
 */

// given an anchor note, tune the current chord
// using the chord types dictionary
function tuneDynamically(synth, anchor, notes, activeNotes, currentChord, noteToPlay) {
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
            activeNotes[currentName] = currentFreq;
        }
        else if (parseInt(differenceInCents(currentFreq, activeNotes[currentName]))!==0)//activeNotes[currentName]!=currentFreq)
        {
            console.log("adjusting note from " + activeNotes[currentName] + " to " + currentFreq);
            // TODO: change pitch without triggering a new attack
            synth.triggerRelease(activeNotes[currentName], now());
            synth.triggerAttack(currentFreq, now(), volOfFreq(currentFreq));
            activeNotes[currentName] = currentFreq;
        }
    }
}

export default function updateDynamicTuning(synth, tune, activeNotes, currentChord, fundamental, noteToPlay) {
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
        var anchorPriority = [0, 7, 5, 9, 2, 4, 11, 3, 1]; // 0=I (tonic), 7=V, 5=IV, 9=vi, 2=ii, 4=iii, 11=vii, 3=biii, 1=#I
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
                tuneDynamically(synth, anchorNote, notes, activeNotes, currentChord, noteToPlay);
                tuned = true;
            }

            // otherwise move on to the next anchor
            anchorIndex++;
        }

        // Fallback on playing the note
        if (!tuned && noteToPlay!==undefined) {
            synth.triggerAttack(noteToPlay, now(), volOfFreq(noteToPlay));//, e.velocity);
        }


        // // if the fundamental is being played, anchor around it
        // var tonic = toPitchClass(fundamental['semitonesFromC3']);
        // var anchor = notes.find(el => el.pitchClass == tonic);
        // if (anchor) {
        //     tuneDynamically(synth, anchor, notes, activeNotes, currentChord, noteToPlay);
        // }
        // else {
        //     // if tonic is not present, anchor on the justly tuned fifth
        //     var dominant = toPitchClass(parseInt(fundamental['semitonesFromC3']) + 7);
        //     var anchor = notes.find(el => el.pitchClass == dominant);
        //     if (anchor) {
        //         // tune the anchor justly first
        //         var just = fundamental.frequency / 2 * 3;

        //         // calculate cents difference and change octaves as needed
        //         var equal = Frequency(anchor.name).toFrequency();

        //         while (parseInt(differenceInCents(just, equal)) > 600) {
        //             just /= 2;
        //         }

        //         while (parseInt(differenceInCents(just, equal)) < -600) {
        //             just *= 2;
        //         }

        //         anchor.freq = just;
        //         tuneDynamically(synth, anchor, notes, activeNotes, currentChord, noteToPlay);
        //     }
        //     else {
        //         // third option is to anchor around subdominant
        //         var subdominant = toPitchClass(parseInt(fundamental['semitonesFromC3']) + 5);
        //         var anchor = notes.find(el => el.pitchClass == subdominant);
        //         if (anchor) {
        //             // tune the anchor justly first
        //             var just = fundamental.frequency / 3 * 4;

        //             // calculate cents difference and change octaves as needed
        //             var equal = Frequency(anchor.name).toFrequency();

        //             while (parseInt(differenceInCents(just, equal)) > 600) {
        //                 just /= 2;
        //             }

        //             while (parseInt(differenceInCents(just, equal)) < -600) {
        //                 just *= 2;
        //             }

        //             anchor.freq = just;
        //             tuneDynamically(synth, anchor, notes, activeNotes, currentChord, noteToPlay);
        //         }
        //         else {
        //             if (noteToPlay!==undefined) {
        //                 synth.triggerAttack(noteToPlay, now(), volOfFreq(noteToPlay));//, e.velocity);
        //             }
        //         }
        //     }
        // }
    }
    else if (noteToPlay!==undefined) {
        synth.triggerAttack(noteToPlay, now(), volOfFreq(noteToPlay));//, e.velocity);
    }
}