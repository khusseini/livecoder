class Element {
  constructor(pos = {x:0,y:0}, width=0, height=0) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  clear(term) {
    term.eraseArea(this.pos.x, this.pos.y, this.width, this.height);
  }
}

export default Element;
