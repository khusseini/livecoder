import Element from './element.js';

class InfoWindow extends Element {
  constructor(pos = {x:0,y:0}, width=0, height=0) {
    super(pos, width, height);

    this.pos.x -= this.width/2;
    this.pos.y -= this.height/2;
  }

  list(list, term, title = '') {
    this.clear(term);

    let n = 0;
    if (title.length) {
      term.moveTo.green(this.pos.x, this.pos.y, title);
      n++;
    }

    for(let i = 0; i < list.length; i++) {
      term.moveTo.yellow(this.pos.x, this.pos.y+i+n, i + ' '+list[i]);
    }
  };
}

export default InfoWindow;
