import { createEl } from '../method';

class Bar {
  constructor() {
    this._init();
  }

  _init() {
    this.el = createEl('div', ['bar']);
    this.elInner = createEl('div', ['pb']);
    this.el.appendChild(this.elInner);
  }

  setLength(currentSec, totalSec) {
    this._setValue(((100 * currentSec) / totalSec).toFixed(2) + '%');
  }

  fullSize() {
    this._setValue('100%');
  }

  zeroSize() {
    this._setValue(0);
  }

  _setValue(val) {
    this.elInner.style.width = val;
  }

  getEl() {
    return this.el;
  }
}

export default Bar;
