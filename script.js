let audioCtx;
let gainNode;
let oscillators = [];

function setup() {
    console.log("Setup audio context and oscillator...");
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    createOsc();
}

function createOsc() {
    console.log("Creating a new oscillator...");
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    oscillators.push(oscillator);
    gainNode.gain.value = 1 / oscillators.length;
    console.log("There are " + oscillators.length + " oscillators and a total gain of " + gainNode.gain.value);
}

function start() {
    console.log("Starting oscillator...");
    oscillators[0].frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillators[0].start();
}

function togglePlayback(button) {
    if (audioCtx.state === 'running') {
        console.log("Suspending playback...");
        audioCtx.suspend().then(() => {
            button.textContent = 'Resume';
        });
    } else if (audioCtx.state === 'suspended') {
        console.log("Resuming playback...");
        audioCtx.resume().then(() => {
            button.textContent = 'Pause';
        });  
    }
}

function setFrequency(x) {
    oscillators[0].frequency.setValueAtTime(x, audioCtx.currentTime);
}

// fundamental is the frequency in hertz
// harmonic is an int for which value in the harmonic series to play
function harmonicFrequency(fundamental, harmonic) {
    if (typeof(harmonic) === 'number' && Number.isInteger(harmonic) && harmonic > 0)
        return fundamental * harmonic;
    else
        console.log("Trouble calculating harmonic " + harmonic);
        return undefined;
}

window.onload = function() {
    document.getElementById("setupBtn").onclick = () => {
        setup();
    }
    document.getElementById("startBtn").onclick = () => {
        start();
    }
    document.getElementById("pauseBtn").onclick = (event) => {
        togglePlayback(event.target);
    }
    [...document.getElementsByClassName("freqSlider")].forEach((elem) => {
        elem.onchange = (event) => {
            elem.parentElement.querySelector(".freqTxt").value = event.target.value;
        };
    });
    [...document.getElementsByClassName("setFreqBtn")].forEach((elem) => {
        elem.onclick = () => {
            var fundamental = elem.parentElement.querySelector(".freqSlider").value;

            var harmonic = 1;
            var harmonicNum = elem.parentElement.querySelector(".harmonicNum");
            if (harmonicNum != null) {
                harmonic = parseInt(harmonicNum.value);
                console.log("Using fundamental of " + fundamental + " and harmonic of " + harmonic);
            }
            var frequency = harmonicFrequency(fundamental, harmonic);
            console.log("Setting frequency to " + frequency);
            setFrequency(frequency);
        }
    });
}