import { createEl, addZero } from '../method';

class Title {
  constructor(player) {
    Object.assign(this, { player });
    this.name = '';
    this.initLen = 0;
    this.length = 0;

    this.span0 = createEl('span', ['img']);
    this.img = createEl('img', ['icon']);
    this.img.setAttribute('src', 'favicon.png');
    this.span0.append(this.img);
    this.span1 = createEl('span', ['name']);
    this.span1.innerText = 'Welcome to play music!';
    this.span2 = createEl('span', ['time']);
    this.span2.innerText = '';
    this.div = createEl('div', ['title']);
    this.div.append(this.span0, this.span1, this.span2);

    this.si = 0;
  }

  formatTime(length) {
    return '-' + addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
  }

  setTime() {
    this.span2.innerText = this.formatTime(this.length);
  }
  setName(name) {
    this.span1.innerText = name;
  }

  setLength(length) {
    this.length = length;
    this.initLen = length;
    this.setTime();
  }

  play() {
    this.span0.classList.add('animate');
    clearInterval(this.si);
    this.si = setInterval(() => {
      if (this.length === 0) {
        clearInterval(this.si);
        this.length = this.initLen;
        // playlist next song
        this.player[this.player.currentPlayarea].playList.next();
        return;
      }
      this.length--;
      this.setTime();
    }, 1000);
  }

  pause() {
    clearInterval(this.si);
    this.span0.classList.remove('animate');
  }

  stop() {
    this.span0.classList.remove('animate');
    clearInterval(this.si);
    this.length = this.initLen;
  }

  getEl() {
    return this.div;
  }
}
export default Title;
