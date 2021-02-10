import WebMidi from 'webmidi';

WebMidi.enable(function (err) {
    // Inputs
    WebMidi.inputs.forEach((input) => {
        var name = input.name;
        if (!document.querySelector("#inputMidi option[value='" + name + "']")) {
            var option = document.createElement("option");
            option.value = name;
            option.innerHTML = name;
            document.getElementById("inputMidi").appendChild(option);
        }
    });
    // Outputs
    WebMidi.outputs.forEach((output) => {
        var name = output.name;
        if (!document.querySelector("#outputMidi option[value='" + name + "']")) {
            var option = document.createElement("option");
            option.value = name;
            option.innerHTML = name;
            document.getElementById("outputMidi").appendChild(option);
        }
    });
});

export function setupMidiInput(noteon, noteoff) {
    var midiName = document.getElementById("inputMidi").value;

    if (midiName!==undefined) {
        // Retrieve an input by name, id or index
        var input = WebMidi.getInputByName(midiName);

        if (input!==false) {
            // Listen for a 'note on' message on all channels
            input.addListener('noteon', "all", noteon);

            // Listen for a 'note off' message on all channels
            input.addListener('noteoff', "all", noteoff);

            return true; // was able to set up properly
        }
    }
}

export function setupMidiOutput() {
    var midiName = document.getElementById("outputMidi").value;
    var output = WebMidi.getOutputByName(midiName);
    return output;
}