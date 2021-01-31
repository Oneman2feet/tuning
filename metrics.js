// GLOBALS
var activeNoteRatios;
var currentChord = {
    "midi": {}, // mapping of midi to integer
    "integer": "" // comma delimited integer notation
};

function updateMetrics() {
    updateNotes();
    updateNoteRatios();
    updateImpliedFundamental();
    updateLowestSharedOvertone();
    //updateStability();
    updateChordNames();
    updateChordTunings();
}

function updateNotes() {
    var notes = [];
    for (key in activeNotes) {
        if (activeNotes[key]) {
            var equal = Tone.Frequency(key).toFrequency();
            var cents = differenceInCents(activeNotes[key], equal);
            notes.push({
                "name": key,
                "freq": activeNotes[key],
                "cents": cents
            });
        }
    }
    notes.sort((a, b) => b.freq - a.freq); // high notes first
    notes = notes.map((el) => "<tr><td>" + el.name+"</td><td>" + el.cents + "</td></tr>").join("");
    document.getElementById("notes").innerHTML = notes;
}

function updateNoteRatios() {
    var notes = [];
    var ratios = "";
    for (key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    notes.sort((a, b) => a - b);
    if (notes.length > 1) {
        var lowest = notes[0];
        notes = notes.map(note => new Fraction(note / lowest).simplify());
        var den = 1;
        for (note in notes) {
            den *= notes[note].d;
        }
        notes = notes.map(note => Math.round(note * den)); // rounding for floating point errors

        var gcd = math.gcd.apply(null, notes); // reduce ration by gcd
        notes = notes.map(note => note / gcd);
        activeNoteRatios = notes.slice(0); // clone array
        ratios = notes.join("/");
    }
    document.getElementById("ratios").innerHTML = ratios;
}

function updateImpliedFundamental() {
    // The implied fundamental of a series of notes
    // is given by the relative frequency ratios of those notes
    undertone = "";
    var notes = [];
    for (key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    if (notes.length > 1)
    {
        notes.sort(); // sort notes lowest to highest
        var fundamental = notes[0] / activeNoteRatios[0];
        undertone = Tone.Frequency(fundamental).toNote();
    }
    document.getElementById("undertone").innerHTML = undertone;
}

function updateLowestSharedOvertone() {
    // The lowest shared overtone of a series of notes
    // is by definition the smallest integer solution to
    // ax=by=cz=...
    // where a,b,c are the integer frequency ratios of those notes.
    // When the smallest nonzero integer solution is found,
    // each of these terms will evaluate to the least common multiple
    // of their coefficients.
    // Therefore, the frequency of the lowest overtone can be found
    // as the frequency of the lowest note divided by its coefficient
    //  times the least common multiple of the whole ratio.
    overtone = "";
    var notes = [];
    for (key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    if (notes.length > 1)
    {
        notes.sort(); // sort notes lowest to highest
        var x = math.lcm.apply(this, activeNoteRatios);
        var freq = x / activeNoteRatios[0] * notes[0];
        overtone = Tone.Frequency(freq).toNote();
    }
    document.getElementById("overtone").innerHTML = overtone;
}

function updateStability() {
    var notes = [];
    var partials = [...Array(Math.pow(2,4)).keys()];
    var stability = "";
    for (key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(activeNotes[key]);
        }
    }
    if (notes.length > 1)
    {
        var overtones = notes.map(note => partials.map(partial => note*partial));

        // intersection of sorted arrays, two pointers method using comparitor
        var intersection = function(equal, a, b) {
            var common = [];
            var i = 0;
            var j = 0;

            while (i < a.length && j < b.length)
            {
                if (equal(a[i],b[j])) {
                    common.push(a[i]);
                    i++;
                    j++;
                }
                else if (a[i] < b[j]) {
                    i++;
                }
                else {
                    j++;
                }
            }

            return common
        }

        // loose equality function for two frequencies within one cent
        var isEqual = function(a, b) {
            return parseInt(differenceInCents(a, b))===0;
        }

        // find all shared overtones
        var sharedHarmonics = overtones.reduce(intersection.bind(this, isEqual));
        stability = sharedHarmonics.map(freq => Tone.Frequency(freq).toNote()).toString();//sharedHarmonics.length;
    }
    document.getElementById("stability").innerHTML = stability;
}

function updateChordNames() {
    var notes = [];
    for (key in activeNotes) {
        if (activeNotes[key]) {
            notes.push(Tone.Frequency(key).toMidi());
        }
    }
    notes.sort();
    var bass = notes[0];
    // make mapping of midi notes to integer notation
    currentChord.midi = {};
    for (note in notes) {
        currentChord.midi[notes[note]] = toPitchClass(notes[note] - bass);
    }
    // reduce to integer notation, drop all notes to the same octave
    currentChord.integer = [...new Set(notes.map(note => currentChord.midi[note]))].sort((a, b) => a - b).join(",");
    var chordType = chordTypes[currentChord.integer];
    if (chordType) {
        // find out what note is the root using the midi mapping
        var rootInt = currentChord.integer.split(",")[chordType.root];
        var rootMidi = Object.keys(currentChord.midi).find(key => currentChord.midi[key]==rootInt);
        var root = midiToNotation(rootMidi);
        if (chordType.notation)
        {
            var bassMidi = Object.keys(currentChord.midi).find(key => currentChord.midi[key]==0);
            var bass = midiToNotation(bassMidi);
            var shortName = chordType.notation.replace("X", root).replace("Y", bass);
            document.getElementById("chordtype").innerHTML = shortName;
        }
        else
        {
            var fullName = root + " " + chordType.type; // old long notation for chord
            document.getElementById("chordtype").innerHTML = fullName;
        }
    }
    else {
        document.getElementById("chordtype").innerHTML = "";
    }
}

function updateChordTunings() {
    var ratios = document.getElementById("ratios").innerHTML;
    var chordTuning = chordTunings[reduceChord(ratios)];
    if (chordTuning) {
        document.getElementById("chordtuning").innerHTML = chordTuning;
    }
    else {
        document.getElementById("chordtuning").innerHTML = "";
    }
}