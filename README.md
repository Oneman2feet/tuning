# Quickstart / Dev

- `npm install`
- `npm start`

# Build / Prod

- `npm install`
- `npm run build`
- open `dist/index.html` in your browser

# MIDI Setup

## Play notes using your computer keyboard

1. Make a LoopMIDI port "A", and connect VMPK's MIDI OUT to it.
2. When starting the app, choose LoopMIDI port "A" as MIDI IN and the app will respond when you play notes in VMPK.

## Listen to tuned output in a desired sound font

1. Install and launch VirtualMidiSynth.
2. Import and select your desired sound font (preset zero will be used).
3. When starting the app, choose "VirtualMidiSynth #1" as MIDI OUT and your notes will use the desired sound font.

## Record tuned output to a .mid file

1. Make a LoopMIDI port "B", and connect MidiEditor's MIDI IN to it.
2. If you want live audio while recording, set "VirtualMidiSynth #1" as MIDI OUT in MidiEditor.
3. When starting the tuning app, choose LoopMIDI port "B" as MIDI OUT.
4. Press record in MidiEditor, then play the notes you want tuned.
5. When done, press stop in MidiEditor and the played notes will be added to your .mid file.
6. Keep in mind that each pitch class will be saved to a different channel in order for pitch shift to be isolated per note.

# MIDI Programs

- [LoopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html) for connections between MIDI software components
- [VMPK](https://vmpk.sourceforge.io/) for using your computer keyboard to play MIDI
- [VirtualMidiSynth](https://coolsoft.altervista.org/en/virtualmidisynth) to make sound with your MIDI creations
- [MidiEditor](https://www.midieditor.org/) for recording, adjusting, and playing back piano rolls
- [Polyphone](https://www.polyphone-soundfonts.com/) for editing sound fonts
- [SynthFont](http://www.synthfont.com/index.html) for editing and playing MIDI files with different sound fonts