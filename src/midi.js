import midi from 'easymidi';

class Midi {
  constructor() {
    this.outputs = midi.getOutputs();
    this.inputs = midi.getInputs();
    this.index = 0;
    this.o = null;
    this.i = null;
    this.channel = 1;
  }

  getSelectedOutput() {
    if (!this.o) {
      this.o = new midi.Output(this.outputs[this.index]);
    }

    return this.o;
  }

  sendOn(notes) {
    for(let i = 0; i < notes.length; i++) {
      this.send('noteon', notes[i]);
    }
  }

  send(action, note, vel = 127) {
    this.getSelectedOutput().send(action, {
      note: note.getNumber(),
      velocity: vel,
      channel: this.channel
    });
  }

  sendOff(notes) {
    for(let i = 0; i < notes.length; i++) {
      this.send('noteoff', notes[i]);
    }
  }

  getSelectedInput() {
    if (!this.i) {
      this.i = new midi.Input(this.inputs[this.index]);
    }

    return this.i;
  }

  setIndex(index) {
    this.o = null;
    this.i = null;
    this.index = index;
  }

  close() {
  }
}

export default Midi;
