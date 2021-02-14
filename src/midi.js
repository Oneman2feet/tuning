import WebMidi from 'webmidi';

export const ALL_NOTES_OFF = 123; // As per MIDI spec https://www.midi.org/specifications-old/item/table-3-control-change-messages-data-bytes-2

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

export function setupMidiInput(noteon, noteoff, midimessage) {
    var midiName = document.getElementById("inputMidi").value;

    if (midiName!==undefined) {
        // Retrieve an input by name, id or index
        var input = WebMidi.getInputByName(midiName);

        if (input!==false) {
            // Listen for a 'note on' message on all channels
            input.addListener('noteon', "all", noteon);

            // Listen for a 'note off' message on all channels
            input.addListener('noteoff', "all", noteoff);

            // Listen for a midi message event
            input.addListener('midimessage', "all", midimessage);

            return true; // was able to set up properly
        }
    }
}

export function setupMidiOutput() {
    var midiName = document.getElementById("outputMidi").value;
    var output = WebMidi.getOutputByName(midiName);
    return output;
}