import Element from './element.js';

class CommandInput extends Element {
  constructor(pos, width, callback, autocomplete = (i) => i) {
    super(pos, width, 1);
    this.callback = callback;
    this.isActive = false;
    this.autoComplete = autocomplete;
  }

  deactivate(term) {
    this.isActive = false;
    term.moveTo.eraseLine(this.pos.x, this.pos.y);
    term.hideCursor(true);
  }

  activate(term) {
    term.hideCursor(false);
    this.clear(term);
    this.isActive = true;
    term.moveTo(this.pos.x, this.pos.y, ': ');
    const me = this;
    term.inputField({
      cancelable: true,
      autocomplete: this.autoComplete
    }, (e,i) => {
      me.deactivate(term);
      if (me.callback) {
        me.callback(i);
      }
    });
  }

  showInfo(text, term) {
    term.eraseArea(this.pos.x, this.pos.y, this.width, this.height);
    term.hideCursor(true);
    term.moveTo.yellow(this.pos.x, this.pos.y, text);
  }
}

export default CommandInput;
