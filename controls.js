function setFundamental(freq, semitones) {
    fundamental['frequency'] = freq;
    fundamental['semitonesFromC3'] = semitones;
    tune.tonicize(freq);
    var equal = Tone.Frequency("C3").transpose(semitones);
    document.getElementById("fundamental").innerHTML = "<strong>" + equal.toNote() + "</strong> " + differenceInCents(freq, equal.toFrequency()) + " <em>(" + freq.toFixed(2) + ")</em>";
}

function adjustFundamental(ratio, semitones) {
    var freq = fundamental['frequency'] * ratio;
    var semi = parseInt(fundamental['semitonesFromC3']) + parseInt(semitones);
    setFundamental(freq, semi);
}

window.onload = function() {
    // Controls
    [...document.getElementsByName("temperament")].forEach((elem) => {
        elem.onclick = () => {
            tune.loadScale(elem.value);
        };
    });

    [...document.getElementsByName("tonic")].forEach((elem) => {
        elem.onclick = () => {
            // elem.value is the number of semitones above C3
            var semitones = elem.value
            // set fundamental using equal temperament
            var freq = Tone.Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);
        };
    });

    document.getElementById("clearNotes").onclick = function() {
        synth.releaseAll();
        activeNotes = {};
        updateMetrics();
    }

    document.getElementById("volslider").oninput = function() {
        synth.volume.value =  8.3 + 1000 / (-this.value-20); // y-intercept of -40, x-intercept of 0
    }

    // Start audio system
    document.getElementById("enterBtn").addEventListener('click', async () => {
        var succeeded = setupMidiInput();

        if (succeeded) {
            await Tone.start();

            // create a synth and connect it to the main output (your speakers)
            synth = new Tone.PolySynth().toDestination();

            synth.set({
                "envelope": {
                    "attack": 0.1,
                    "decay": 0
                },
                "oscillator": {
                    "type": "custom", // set to "custom" for partials to be used
                    "partialCount": 16,
                    "partials": [
                        1, 0.1, 0.2, 0.1, 0.2, 0.01,
                        0.008, 0.008, 0.0025, 0.004, 0.0025, 0.0025, 0.004, 0.0025, 0.0005, 0.0025
                    ]
                }
            });

            // set the volume
            synth.volume.value = 8.3 + 1000 / (-document.getElementById("volslider").value-20);

            // create a Tune.js instance
            tune = new Tune();

            // Load the selected scale
            var scale = document.querySelector('input[name="temperament"]:checked').value;
            tune.loadScale(scale);

            // Set the fundamental using equal temperament and checked tonic
            var semitones = document.querySelector('input[name="tonic"]:checked').value;
            var freq = Tone.Frequency("C3").transpose(semitones).toFrequency();
            setFundamental(freq, semitones);

            // change UI
            document.getElementById("enterScreen").className = "entered";
        }
    });
}

WebMidi.enable(function (err) {
    for (input in WebMidi.inputs) {
        var option = document.createElement("option");
        option.value = WebMidi.inputs[input].name;
        option.innerHTML = WebMidi.inputs[input].name;
        document.getElementById("selectMidi").appendChild(option);
    }
});