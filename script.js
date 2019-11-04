var audioCtx;
var oscillator;

function setup() {
    console.log("Setup audio context and oscillator...");
    audioCtx = new AudioContext();
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.connect(audioCtx.destination);
}

function start() {
    console.log("Starting oscillator...");
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillator.start();
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
    oscillator.frequency.setValueAtTime(x, audioCtx.currentTime);
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
    document.getElementById("freqSlider").onchange = (event) => {
        document.getElementById("freqTxt").value = event.target.value;
    }
    document.getElementById("setFreqBtn").onclick = () => {
        var frequency = document.getElementById("freqSlider").value;
        console.log("Setting frequency to " + frequency);
        setFrequency(frequency);
    }
}