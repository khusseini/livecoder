import Note from './note.js';
import {seqRegex, Sequence} from "./sequence.js";
import Midi from "./midi.js";
import Player from "./player";

process.stdin.resume();
process.stdin.setEncoding('utf8');

const midi = new Midi();
const player = new Player(
  (n) => midi.sendOn(n),
  (n) => midi.sendOff(n)
);

const options = {
  root: new Note('C2'),
};

console.log("");
console.log("Welcome to Livecoder!");
console.log("");

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
        player.play();
        console.log('player started');
      });

      input.on('continue', () => {
        player.play();
        console.log('player started');
      });

      input.on('stop', () => {
        player.stop();
        console.log('player stopped');
      });

      input.on('reset', () => {
        player.stop(true);
        console.log('player reset')
      });

      input.on('clock', () => {
        player.tick();
      });
    }
  });
}

function done() {
  player.stop();
  midi.close();
  console.log('Bye!!');
  process.exit();
}

process.stdin.on('data', function (text) {
  if (text === 'quit\n') {
    done();
    return;
  }

  if (text == 'start\n') {
    player.play();
    return;
  }

  if (text == 'stop\n') {
    player.stop();
    return;
  }

  if (text === 'conf\n') {
    selectDevice();
    return;
  }

  if (seqRegex.test(text)) {
    player.reset();
    const seq = new Sequence(options.root, text);
    for (let i = 0; i < seq.sequence.length; i++) {
      const step = seq.sequence[i];
      if (step.chord) player.add(step.ctiming, step.chord.getNotes());
      else player.add(step.ctiming, []);
    }
  }
});
