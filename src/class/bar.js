import { createEl, addZero } from "../method";

class Bar {
  constructor() {
    this.div = createEl("div", ["bar"]);
    this.divInner = createEl("div", ["pb"]);
    this.div.append(this.divInner);

    this.si = 0;
  }

  getEl() {
    return this.div;
  }

  init() {
    this.initLength = 0;
    this.length = 0;
    this.divInner.style.width = 0;
  }

  formatLength() {
    this.divInner.style.width = (100 * this.length) / this.initLen + "%";
  }

  setLength(length) {
    this.length = length;
    this.initLen = length;
    this.divInner.style.width = "100%";
  }

  play() {
    clearInterval(this.si);
    this.si = setInterval(() => {
      if (this.length === 0) {
        clearInterval(this.si);
        return;
      }
      this.length = this.length - 0.05;
      this.formatLength();
    }, 50);
  }

  pause() {
    clearInterval(this.si);
  }

  stop() {
    clearInterval(this.si);
    this.init();
  }
}

export default Bar;
