const noteMap = {
  'c': 60,
  'c#': 61,
  'd': 62,
  'd#': 62,
  'e': 64,
  'f': 65,
  'f#': 66,
  'g': 67,
  'g#': 68,
  'a': 69,
  'a#': 70,
  'b': 71,
  'h': 71,
};


const numMap = {
  60: 'c',
  61: 'c#',
  62: 'd',
  63: 'd#',
  64: 'e',
  65: 'f',
  66: 'f#',
  67: 'g',
  68: 'g#',
  69: 'a',
  70: 'a#',
  71: 'b'
};

class Note {
  constructor(name) {
    const parts = /([a-z])(#|b)?(-[1-3]|[1-8])?/i.exec(name);
    this.name = parts[1];
    this.mod = parts[2];
    this.offset = 0;
    if (this.mod === undefined) {
      this.mod = '';
    }
    if (parts[3]) {
      this.octave = Number.parseInt(parts[3]);
    } else {
      this.octave = 0;
    }
  }

  getNumber() {
    return (this.nameToNote(this.name) + this.getModValue(this.mod)) + 12 * this.octave;
  }

  nameToNote(name) {
    return noteMap[name.toLowerCase()];
  }

  getModValue(mod) {
    mod = mod.toLowerCase();
    if (mod === '#') return 1;
    if (mod === 'b') return -1;
    return 0;
  }

  valueToMod(value) {
    if (value < 0) {
      return 'b';
    }
    if (value > 0) {
      return '#';
    }

    return '';
  }

  static fromNumber(number) {
    const n = number - 60;
    const octave = Math.floor(n / 12);
    const normalized = number - (octave * 12);
    return new Note(
      numMap[normalized].toUpperCase() + octave.toString()
    );
  }
}

export default Note;
