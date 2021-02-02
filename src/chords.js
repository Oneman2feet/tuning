export const chordTypes = {

    "0": { "root": 0, "type": "Unison", "notation": "X P1", "tuning": "1"},

// ------------- INTERVALS ------------------------

    "0,1": { "root": 0, "type": "Minor Second", "notation": "X m2", "tuning": "15:16"},
    "0,2": { "root": 0, "type": "Major Second", "notation": "X M2", "tuning": "8:9"}, // greater tone
    "0,3": { "root": 0, "type": "Minor Third", "notation": "X m3", "tuning": "5:6"}, // just is 5:6, septimal is 6:7
    "0,4": { "root": 0, "type": "Major Third", "notation": "X M3", "tuning": "4:5"},
    "0,5": { "root": 0, "type": "Perfect Fourth", "notation": "X P4", "tuning": "3:4"},
    "0,6": { "root": 0, "type": "Tritone", "notation": "X A4"},
    "0,7": { "root": 0, "type": "Perfect Fifth", "notation": "X P5", "tuning": "2:3"},
    "0,8": { "root": 0, "type": "Minor Sixth", "notation": "X m6", "tuning": "5:8"},
    "0,9": { "root": 0, "type": "Major Sixth", "notation": "X M6", "tuning": "3:5"},
    "0,10": { "root": 0, "type": "Minor Seventh", "notation": "X m7"},
    "0,11": { "root": 0, "type": "Major Seventh", "notation": "X M7", "tuning": "8:15"},
    //"0,12": { "root": 0, "type": "Octave"},
    //"0,13": { "root": 0, "type": "Minor Ninth"},
    //"0,14": { "root": 0, "type": "Major Ninth"},

// ------------- TRIADS ---------------------------

    "0,4,7": { "root": 0, "type": "Major", "notation": "X", "tuning": "4:5:6"},
    "0,3,8": { "root": 2, "type": "Major (first inversion)", "notation": "X/Y", "tuning": "5:6:8"},
    "0,5,9": { "root": 1, "type": "Major (second inversion)", "notation": "X/Y", "tuning": "6:8:10"},
    "0,3,7": { "root": 0, "type": "Minor", "notation": "Xm", "tuning": "10:12:15"}, // just minor triad
    "0,4,9": { "root": 2, "type": "Minor (first inversion)", "notation": "Xm/Y"},
    "0,5,8": { "root": 1, "type": "Minor (second inversion)", "notation": "Xm/Y"},
    "0,3,6": { "root": 0, "type": "Diminished", "notation": "X<sup>\u006f</sup>", "tuning": "5:6:7"}, // also "25:30:36"
    "0,3,9": { "root": 2, "type": "Diminished (first inversion)", "notation": "X<sup>\u006f</sup>/Y"},
    "0,6,9": { "root": 1, "type": "Diminished (second inversion)", "notation": "X<sup>\u006f</sup>/Y"},
    "0,4,8": { "root": 0, "type": "Augmented", "notation": "X+", "tuning": "8:10:13"}, // perfect augmented
    "0,4,10": { "root": 0, "type": "Dominant Seventh (fifth omitted)", "tuning": "4:5:7"},

// -------------- TETRADS -------------------------

    "0,4,7,10": { "root": 0, "type": "Dominant Seventh", "notation": "X7", "tuning": "4:5:6:7"},
    "0,3,6,8": { "root": 3, "type": "Dominant Seventh (first inversion)", "notation": "X7/Y", "tuning": "5:6:7:8"},
    "0,3,5,9": { "root": 2, "type": "Dominant Seventh (second inversion)", "notation": "X7/Y", "tuning": "6:7:8:10"},
    "0,2,6,9": { "root": 1, "type": "Dominant Seventh (third inversion)", "notation": "X7/Y", "tuning": "7:8:10:12"},
    "0,3,7,10": { "root": 0, "type": "Minor Seventh", "notation": "Xm7", "tuning": "10:12:15:18"}, // note there is also septimal tuning
    "0,4,7,9": { "root": 0, "type": "Major Sixth", "notation": "XM6", "tuning": "12:15:18:20"},
    "0,3,5,8": { "root": 3, "type": "Major Sixth (first inversion)", "notation": "XM6/Y"},
    "0,2,5,9": { "root": 2, "type": "Major Sixth (second inversion)", "notation": "XM6/Y"},
    "0,3,6,10": { "root": 0, "type": "Half-diminished Seventh", "notation":"X<sup>\u00f8</sup>", "tuning": "5:6:7:9"},
    "0,3,7,9": { "root": 3, "type": "Half-diminished Seventh (first inversion)", "notation":"X<sup>\u00f8</sup>/Y", "tuning": "6:7:9:10"},
    "0,4,6,9": { "root": 2, "type": "Half-diminished Seventh (second inversion)", "notation":"X<sup>\u00f8</sup>/Y"},
    "0,2,5,8": { "root": 1, "type": "Half-diminished Seventh (third inversion)", "notation":"X<sup>\u00f8</sup>/Y"},
    "0,4,7,11": { "root": 0, "type": "Major Seventh", "notation": "XM7", "tuning": "8:10:12:15"},
    "0,3,7,8": { "root": 0, "type": "Minor Sixth", "notation": "Xm6", "tuning": "10:12:15:16"},
    "0,4,5,9": { "root": 3, "type": "Minor Sixth (first inversion)", "notation": "Xm6/Y", "tuning": "12:15:16:20"},
    "0,1,5,8": { "root": 2, "type": "Minor Sixth (second inversion)", "notation": "Xm6/Y", "tuning": "15:16:20:24"},
    "0,3,6,9": { "root": 0, "type": "Diminished Seventh", "notation": "X<sup>\u006f</sup>7"},
    "0,3,7,11": { "root": 0, "type": "Minor-Major Seventh", "notation": "Xm+7"},
    "0,4,8,9": { "root": 3, "type": "Minor-Major Seventh (first inversion)", "notation": "Xm+7/Y"},
    "0,4,5,8": { "root": 2, "type": "Minor-Major Seventh (second inversion)", "notation": "Xm+7/Y"},
    "0,1,4,8": { "root": 1, "type": "Minor-Major Seventh (third inversion)", "notation": "Xm+7/Y"},
    "0,4,8,10": { "root": 0, "type": "Augmented-Minor Seventh", "notation": "X+7"},
    "0,4,6,8": { "root": 3, "type": "Augmented-Minor Seventh (first inversion)", "notation": "X+7/Y"},
    "0,2,4,8": { "root": 2, "type": "Augmented-Minor Seventh (second inversion)", "notation": "X+7/Y"},
    "0,2,6,10": { "root": 1, "type": "Augmented-Minor Seventh (third inversion)", "notation": "X+7/Y"},
    "0,4,8,11": { "root": 0, "type": "Augmented-Major Seventh", "notation": "X+M7"},
    "0,4,7,8": { "root": 3, "type": "Augmented-Major Seventh (first inversion)", "notation": "X+M7/Y"},
    "0,3,4,8": { "root": 2, "type": "Augmented-Major Seventh (second inversion)", "notation": "X+M7/Y"},
    "0,1,5,9": { "root": 1, "type": "Augmented-Major Seventh (third inversion)", "notation": "X+M7/Y"},
    "0,4,6,10": { "root": 0, "type": "Major-Minor Seventh (fifth lowered)", "notation": "X7b5"},
    "0,2,4,10": { "root": 0, "type": "Dominant Ninth (fifth omitted)", "notation": "X9", "tuning": "8:9:10:14"}
};


export const chordTunings = {

// --------------- INTERVALS ----------------------

    "1": "Perfect Octave",
    "1/3": "Perfect Fifth / Fourth",
    "3/5": "Just Minor Third / Major Sixth",
    "1/5": "Just Major Third / Minor Sixth",
    "5/7": "Harmonic Tritone",
    "3/7": "Septimal Minor Third / Major Sixth",
    "1/7": "Harmonic Minor Seventh / Supermajor Second",
    "5/9": "Just Minor Seventh / Lesser Tone",
    "1/9": "Greater Tone / Pythagorean Minor Seventh",
    "7/9": "Greater Major Third",
    "5/11": "Lesser Undecimal Neutral Second (11th-related)",
    "9/11": "Neutral Third",
    "1/13": "Minor Sixth (13th-related)",
    "7/15": "Septimal Minor Second",
    "1/15": "Just Minor Second / Major Seventh",

// ----------------- TRIADS -----------------------

    "1/3/5":"Just Major",
    "1/5/7": "Dominant Seventh",
    "3/5/7": "Perfect Diminished",
    "3/7/9": "Dominant Ninth",
    "1/5/13": "Perfect Augmented",
    "3/5/15": "Just Minor",
    "6/15/19": "Greater Augmented",
    "1/5/25": "Just Augmented",
    "1/3/19": "19-Limit Minor",
    "9/15/25": "Just Diminished",
    "1/5/27": "Supertonic Minor",
    "1/27/45": "45-Limit Diminished",
    "1/27/81": "Pythagorean Minor",

// ---------------- TETRADS --------------------------

    "1/3/5/7": "Dominant Seventh",
    "3/5/7/9": "Half-diminished Seventh",
    "1/5/7/9": "Dominant Ninth",
    "1/3/5/9": "Just Major Added Ninth",
    "1/3/5/15": "Just Major Seventh",
    "3/5/9/15": "Just Minor Seventh",
    "3/7/9/21": "Septimal Minor Seventh",
    "9/15/25/45": "45-Limit Half-diminished Seventh",
    "3/5/15/75": "Minor-major Seventh",
    "5/9/25/125": "Augmented Dominant Seventh",
    "27/45/75/125": "Diminished Seventh"

};

// divides a number by two as many times as possible
function removeOctave(number) {
    var num = parseInt(number);
    while (num % 2 == 0) {
        num /= 2;
    }
    return num;
};

// lower all notes to their lowest possible octave in the harmonic series
export function reduceChord(chord) {
    // lower notes and sort
    var ratios = chord.split("/").map(removeOctave).sort((a, b) => a - b);
    // remove duplicates
    var ratios = [...new Set(ratios)];
    // return result
    return ratios.join("/");
}