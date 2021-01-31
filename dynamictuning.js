/*
 * DYNAMIC TUNING
 */

// given an anchor note, tune the current chord
// using the chord types dictionary
function tuneDynamically(anchor, notes, noteToPlay) {
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
    for (note in notes) {
        var currentName = notes[note].name;
        var currentMidi = notes[note].midi;
        var currentInt = currentChord.midi[currentMidi]
        var currentIndex = chordInt.split(",").findIndex(el => el==currentInt);
        var currentRatio = dynamicTuning.split(":")[currentIndex];
        var currentFreq = harmonicSeriesFundamental * currentRatio;

        // calculate cents difference and change octaves as needed
        var equal = Tone.Frequency(currentName).toFrequency();

        while (parseInt(differenceInCents(currentFreq, equal)) > 600) {
            currentFreq /= 2;
        }

        while (parseInt(differenceInCents(currentFreq, equal)) < -600) {
            currentFreq *= 2;
        }

        // always play this note if this is the noteToPlay
        if (activeNotes[currentName]==noteToPlay) {
            synth.triggerAttack(currentFreq, Tone.now(), volOfFreq(currentFreq));
            activeNotes[currentName] = currentFreq;
        }
        else if (parseInt(differenceInCents(currentFreq, activeNotes[currentName]))!==0)//activeNotes[currentName]!=currentFreq)
        {
            console.log("adjusting note from " + activeNotes[currentName] + " to " + currentFreq);
            // TODO: change pitch without triggering a new attack
            synth.triggerRelease(activeNotes[currentName], Tone.now());
            synth.triggerAttack(currentFreq, Tone.now(), volOfFreq(currentFreq));
            activeNotes[currentName] = currentFreq;
        }
    }
}

function updateDynamicTuning(noteToPlay) {
    if (chordTypes[currentChord.integer]
        && chordTypes[currentChord.integer]
        && chordTypes[currentChord.integer].tuning) {
        var notes = [];
        for (key in activeNotes) {
            if (activeNotes[key]) {
                notes.push({"name": key, "pitchClass": toPitchClass(Tone.Frequency(key).toMidi()), "midi": Tone.Frequency(key).toMidi(), "freq": activeNotes[key]});
            }
        }
        // if the fundamental is being played, anchor around it
        var tonic = toPitchClass(fundamental['semitonesFromC3']);
        var anchor = notes.find(el => el.pitchClass == tonic);
        if (anchor) {
            tuneDynamically(anchor, notes, noteToPlay);
        }
        else {
            // if tonic is not present, anchor on the justly tuned fifth
            var dominant = toPitchClass(parseInt(fundamental['semitonesFromC3']) + 7);
            var anchor = notes.find(el => el.pitchClass == dominant);
            if (anchor) {
                // tune the anchor justly first
                var just = fundamental.frequency / 2 * 3;

                // calculate cents difference and change octaves as needed
                var equal = Tone.Frequency(anchor.name).toFrequency();

                while (parseInt(differenceInCents(just, equal)) > 600) {
                    just /= 2;
                }

                while (parseInt(differenceInCents(just, equal)) < -600) {
                    just *= 2;
                }

                anchor.freq = just;
                tuneDynamically(anchor, notes, noteToPlay);
            }
            else {
                // third option is to anchor around subdominant
                var subdominant = toPitchClass(parseInt(fundamental['semitonesFromC3']) + 5);
                var anchor = notes.find(el => el.pitchClass == subdominant);
                if (anchor) {
                    // tune the anchor justly first
                    var just = fundamental.frequency / 3 * 4;

                    // calculate cents difference and change octaves as needed
                    var equal = Tone.Frequency(anchor.name).toFrequency();

                    while (parseInt(differenceInCents(just, equal)) > 600) {
                        just /= 2;
                    }

                    while (parseInt(differenceInCents(just, equal)) < -600) {
                        just *= 2;
                    }

                    anchor.freq = just;
                    tuneDynamically(anchor, notes, noteToPlay);
                }
                else {
                    if (noteToPlay!==undefined) {
                        synth.triggerAttack(noteToPlay, Tone.now(), volOfFreq(noteToPlay));//, e.velocity);
                    }
                }
            }
        }
    }
    else if (noteToPlay!==undefined) {
        synth.triggerAttack(noteToPlay, Tone.now(), volOfFreq(noteToPlay));//, e.velocity);
    }
}