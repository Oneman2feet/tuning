function equalTempered(note) {
    var freq = Tone.Frequency(note).toFrequency();
    console.log(freq);
    return freq;
}

function shifted(note) {
    var freq = Tone.Frequency(note).toFrequency();
    freq *= 0.05; // operation on frequency
    console.log(freq);
    return freq;
}

function justlyTuned(fundamental, note) {
    var freq = Tone.Frequency(note).toFrequency();
    console.log(freq);
    return freq;
}