class Player {
  constructor( sendOn, sendOff, signature = 1/4, tpb = 24) {
    this.isPlaying = false;
    this.tpb = tpb;
    this.sendOn = sendOn;
    this.sendOff = sendOff;
    this.seq = [];
    this._start = 0;
    this.index = 0;
    this.signature = signature;
  }

  play() {
    this.isPlaying = true;
  }

  stop(reset = true) {
    this.isPlaying = false;
    for(let i = 0; i < this.seq.length; i++) {
      if (this.seq[i]) this.sendOff(this.seq[i].off);
    }

    if (reset) {
      this.index = 0;
    }
  }

  reset() {
    while(this.seq.length) {
      const i = this.seq.pop();
      if (i) this.sendOff(i.off);
    }
    this._start = 0;
  }

  add(timing, notes = []) {
    const end = (this._start + (this.tpb / this.signature) * timing)-1;
    let st = this.seq[this._start];
    let e = this.seq[end];
    if (!st) {
      st = {on: [], off: []};
    }

    if (!e) {
      e = {on: [], off: []};
    }

    if (notes.length) {
      st.on = st.on.concat(notes);
      e.off = e.off.concat(notes);
    }

    this.seq[this._start] = st;
    this.seq[end] = e;
    this._start = end+1;
  }

  tick() {
    if (!this.isPlaying) return;
    const i = this.seq[this.index];
    if (i) {
      this.sendOn(i.on);
      this.sendOff(i.off);
    }
    ++this.index;
    if (this.index >= this.seq.length) {
      this.index = 0;
    }
  }

}

export default Player;
