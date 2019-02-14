import {seqRegex} from "./sequence.js";
import format from 'string-format';
import MidiClock from 'midi-clock';

/** base **/
class Command {
  constructor(name, input, output) {
    this.name = name;
    this.input = input;
    this.output = output;
    this.regex = /.*/;
  }

  supports(text) {
    return this.regex.test(text);
  }

  run(text, livecoder, term) {
    return text;
  }

  static funcRegEx(name) {
    return new RegExp(name+'\\(([^)]+)\\)');
  }

  static cmdRegEx(name) {
    return new RegExp(name);
  }

  static selectRegEx(name) {
    return new RegExp(name+'(?:\\(([^)]+)\\))?');
  }
}

/** dev(n) **/
class SelectDeviceCommand extends Command {
  constructor(input, output) {
    super('dev', input, output);
    this.regex = Command.selectRegEx(this.name);
  }

  run(text, livecoder, term) {
    super.run(livecoder, term);
    const r = this.regex.exec(text);

    if (r[1]) {
      livecoder.selectDevice(r[1]);
      this.input.showInfo(format("Selected device {}", livecoder.getOutputs()[r[1]]), term);
      return text;
    }

    this.output.list(
      livecoder.getOutputs()
      , term
      , 'Select a device with dev(n):'
    );

    return text;
  }
}

/** sequencer **/
class ParseSequenceCommand extends Command {
  constructor(input, output) {
    super('parse', input, output);
    this.regex = seqRegex;
  }

  run(text, livecoder, term) {
    livecoder.parse(text);

    this.input.showInfo(format("Playing {0} on {1} Ch.{2}",
      text,
      livecoder.getOutputs()[livecoder.midi.index],
      livecoder.currentChannel
    ), term);

    return text;
  }
}

/** ch(n) **/
class SetChannelCommand extends Command {
  constructor(input, output) {
    super('ch', input, output);
    this.regex = Command.funcRegEx(this.name);
  }

  run(text, livecoder, term) {
    const r = this.regex.exec(text);
    livecoder.selectChannel(r[1]-1);
    this.input.showInfo(format("Selected currentChannel {0}", r[1]), term);
  }
}

/** hist(n) **/
class HistoryCommand extends Command {
  constructor(input, output) {
    super('hist', input, output);
    this.regex = Command.selectRegEx(this.name);
    this.history = [];
  }

  run(text, livecoder, term) {
    if (seqRegex.test(text)) {
      this.history.push(text);
      if (this.history.length > 10) {
        this.history.shift();
      }

      return text;
    }

    const r = this.regex.exec(text);
    if (!r[1]) {
      this.output.list(
        this.history, term, 'Select a command with hist(n)'
      );
    }

    if (r[1] >=0 && r[1] < this.history.length) {
      text = this.history[r[1]];
    }

    return text;
  }

  supports(text) {
    if (seqRegex.test(text)) {
      return true;
    }

    return super.supports(text);
  }
}

/** clock(start|stop|n) **/
class ClockCommand extends Command {
  constructor(input, output, callbacks) {
    super('clock', input, output);
    this.regex = Command.funcRegEx(this.name);
    this.clock = MidiClock();
    this.clock.on('position', callbacks.tick);
    this.callbacks = callbacks;
    this.clock.setTempo(110);
  }

  setTempo(tempo) {
    this.clock.setTempo(tempo);
  }

  run(text, livecoder, term) {
    const r = this.regex.exec(text);
    if (r[1] === 'start') {
      if (this.callbacks.start) {
        this.callbacks.start();
      }
      this.input.showInfo('Clock started', term);
      this.clock.start();
    }

    if (r[1] === 'stop') {
      if (this.callbacks.stop) {
        this.callbacks.stop();
      }
      this.input.showInfo('Clock stopped', term);
      this.clock.stop();
    }

    const tempo = Number.parseInt(r[1]);
    if (!Number.isNaN(tempo)) {
      this.setTempo(tempo);
      this.input.showInfo(format('Clock set to {0}', tempo), term);
    }

    return text;
  }
}

export {
  SelectDeviceCommand,
  ParseSequenceCommand,
  SetChannelCommand,
  HistoryCommand,
  ClockCommand
};
