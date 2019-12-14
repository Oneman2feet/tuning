let audioCtx = new AudioContext(); // the audio context

var osc = audioCtx.createOscillator();

var numCoeffs = 64; // The more coefficients you use, the better the approximation
var real = new Float32Array(numCoeffs);
var imag = new Float32Array(numCoeffs);

//real[0] = 0.5;
//for (var i = 1; i < numCoeffs; i++) { // note i starts at 1
//    imag[i] = 1 / (i * Math.PI);
//}

imag[1] = 1/Math.PI;
//imag[2] = 1/Math.PI * 1/2;
imag[3] = 1/Math.PI * 1/3;
//imag[4] = 1/Math.PI * 1/4;
imag[5] = 1/Math.PI * 1/5;
//imag[6] = 1/Math.PI * 1/6;
imag[7] = 1/Math.PI * 1/7;
//imag[8] = 1/Math.PI * 1/8;
imag[9] = 1/Math.PI * 1/9;

var wave = audioCtx.createPeriodicWave(real, imag, {disableNormalization: true});

osc.setPeriodicWave(wave);

osc.connect(audioCtx.destination);

//osc.start();
//osc.stop(2);