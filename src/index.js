import Note from './note.js';
import {seqRegex, Sequence} from "./sequence.js";
import Midi from "./midi.js";
import Player from "./player";
import shuffle from 'shuffle-array';
import {chordMods} from "./chord.js";

process.stdin.resume();
process.stdin.setEncoding('utf8');

const midi = new Midi();
const players = [];
let player = null;

selectChannel(1);

const history = [];
const options = {
  root: new Note('C2'),
  tpb: 24
};

console.log("");
console.log("Welcome to Livecoder!");
console.log("");

function selectChannel(channel) {
  console.log("Selecting channel ", channel);
  channel--;
  player = players[channel];

  if (!player) {
    player = players[channel] = new Player(
      (n) => midi.sendOn(n, channel),
      (n) => midi.sendOff(n, channel)
    );
  }
}

function selectDevice() {
  console.log('Select a midi device');
  for (let i = 0; i < midi.outputs.length; ++i) {
    console.log(i, midi.outputs[i]);
  }
  process.stdin.on('data', function (index) {
    const i = Number(index);
    if (i >= 0 && i < midi.outputs.length) {
      console.log("Selected device \""+ midi.outputs[i]+ "\"");
      midi.setIndex(i);
      const input = midi.getSelectedInput();

      input.on('start', () => {
        players.forEach((i) => i.play());
        console.log('player started');
      });

      input.on('continue', () => {
        players.forEach((i) => i.play());
        console.log('player continued');
      });

      input.on('stop', () => {
        players.forEach((i) => i.stop());
        console.log('player stopped');
      });

      input.on('reset', () => {
        players.forEach((i) => i.stop());
        console.log('player reset')
      });

      input.on('clock', () => {
        players.forEach((i) => i.tick());
      });
    }
  });
  selectChannel(1);
}

function done() {
  players.forEach((i) => i.stop());
  console.log('Bye!!');
  process.exit();
}

process.stdin.on('data', function (text) {
  if (/: *quit/.test(text)) {
    done();
    return;
  }

  if (/: *start/.test(text)) {
    players.forEach((i) => i.play());
    return;
  }

  if (/: *stop/.test(text)) {
    players.forEach((i) => i.stop());
    return;
  }

  if (/: *conf/.test(text)) {
    selectDevice();
    return;
  }

  if (/: *set *([^=]+)=(.*)/.test(text)) {
    const parts = /: *set *([^=]+)=(.*)/.exec(text);
    const key = parts[1];
    let value = parts[2];

    if (!options.hasOwnProperty(key)) {
      console.log('Option '+key+' does not exists');
      return;
    }

    if (key === 'root') {
      value = new Note(value);
      console.log("Root Note", value.getNumber());
    }

    if (key === 'tpb') {
      player.ticksPerBeat = value;
    }

    options[key] = value;
    console.log("Updated option "+key, options[key]);
  }

  function renderSection(subject, c) {
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

  if (/: *hist(\(\d+\))?/.test(text)) {
    const parts = /: *hist(?:\((\d+)\))?/.exec(text);
    if (history.length && typeof parts[1] === 'string') {
      text = history[Number(parts[1])];
    } else {
      for(let i = 0; i < history.length; i++) {
        console.log(i, history[i]);
      }
    }
  }

  if (/: *(\d+)/.test(text)) {
    const channel = /: *(\d+)/.exec(text)[1];

    selectChannel(channel);
  }

  if (/: *jam\(([^)]+)\)/.test(text)) {
    const chords = /: *jam\(([^)]+)\)/.exec(text)[1].split(' ');
    const a = Array(chords.length).fill(0).map((x,y) => y);
    const b = shuffle(a, {copy: true});
    let rendered = '';
    rendered += renderSection(a, chords);
    rendered += renderSection(b, chords);
    text = rendered;
  }

  if (seqRegex.test(text)) {
    console.log('Sequencing...', text);
    history.push(text);
    player.reset();
    const seq = new Sequence(text);
    for (let i = 0; i < seq.sequence.length; i++) {
      const step = seq.sequence[i];
      if (step.chord) player.append(
        step.lengthFloat,
        step.chord.getNotes(
          options.root,
          function(note, j) {

          }
        )
      );
      else player.append(step.lengthFloat, []);
    }
  }
});
