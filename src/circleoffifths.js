import "./circle.css";

import Pitch from "./pitch";

export default class CircleOfFifths {
    static draw() {
        var container = document.getElementById("circleOfFifths");
        for (var i=0; i<12; i++) {
            var note = new Pitch(i*7); // go up by fifths
            var angle = i * Math.PI / 6;
            var keyContainer = document.createElement("div");
            var key = document.createElement("div");
            key.className = "key";
            key.innerHTML = note.getPitchClassName();
            key.dataset.pitchClass = note.pitchClass;
            var radius = 75;
            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;
            var top = radius - x;
            var left = radius + y;
            keyContainer.style.top = top + "px";
            keyContainer.style.left = left + "px";
            keyContainer.appendChild(key);
            container.appendChild(keyContainer);
        }
    }

    static setTonicPitch(pitch) {
        CircleOfFifths.setTonic(pitch.pitchClass);
    }

    static setTonic(pitchClass) {
        CircleOfFifths.clearTonic();
        this.tonic = pitchClass;
        [...document.querySelectorAll('#circleOfFifths .key[data-pitch-class="' + pitchClass + '"]')].forEach((key) => {
            key.classList.add("active");
        });
    }

    static clearTonic() {
        [...document.querySelectorAll('#circleOfFifths .key')].forEach((key) => {
            key.classList.remove("active");
        });
    }

    static getTonic() {
        return this.tonic;
    }

    static getDominant() {
        return (this.tonic + 7) % 12;
    }

    static getSubdominant() {
        return (this.tonic + 5) % 12;
    }

    // Dominant of Dominant, two steps forward
    static getSupertonic() {
        return (this.tonic + 2) % 12;
    }

    // Subdominant of Subdominant, two steps backward
    static getSubtonic() {
        return (this.tonic + 10) % 12;
    }

    static moveToDominant() {
        CircleOfFifths.setTonic(CircleOfFifths.getDominant());
    }

    static moveToSubdominant() {
        CircleOfFifths.setTonic(CircleOfFifths.getSubdominant());
    }
}