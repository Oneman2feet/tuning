import { PitchDetector } from "pitchy";
import Pitch from "./pitch";
import { colorFromCents } from "./utility";

function updatePitch(keyboard, analyserNode, detector, input, sampleRate) {
    // Sung pitch from microphone
    analyserNode.getFloatTimeDomainData(input);
    const [frequency, clarity] = detector.findPitch(input, sampleRate);
    var pitch = new Pitch(undefined, frequency);

    // Followed pitch from keyboard
    var followedPitch = document.getElementById("followedPitch");
    var followed = keyboard.getFollowedPitch();
    if (followed) {
        followedPitch.textContent = followed.toString();
    }
    else {
        followedPitch.textContent = "";
    }

    // Visualize tuning
    var sungPitch = document.getElementById("sungPitch");
    if (followed) {
        var octaveFixedPitch = new Pitch(followed.midiNoteNumber, frequency);
        octaveFixedPitch.resetOctave();
        var cents = Pitch.differenceInCents(octaveFixedPitch, followed);
        if (clarity > 0.85 && Math.abs(cents) < 100) {
            sungPitch.textContent = Pitch.differenceInCentsPrint(octaveFixedPitch, followed);
            sungPitch.style.color = colorFromCents(cents);
        }
        else {
            sungPitch.textContent = "";
        }
    }
    else {
        sungPitch.textContent = "";
    }

    /*
    if (followed && clarity > 0.85) {
        var octaveFixedPitch = new Pitch(followed.midiNoteNumber, frequency);
        octaveFixedPitch.resetOctave();
        console.log(Pitch.differenceInCents(octaveFixedPitch, followed));
        sungPitch.textContent = pitch.getNoteName() + " " + Pitch.differenceInCentsPrint(pitch, followed);
        sungPitch.style.color = colorFromCents(Pitch.differenceInCents(pitch, followed));
    }
    else {
        sungPitch.textContent = "";
    }
    */

    // update loop
    window.setTimeout(() => updatePitch(keyboard, analyserNode, detector, input, sampleRate), 100);
}

export default function setupTuner(keyboard) {
    // For cross-browser compatibility.
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyserNode);
        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);
        updatePitch(keyboard, analyserNode, detector, input, audioContext.sampleRate);
    });
}