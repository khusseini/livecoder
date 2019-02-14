class Player {
  constructor( sendOn, sendOff, signature = 1/4, tpb = 24) {
    this.isPlaying = false;
    this.ticksPerBeat = tpb;
    this.sendOn = sendOn;
    this.sendOff = sendOff;
    this.beatSignature = signature;

    this.currentposition = 0 ;
    this.lastIndex = 0;
    this.seq = [];
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
      this.currentposition = 0;
    }
  }

  reset() {
    while(this.seq.length) {
      const i = this.seq.pop();
      if (i) this.sendOff(i.off);
    }

    this.currentposition = 0;
    this.lastIndex = 0;
  }

  append(noteLength, notes = []) {
    const framesPerSignature = this.ticksPerBeat / this.beatSignature;
    const framesPerNoteLength = noteLength * framesPerSignature;
    let start = this.lastIndex;
    let end = start + framesPerNoteLength-1;
    let startFrame = this.getFrame(start);
    let endFrame = this.getFrame(end);

    if (notes.length) {
      for(let i = 0; i < notes.length; i++) {
        let note = notes[i];
        start = start + (note.offset*framesPerSignature);
        end = start + framesPerNoteLength-1;
        if (end > this.seq.length-1) {
          end = this.seq.length-1;
        }

        if (start < 0) {
          start = 0;
        }

        startFrame = this.getFrame(start);
        endFrame = this.getFrame(end);
        startFrame.on.push(note);
        endFrame.off.push(note);
        this.seq[start] = startFrame;
        this.seq[end] = endFrame;
      }

    } else {
      this.seq[start] = startFrame;
      this.seq[end] = endFrame;
    }
    this.lastIndex += framesPerNoteLength;
  }

  correctIndex(index) {
    if (index < 0) {
      index = this.seq.length + index;
    }

    if (index > this.seq.length-1) {
      index = index - this.seq.length;
    }

    return index;
  }

  getFrame(index) {
    let frame = this.seq[index];
    if (!frame) {
      frame = this.seq[index] = {on: [], off: []};
    }

    return frame;
  }

  tick() {
    if (!this.isPlaying) return;
    const i = this.getFrame(this.currentposition);

    if (i) {
      this.sendOn(i.on);
      this.sendOff(i.off);
    }

    ++this.currentposition;

    if (this.currentposition >= this.seq.length) {
      this.currentposition = 0;
    }
  }

}

export default Player;
