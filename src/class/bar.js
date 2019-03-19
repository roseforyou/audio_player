import { createEl } from '../method';

class Bar {
  constructor() {
    this._init();
  }

  _init() {
    this.el = createEl('div', ['bar']);
    this.elInner = createEl('div', ['pb']);
    this.el.append(this.elInner);
  }

  setLength(currentSec, totalSec) {
    this.elInner.style.width = ((100 * currentSec) / totalSec).toFixed(2) + '%';
  }

  fullSize() {
    this.elInner.style.width = '100%';
  }

  zeroSize() {
    this.elInner.style.width = 0;
  }

  getEl() {
    return this.el;
  }
}

export default Bar;
