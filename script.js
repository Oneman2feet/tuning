window.onload = function() {
    document.getElementById("startBtn").onclick = () => {
        console.log("Starting...");
        const audioCtx = new AudioContext();

        // create Oscillator node
        var oscillator = audioCtx.createOscillator();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
        oscillator.connect(audioCtx.destination);
        oscillator.start();
    }
}