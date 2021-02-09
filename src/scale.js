import Pitch from './pitch.js';

// TODO represent different scales that can be played, etc.
// Different modes like dorian, lidian
// Scales with more/less notes

// For now we use this to compute roman numeral and scale degree

const romanNumeral = ["I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"];
const circleOfFifths = ["I", "IV/IV/IV/IV/IV", "V/V", "IV/IV/IV", "V/V/V/V", "IV", "x", "V", "IV/IV/IV/IV", "V/V/V", "IV/IV", "V/V/V/V/V"];
const ratios = [1, 256/243, 9/8, 32/27, 81/64, 4/3, undefined, 3/2, 128/81, 27/16, 16/9, 243/128];

export default class Scale {
    constructor(tonic) {
        this.tonic = tonic;
    }

    toInteger(pitch) {
        return ((Pitch.differenceInSemitones(pitch, this.tonic) % 12) + 12) % 12;
    }

    toRoman(pitch) {
        var integer = this.toInteger(pitch);
        var roman = romanNumeral[integer];
        return roman;
    }

    toCircleOfFifthsRatio(pitch) {
        var integer = this.toInteger(pitch);
        var ratio = ratios[integer];
        return ratio;
    }

    /*
    static toCircleOfFifths(pitch, fundamental) {
        var integer = Scale.toInteger(pitch, fundamental);
        return circleOfFifths[integer];
    }

    static toCircleOfFifthsRatio(pitch, fundamental) {
        var integer = Scale.toInteger(pitch, fundamental);
        var ratio = ratios[integer];
        return ratio;
    }

    static toRoman(chord, fundamental) {
        var integer = Scale.toInteger(chord.root, fundamental);
        var roman = romanNumeral[integer];
        return chord.toRoman(roman);
    }
    */
}