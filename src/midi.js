import midi from 'easymidi';

class Midi {
  constructor() {
    this.outputs = midi.getOutputs();
    this.inputs = midi.getInputs();
    this.index = 0;
    this.o = null;
    this.i = null;
  }

  getSelectedOutput() {
    if (!this.o) {
      this.o = new midi.Output(this.outputs[this.index]);
    }

    return this.o;
  }

  sendOn(notes, channel = 1) {
    for(let i = 0; i < notes.length; i++) {
      this.send('noteon', notes[i], channel);
    }
  }

  send(action, note, channel = 1, vel = 127) {
    const data = {
      note: note.getNumber(),
      velocity: vel,
      channel: Number(channel)
    };
    this.getSelectedOutput().send(action, data);
  }

  sendOff(notes, channel = 1) {
    for(let i = 0; i < notes.length; i++) {
      this.send('noteoff', notes[i], channel);
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
