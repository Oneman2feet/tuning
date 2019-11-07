// fundamental is the frequency in hertz
// harmonic is an int for which value in the harmonic series to play
function harmonicFrequency(fundamental, harmonic) {
    if (typeof(harmonic) === 'number' && Number.isInteger(harmonic) && harmonic > 0)
        return fundamental * harmonic;
    else
        console.log("Trouble calculating harmonic " + harmonic);
        return undefined;
}

// fundamental is the frequency in hertz
// ratio is a positive float for which interval above to play
function intervalFrequency(fundamental, ratio) {
    if (typeof(ratio) === 'number' && Number.isFinite(ratio) && ratio > 0)
        return fundamental * ratio;
    else
        console.log("Trouble calculating interval with ratio " + ratio);
        return undefined;
}

window.onload = function() {
    document.getElementById("setupBtn").onclick = (event) => {
        setup(event.target);
    }
    [...document.getElementsByClassName("freqSlider")].forEach((elem) => {
        elem.onchange = (event) => {
            elem.parentElement.querySelector(".freqTxt").value = event.target.value;
        };
    });
    [...document.getElementsByClassName("clearFreqBtn")].forEach((elem) => {
        elem.onclick = () => {
            playChord([]);
        };
    });
    [...document.getElementsByClassName("setFreqBtn")].forEach((elem) => {
        elem.onclick = () => {
            var fundamental = elem.parentElement.querySelector(".freqSlider").value;
            var harmonic;
            var frequency;
            var harmonicNum = elem.parentElement.querySelector(".harmonicNum");
            var harmonicSelect = elem.parentElement.querySelectorAll(".harmonicSelect");
            var intervalSelect = elem.parentElement.querySelector(".intervalSelect");
            var chordSelect = elem.parentElement.querySelector(".chordSelect");
            if (harmonicNum != null) {
                harmonic = parseInt(harmonicNum.value);
                frequency = harmonicFrequency(fundamental, harmonic);
                playChord([frequency]);
            } else if (harmonicSelect.length > 0) {
                var notes = [...harmonicSelect].filter((elem) => {
                    return elem.checked;
                });
                notes = notes.map((elem) => {
                    harmonic = parseInt(elem.value);
                    frequency = harmonicFrequency(fundamental, harmonic);
                    return frequency;
                });
                playChord(notes);
            } else if (intervalSelect != null) {
                var selected = intervalSelect[intervalSelect.selectedIndex].value;
                var ratio = parseFloat(eval(selected));
                frequency = intervalFrequency(fundamental, ratio);
                playChord([fundamental, frequency]);
            } else if (chordSelect != null) {
                var selected = chordSelect[chordSelect.selectedIndex].value;
                var partialList = selected.split(":");
                var firstPartial = partialList[0];
                notes = partialList.map((elem) => {
                    return parseInt(elem) / firstPartial * fundamental;
                });
                playChord(notes);
            } else {
                frequency = harmonicFrequency(fundamental, 1);
                playChord([frequency]);
            }
        }
    });
}