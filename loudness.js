const biquadFilter = audioCtx.createBiquadFilter();

biquadFilter.type = "peaking";
biquadFilter.frequency.value = 1000;
biquadFilter.gain.value = 10;
biquadFilter.Q.value = 1;

const freqs = [
    20,
    25,
    31,
    40,
    50,
    63,
    80,
    100,
    125,
    160,
    200,
    250,
    315,
    400,
    500,
    630,
    800,
    1000,
    1250,
    1600,
    2000,
    2500,
    3150,
    4000,
    5000,
    6300,
    8000,
    10000,
    12500,
    16000,
    20000,
];

const myFrequencyArray = new Float32Array(freqs);

const magResponseOutput = new Float32Array(myFrequencyArray.length);
const phaseResponseOutput = new Float32Array(myFrequencyArray.length);

biquadFilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput);

const dbResponse = (res) => 20.0 * Math.log(res) / Math.LN10;

//console.log(magResponseOutput.map(dbResponse));
//console.log(phaseResponseOutput);