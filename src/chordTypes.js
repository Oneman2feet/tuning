export const chordTypes = {

    "0": { "root": 0, "name": "Unison", "notation": "X P1", "tuning": "1"},

// ------------- INTERVALS ------------------------

    "0,1": { "root": 0, "name": "Minor Second", "notation": "X m2", "tuning": "15:16"},
    "0,2": { "root": 0, "name": "Major Second", "notation": "X M2", "tuning": "8:9"}, // greater tone
    "0,3": { "root": 0, "name": "Minor Third", "notation": "X m3", "tuning": "5:6"}, // just is 5:6, septimal is 6:7
    "0,4": { "root": 0, "name": "Major Third", "notation": "X M3", "tuning": "4:5"},
    "0,5": { "root": 0, "name": "Perfect Fourth", "notation": "X P4", "tuning": "3:4"},
    "0,6": { "root": 0, "name": "Tritone", "notation": "X A4", "tuning": "5:7"},
    "0,7": { "root": 0, "name": "Perfect Fifth", "notation": "X P5", "tuning": "2:3"},
    "0,8": { "root": 0, "name": "Minor Sixth", "notation": "X m6", "tuning": "5:8"},
    "0,9": { "root": 0, "name": "Major Sixth", "notation": "X M6", "tuning": "3:5"},
    "0,10": { "root": 0, "name": "Minor Seventh", "notation": "X m7", "tuning": "4:7"},
    "0,11": { "root": 0, "name": "Major Seventh", "notation": "X M7", "tuning": "8:15"},

// ------------- TRIADS ---------------------------

    "0,4,7": { "root": 0, "name": "Major", "notation": "X", "tuning": "4:5:6"},
    "0,3,8": { "root": 2, "name": "Major (first inversion)", "notation": "X/Y", "tuning": "5:6:8"},
    "0,5,9": { "root": 1, "name": "Major (second inversion)", "notation": "X/Y", "tuning": "6:8:10"},
    "0,3,7": { "root": 0, "name": "Minor", "notation": "Xm", "tuning": "10:12:15"}, // just minor triad
    "0,4,9": { "root": 2, "name": "Minor (first inversion)", "notation": "Xm/Y", "tuning": "12:15:20"},
    "0,5,8": { "root": 1, "name": "Minor (second inversion)", "notation": "Xm/Y", "tuning": "15:20:24"},
    "0,3,6": { "root": 0, "name": "Diminished", "notation": "x<sup>\u006f</sup>", "tuning": "5:6:7"}, // also "25:30:36"
    "0,3,9": { "root": 2, "name": "Diminished (first inversion)", "notation": "x<sup>\u006f</sup>/Y", "tuning": "6:7:10"},
    "0,6,9": { "root": 1, "name": "Diminished (second inversion)", "notation": "x<sup>\u006f</sup>/Y", "tuning": "7:10:12"},
    "0,4,8": { "root": 0, "name": "Augmented", "notation": "X+", "tuning": "8:10:13"}, // perfect augmented
    "0,4,10": { "root": 0, "name": "Dominant Seventh (fifth omitted)", "tuning": "4:5:7"},

    "0,2,5": { "root": 1, "name": "Minor Seventh (fifth omitted, second inversion)", "tuning": "9:10:12"},
    "0,3,5": { "root": 2, "name": "Dominant Seventh (third omitted, first inversion)", "tuning": "6:7:8"},
    "0,4,6": { "root": 2, "name": "Half-diminished Seventh (third omitted, first inversion)", "tuning": "7:9:10"},
    "0,5,7": { "root": 0, "name": "Sus4", "tuning": "6:8:9"},
    "0,7,10": { "root": 0, "name": "Dominant Seventh (third omitted)", "tuning": "4:6:7"},
    "0,7,11": {"root": 0, "name": "Major Seventh (third omitted)", "tuning": "8:12:15"},

// -------------- TETRADS -------------------------

    "0,4,7,10": { "root": 0, "name": "Dominant Seventh", "notation": "X7", "tuning": "4:5:6:7"},
    "0,3,6,8": { "root": 3, "name": "Dominant Seventh (first inversion)", "notation": "X7/Y", "tuning": "5:6:7:8"},
    "0,3,5,9": { "root": 2, "name": "Dominant Seventh (second inversion)", "notation": "X7/Y", "tuning": "6:7:8:10"},
    "0,2,6,9": { "root": 1, "name": "Dominant Seventh (third inversion)", "notation": "X7/Y", "tuning": "7:8:10:12"},
    "0,3,7,10": { "root": 0, "name": "Minor Seventh", "notation": "Xm7", "tuning": "10:12:15:18"}, // note there is also septimal tuning
    "0,4,7,9": { "root": 0, "name": "Major Sixth", "notation": "XM6", "tuning": "12:15:18:20"},
    "0,3,5,8": { "root": 3, "name": "Major Sixth (first inversion)", "notation": "XM6/Y", "tuning": "15:18:20:24"},
    "0,2,5,9": { "root": 2, "name": "Major Sixth (second inversion)", "notation": "XM6/Y", "tuning": "9:10:12:15"},
    "0,3,6,10": { "root": 0, "name": "Half-diminished Seventh", "notation":"x<sup>\u00f8</sup>", "tuning": "5:6:7:9"},
    "0,3,7,9": { "root": 3, "name": "Half-diminished Seventh (first inversion)", "notation":"x<sup>\u00f8</sup>/Y", "tuning": "6:7:9:10"},
    "0,4,6,9": { "root": 2, "name": "Half-diminished Seventh (second inversion)", "notation":"x<sup>\u00f8</sup>/Y", "tuning": "7:9:10:12"},
    "0,2,5,8": { "root": 1, "name": "Half-diminished Seventh (third inversion)", "notation":"x<sup>\u00f8</sup>/Y", "tuning": "9:10:12:14"},
    "0,4,7,11": { "root": 0, "name": "Major Seventh", "notation": "XM7", "tuning": "8:10:12:15"},
    "0,3,7,8": { "root": 0, "name": "Minor Sixth", "notation": "Xm6", "tuning": "10:12:15:16"},
    "0,4,5,9": { "root": 3, "name": "Minor Sixth (first inversion)", "notation": "Xm6/Y", "tuning": "12:15:16:20"},
    "0,1,5,8": { "root": 2, "name": "Minor Sixth (second inversion)", "notation": "Xm6/Y", "tuning": "15:16:20:24"},
    "0,3,6,9": { "root": 0, "name": "Diminished Seventh", "notation": "x<sup>\u006f</sup>7", "tuning": "15:18:21:25"},
    "0,3,7,11": { "root": 0, "name": "Minor-Major Seventh", "notation": "Xm+7"},
    "0,4,8,9": { "root": 3, "name": "Minor-Major Seventh (first inversion)", "notation": "Xm+7/Y"},
    "0,4,5,8": { "root": 2, "name": "Minor-Major Seventh (second inversion)", "notation": "Xm+7/Y"},
    "0,1,4,8": { "root": 1, "name": "Minor-Major Seventh (third inversion)", "notation": "Xm+7/Y"},
    "0,4,8,10": { "root": 0, "name": "Augmented-Minor Seventh", "notation": "X+7"},
    "0,4,6,8": { "root": 3, "name": "Augmented-Minor Seventh (first inversion)", "notation": "X+7/Y"},
    "0,2,4,8": { "root": 2, "name": "Augmented-Minor Seventh (second inversion)", "notation": "X+7/Y"},
    "0,2,6,10": { "root": 1, "name": "Augmented-Minor Seventh (third inversion)", "notation": "X+7/Y"},
    "0,4,8,11": { "root": 0, "name": "Augmented-Major Seventh", "notation": "X+M7"},
    "0,4,7,8": { "root": 3, "name": "Augmented-Major Seventh (first inversion)", "notation": "X+M7/Y"},
    "0,3,4,8": { "root": 2, "name": "Augmented-Major Seventh (second inversion)", "notation": "X+M7/Y"},
    "0,1,5,9": { "root": 1, "name": "Augmented-Major Seventh (third inversion)", "notation": "X+M7/Y"},
    "0,4,6,10": { "root": 0, "name": "Major-Minor Seventh (fifth lowered)", "notation": "X7\u266d5", "tuning": "12:15:17:21"}, // 20:25:28:35 or 8:10:11:14 or 12:15:17:21
    "0,2,4,10": { "root": 0, "name": "Dominant Ninth (fifth omitted)", "notation": "X9", "tuning": "8:9:10:14"}

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
    "1/5/7/11": "11-Limit Dominant Seventh Flat Five",
    "1/3/5/15": "Just Major Seventh",
    "3/5/9/15": "Just Minor Seventh",
    "3/7/9/21": "Septimal Minor Seventh",
    "3/15/17/21": "21-Limit Dominant Seventh Flat Five",
    "9/15/21/25": "Diminished Seventh",
    "5/7/25/35": "35-Limit Dominant Seventh Flat Five",
    "9/15/25/45": "45-Limit Half-diminished Seventh",
    "3/5/15/75": "Minor-major Seventh",
    "5/9/25/125": "Augmented Dominant Seventh",
    "27/45/75/125": "Diminished Seventh"

};