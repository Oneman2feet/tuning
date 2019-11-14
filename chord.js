let audioCtx; // the audio context
let gainNode; // the main gain node
let oscillators = []; // to keep track of all active oscillators

// initialize the audio context and gain node
function setup(button) {
    console.log("Setup audio context and gain node...");
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
// schedules it to play after a certain amount of time, for a certain duration
function addOscillatorTime(frequency, time, duration) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(gainNode);
    oscillators.push(oscillator);
    calcGain();
    oscillator.start(audioCtx.currentTime + time);
    if (duration != undefined) {
        oscillator.stop(audioCtx.currentTime + time + duration);
    }
}

// adds a new oscillator to the oscillator list
function addOscillator(frequency) {
    addOscillatorTime(frequency, 0);
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
// start playing after a certain amount of time, with a certain duration
function playChordTime(frequencyList, time, duration) {
    if (frequencyList && frequencyList.length > 0) {
        if (frequencyList.length == 1) {
            console.log("Playing frequency " + frequencyList);
        } else if (frequencyList.length == 2) {
            console.log("Playing interval of " + frequencyList)
        } else {
            console.log("Playing chord of " + frequencyList);
        } 
        for (frequencyIndex in frequencyList) {
            addOscillatorTime(frequencyList[frequencyIndex], time, duration);
        }
    } else {
        console.log("Ending all oscillators...");
    }
}

// given a list of frequencies, play them
function playChord(frequencyList) {
    clearOscillators();
    playChordTime(frequencyList, 0);
}

// given a list of chords, play them in succession
function playChords(chordList) {
    addOscillatorTime(440, 0, 2);
    //var speed = 2; // each chord is this many seconds long
    //for (chordIndex in chordList) {
    //    playChordTime(chordList[chordIndex], chordIndex * speed, speed);
    //}
}

function stopChords() {
    clearOscillators();
}