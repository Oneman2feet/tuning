var blackKeys = [1,3,6,8,10];

function generateKeyboard() {
    var container = document.getElementById("keyboard");
    var midiStart = 48;
    var numKeys = 24;
    for (var i=0; i<numKeys; i++)
    {
        var midiVal = midiStart + i;
        var blackKey = blackKeys.includes(midiVal % 12);
        var key = document.createElement("div");
        key.classList = "key";
        if (blackKey) {
            key.classList.add("blackKey");
        }
        key.dataset.midiValue = midiVal;
        container.appendChild(key);
    }
}

function activateKey(midiVal) {
    [...document.querySelectorAll('#keyboard .key[data-midi-value="' + midiVal + '"]')].forEach((key) => {
        key.classList.add("active");
    });
}

function deactivateKey(midiVal) {
    [...document.querySelectorAll('#keyboard .key[data-midi-value="' + midiVal + '"]')].forEach((key) => {
        key.classList.remove("active");
    });
}

function deactivateAllKeys() {
    [...document.querySelectorAll('#keyboard .key')].forEach((key) => {
        key.classList.remove("active");
    });
}