function setupMidiInput() {
    var midiName = document.getElementById("selectMidi").value;

    if (midiName!==undefined) {
        // Retrieve an input by name, id or index
        var input = WebMidi.getInputByName(midiName);

        if (input!==false) {
            // Listen for a 'note on' message on all channels
            input.addListener('noteon', "all", function (e) {
                // convert from midi to scale
                var note = tune.note(e.note.number - fundamental['semitonesFromC3'] - 60, 1);

                // keep track of this note
                var notename = e.note.name + e.note.octave;
                if (activeNotes[notename]) {
                    console.log("this key is already pressed: " + notename);
                    synth.triggerRelease([activeNotes[notename]], Tone.now());
                }
                else {
                    activeNotes[notename] = note;
                }

                // play note
                //synth.triggerAttack(note, Tone.now(), volOfFreq(note));//, e.velocity);

                updateMetrics();

                // dynamic tuning
                if (document.getElementById("dynamic").checked) {
                    updateDynamicTuning(note); // this also plays the note
                    updateMetrics();
                }
                else {
                    synth.triggerAttack(note, Tone.now(), volOfFreq(note));//, e.velocity);
                }
            });

            // Listen for a 'note off' message on all channels
            input.addListener('noteoff', "all", function (e) {
                // release the note(s) that are currently held from this midi key
                var notename = e.note.name + e.note.octave;
                if (activeNotes[notename]) {
                    synth.triggerRelease([activeNotes[notename]], Tone.now());
                    delete activeNotes[notename];
                }
                else {
                    console.log("released note that was not pressed: " + notename);
                }

                updateMetrics();

                // dynamic tuning
                if (document.getElementById("dynamic").checked) {
                    updateDynamicTuning();
                    updateMetrics();
                }
            });

            return true; // was able to set up properly
        }
    }
}