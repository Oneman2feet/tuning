import WebMidi from 'webmidi';

WebMidi.enable(function (err) {
    for (var input in WebMidi.inputs) {
        var option = document.createElement("option");
        option.value = WebMidi.inputs[input].name;
        option.innerHTML = WebMidi.inputs[input].name;
        document.getElementById("selectMidi").appendChild(option);
    }
});

export default function setupMidiInput(noteon, noteoff) {
    var midiName = document.getElementById("selectMidi").value;

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