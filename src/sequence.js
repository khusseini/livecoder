import {Chord} from './chord.js';

const seqRegex = /([^@]*)@(\d+\/\d+)/i;

class Sequence {
  constructor(key, sequence) {
    this.key = key;
    this.sequence = [];
    const steps = sequence.split(' ');
    this.length = 0;

    for(let i = 0; i < steps.length; ++i) {
      if (!seqRegex.test(steps[i])) continue;
      const parts = steps[i].split('@');
      let timing = parts[1].split('/');
      timing = timing[0]/timing[1];
      this.length += timing;
      let chord = null;

      if (parts[0]) {
        chord = new Chord(this.key, parts[0]);
      }
      this.sequence.push({
        chord: chord,
        timing: parts[1],
        ctiming: timing,
      });
    }
  }

}

export {Sequence, seqRegex};
