let audioCtx; // the audio context
let gainNode; // the main gain node
let oscillators = []; // to keep track of all active oscillators

// initialize the audio context and gain node
function setup(button) {
    console.log("Setup audio context and oscillator...");
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    createPlayPause(button.parentNode);
    button.parentNode.removeChild(button);
}

// play or pause audio system
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

function createPlayPause(parent) {
    var button = document.createElement("button");
    button.id = "playPauseBtn";
    button.innerHTML = "Pause";
    parent.appendChild(button);

    button.onclick = () => {
        togglePlayback(button);
    }
}

// balances the gain of the oscillator list
function calcGain() {
    if (oscillators.length > 0) {
        gainNode.gain.value = 1 / oscillators.length;
    } else {
        gainNode.gain.value = 1;
    }
}

// adds a new oscillator to the oscillator list
function addOscillator(frequency) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    oscillators.push(oscillator);
    calcGain();
    oscillator.start();
}

// stops and removes all oscillators in the list after the first n
function cullOscillators(n) {
    var oscillator;
    while (oscillators.length > n) {
        oscillator = oscillators.pop();
        oscillator.stop();
        oscillator.disconnect(gainNode);
        calcGain();
    }
}

// remove all oscillators
function clearOscillators() {
    for (oscillator in oscillators) {
        oscillators[oscillator].stop();
    }
    oscillators.length = 0; // clear the array
    calcGain();
}

// change the frequency of an oscillator
function setFrequency(oscillator, frequency) {
    oscillators[oscillator].frequency.setValueAtTime(frequency, audioCtx.currentTime);
}

// given a list of frequencies, play them
function playChord(frequencyList) {
    clearOscillators();
    if (frequencyList && frequencyList.length > 0) {
        if (frequencyList.length == 1) {
            console.log("Playing frequency " + frequencyList);
        } else if (frequencyList.length == 2) {
            console.log("Playing interval of " + frequencyList)
        } else {
            console.log("Playing chord of " + frequencyList);
        } 
        for (frequencyIndex in frequencyList) {
            addOscillator(frequencyList[frequencyIndex]);
        }
    } else {
        console.log("Ending all oscillators...");
    }
}