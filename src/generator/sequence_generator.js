import shuffle from 'shuffle-array';
import {chordMods} from "../chord.js";

class SequenceGenerator
{
  constructor() {

  }

  renderSection(subject, c) {
    let rendered = '';
    for(let i = 0; i < subject.length; i++) {
      const useMod = Math.random() > 0.5;
      let mod = '';
      if (useMod) {
        const mods = Object.keys(chordMods);
        const index = Math.floor(Math.random() * mods.length-1);
        mod = mods[index];
        if (!mod) {
          mod = mods[0];
        }
      }
      rendered += c[subject[i]] + mod +"@1/4 ";
    }

    return rendered;
  }
  parse(input) {
    const chords = input.split(' ');
    const a = Array(chords.length).fill(0).map((x,y) => y);
    const b = shuffle(a, {copy: true});
    let rendered = '';
    rendered += this.renderSection(a, chords);
    rendered += this.renderSection(b, chords);
    return rendered;
  }

}

export default SequenceGenerator;
