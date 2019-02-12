import test from 'ava'
import Note from '../src/note.js'

const possibleNotes = [
  'C', 'C#',
  'Db', 'D', 'D#',
  'Eb', 'E',
  'F', 'F#',
  'Gb', 'G', 'G#',
  'Ab', 'A', 'A#',
  'Bb', 'B'
];

const noteMap = {
  'c': 60,
  'd': 62,
  'e': 64,
  'f': 65,
  'g': 67,
  'a': 69,
  'b': 71,
  'h': 71
};

const numMap = {
  60: 'c',
  61: 'c#',
  62: 'd',
  63: 'd#',
  64: 'e',
  65: 'f',
  66: 'f#',
  67: 'g',
  68: 'g#',
  69: 'a',
  70: 'a#',
  71: 'b'
};

function failTest(t, expected, actual, additional = "") {
  t.fail(actual + " did not match expected " + expected +". Info: " + additional)
}

test(
  'name to note', t => {
    const n = new Note('C');

    for(let x in noteMap) {
      let expected = noteMap[x];
      let actual = n.nameToNote(x);

      if (expected !== actual) {
        failTest(t, expected, actual);
      }
    }

    t.pass();
  });

test(
  'Ocatves -3 to 8', t => {
    for (let i = -3; i <= 8; ++i) {
      let c = 60;

      for (let index in possibleNotes) {
        let note = possibleNotes[index];
        if (note.substr(-1) === 'b') {
          --c;
        }

        let expected = c + i*12;

        if (0 !== i) {
          note = note.concat(i.toString());
        }

        const n = new Note(note);
        const actual = n.getNumber();
        if (actual !== expected) {
          failTest(t, expected, actual, note);
        }

        c++;
      }
    }

    t.pass();
  }
);

test('from number', t => {
  for (let i = 24; i < 156; ++i) {
    const actual = Note.fromNumber(i);
    const octave = Math.floor((i-60) / 12);
    const norm = i  - octave * 12;
    let note = numMap[norm].toUpperCase();

    if (octave !== 0) {
      note += octave.toString();
    }

    const expected = new Note(note);
    const info = expected.name;

    if (actual.octave !== expected.octave) {
      failTest(t, expected.octave, actual.octave, info);
    }

    if (actual.name !== expected.name) {
      failTest(t, expected.name, actual.name, info);
    }

    t.pass();
  }
});
