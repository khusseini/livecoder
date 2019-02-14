import Player from "./player";
import Midi from "./midi.js";
import {Sequence} from "./sequence";
import Note from './note.js';

class LiveCoder
{
  parse(input) {
    if (!this.currentPlayer) return;
    this.currentPlayer.reset();

    const seq = new Sequence(input);

    for (let i = 0; i < seq.sequence.length; i++) {
      const step = seq.sequence[i];
      if (step.chord) this.currentPlayer.append(
        step.lengthFloat,
        step.chord.getNotes(
          this.options.root,
          function(note, j) {
            // Do some note modification here
          }
        )
      );
      else if(step.note) this.currentPlayer.append(step.lengthFloat, [step.note]);
      else this.currentPlayer.append(step.lengthFloat, []);
    }
  }

  constructor(options = {
      root: new Note('A'),
      tpb: 24
    }) {
    this.midi = new Midi();
    this.players = [];
    this.currentPlayer = null;
    this.selectChannel(1);
    this.initializedInputs = [];
    this.options = options;
    this.currentChannel = 0;
  }

  selectChannel(channel) {
    this.currentChannel = channel;
    this.currentPlayer = this.players[channel];
    if (!this.currentPlayer) {
      this.currentPlayer = this.players[channel] = new Player(
        (n) => this.midi.sendOn(n, channel),
        (n) => this.midi.sendOff(n, channel)
      );
    }
  }

  selectDevice(index) {
    this.midi.setIndex(index);
    this.selectChannel(0);
    const input = this.midi.getSelectedInput();

    if (this.initializedInputs.indexOf(index) > -1) {
      return;
    }

    this.initializedInputs.push(index);
    const me = this;
    input._input.ignoreTypes(true, false, true);

    input.on('start', () => me.start());
    input.on('continue', () => me.continue());
    input.on('stop', () => me.stop());
    input.on('reset', () => me.reset());
    input.on('clock', () => me.clock());
  }

  getOutputs() {
    return this.midi.outputs;
  }

  start() {
    this.players.forEach((i) => i.play());
  }

  continue() {
    this.players.forEach((i) => i.play());
  }

  stop() {
    this.players.forEach((i) => i.stop());
  }

  reset() {
    this.players.forEach((i) => i.stop());
  }

  clock() {
    this.players.forEach((i) => i.tick());
  }
}

export default LiveCoder;
