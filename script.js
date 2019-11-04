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
        audioCtx.suspend().then(() => {
            button.textContent = 'Resume';
        });
        } else if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            button.textContent = 'Pause';
        });  
    }
}

window.onload = function() {
    document.getElementById("setupBtn").onclick = () => {
        setup();
    }
    document.getElementById("startBtn").onclick = () => {
        start();
    }
    var pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.onclick = () => {
        togglePlayback(pauseBtn);
    }
}