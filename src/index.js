import termkit from 'terminal-kit';
import CommandInput from './ui/commandinput.js'
import InfoWindow from "./ui/info_window";
import LiveCoder from './livecoder.js';
import * as cmd from "./commands.js";

const term = termkit.terminal;
const livecoder = new LiveCoder();

term.saveCursor();
term.fullscreen();
term.hideCursor(true);

const center = {
  x: term.width/2,
  y: term.height/2
};

const infoWindow = new InfoWindow(center, term.width/2, term.height/2);

const commandInput = new CommandInput({x: 0, y: term.height}, term.width,
  // Command Handler
  (input) => {
    for(let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.supports(input)) {
        input = command.run(input, livecoder, term);
      }
    }
  },
  // Command Autocomplete
  (input) => {
  if (input.length > 2) {
    for(let i = 0; i < commands.length; i++) {
      if (commands[i].name.search(input) === 0) {
        return commands[i].name;
      }
    }
  }

  return input;
});

const commands = [
  new cmd.SelectDeviceCommand(commandInput, infoWindow),
  new cmd.SetChannelCommand(commandInput, infoWindow),
  new cmd.ClockCommand(commandInput, infoWindow, {
    tick: (p) => {
      livecoder.clock();
      livecoder.midi.getSelectedOutput().send('clock');
      livecoder.midi.getSelectedOutput().send('position', p);
    },
    start: () => { livecoder.play(); },
    stop: () => { livecoder.stop() }
  }),
  new cmd.HistoryCommand(commandInput, infoWindow),
  new cmd.ParseSequenceCommand(commandInput, infoWindow),
];

term.grabInput() ;
term.on('key' , (name) => {
  if ( name === 'CTRL_C' ) {
    term.restoreCursor();
    process.exit() ;
  }

  if (name === 'ESCAPE') {
    commandInput.deactivate(term);
  }

  if ( name === ':' && !commandInput.isActive) {
    commandInput.activate(term);
  }
});
