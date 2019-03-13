import { createEl } from '../method';

class Bar {
  constructor() {
    this.el = createEl('div', ['bar']);
    this.elInner = createEl('div', ['pb']);
    this.el.append(this.elInner);

    this.timer = 0;
    this.interval = 50;
    this.songCurrentSeconds = 0;
    this.songTotalSeconds = 0;
  }

  getEl() {
    return this.el;
  }

  _setElWidth(width) {
    this.elInner.style.width = width;
  }

  _formatLength() {
    this._setElWidth(((100 * this.songCurrentSeconds) / this.songTotalSeconds).toFixed(2) + '%');
  }

  setLength(seconds) {
    this.songCurrentSeconds = seconds;
    this.songTotalSeconds = seconds;
    this.elInner.style.width = '100%';
  }

  play() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.songCurrentSeconds <= 0) {
        clearInterval(this.timer);
        return;
      }
      this.songCurrentSeconds = this.songCurrentSeconds - this.interval / 1000;
      this._formatLength();
    }, this.interval);
  }

  pause() {
    clearInterval(this.timer);
  }

  stop() {
    clearInterval(this.timer);
    this.songCurrentSeconds = 0;
    this._setElWidth(0);
  }
}

export default Bar;
