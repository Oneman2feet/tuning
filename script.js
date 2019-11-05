let audioCtx;
let gainNode;
let oscillators = [];

function setup() {
    console.log("Setup audio context and oscillator...");
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    createOsc(440);
    audioCtx.suspend();
}

// todo, make a separate class to handle playing a chord of frequencies (like an arraylist)
function createOsc(frequency) {
    console.log("Creating a new oscillator with frequency " + frequency);
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    oscillators.push(oscillator);
    gainNode.gain.value = 1 / oscillators.length;
    console.log("There are " + oscillators.length + " oscillators and a total gain of " + gainNode.gain.value);
    oscillator.start();
}

// stops and removes all oscillators in the list after the first n
function cullOscs(n) {
    var oscillator;
    while (oscillators.length > n) {
        oscillator = oscillators.pop();
        oscillator.stop();
        oscillator.disconnect(gainNode);
        gainNode.gain.value = 1 / oscillators.length;
    }
}

function togglePlayback(button) {
    if (audioCtx.state === 'running') {
        console.log("Suspending playback...");
        audioCtx.suspend().then(() => {
            button.textContent = 'Play';
        });
    } else if (audioCtx.state === 'suspended') {
        console.log("Resuming playback...");
        audioCtx.resume().then(() => {
            button.textContent = 'Pause';
        });  
    }
}

function setFrequency(oscillator, frequency) {
    console.log("Setting frequency of oscillator " + oscillator + " to " + frequency);
    oscillators[oscillator].frequency.setValueAtTime(frequency, audioCtx.currentTime);
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
    document.getElementById("playPauseBtn").onclick = (event) => {
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
            var harmonic;
            var frequency;
            var harmonicNum = elem.parentElement.querySelector(".harmonicNum");
            var harmonicSelect = elem.parentElement.querySelectorAll(".harmonicSelect");
            if (harmonicNum != null) {
                harmonic = parseInt(harmonicNum.value);
                console.log("Using fundamental of " + fundamental + " and harmonic of " + harmonic);
                frequency = harmonicFrequency(fundamental, harmonic);
                setFrequency(0, frequency);
                cullOscs(1);
            } else if (harmonicSelect.length > 0) {
                var notes = [...harmonicSelect].filter((elem) => {
                    return elem.checked;
                });
                notes.forEach((elem, index) => {
                    harmonic = parseInt(elem.value);
                    frequency = harmonicFrequency(fundamental, harmonic);
                    if (oscillators.length <= index) {
                        createOsc(frequency);
                    } else {
                        setFrequency(index, frequency);
                    }
                });
                cullOscs(notes.length);
            } else {
                frequency = harmonicFrequency(fundamental, 1);
                setFrequency(0, frequency);
                cullOscs(1);
            }
        }
    });
}