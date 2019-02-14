import {Chord, splitRegex} from './chord.js';
import Note from './note.js';

const seqRegex = /([^@]*)@(\d+\/\d+)/i;
const singleRegex = /([A-G](?:#|b)?(?:-?\d+)?)/;

class Sequence {
  constructor(sequence) {
    this.sequence = [];
    const steps = sequence.split(' ');
    this.length = 0;

    for(let i = 0; i < steps.length; ++i) {
      if (!seqRegex.test(steps[i])) continue;
      const parts = steps[i].split('@');
      let noteLength = parts[1].split('/');
      noteLength = noteLength[0]/noteLength[1];
      this.length += noteLength;
      let chord = null;
      let note = null;

      if (splitRegex.test(parts[0])) {
        chord = new Chord(parts[0]);
      }

      if (singleRegex.test(parts[0])) {
        note = new Note(parts[0]);
      }

      this.sequence.push({
        chord: chord,
        note: note,
        noteLength: parts[1],
        lengthFloat: noteLength,
      });
    }
  }

}

export {Sequence, seqRegex};
