import { createEl, addZero } from '../method';

class Title {
  constructor(name, length) {
    this.name = name || '';
    this.initLen = length || 0;
    this.length = length || 0;

    this.span0 = createEl('span', ['img']);
    this.img = createEl('img', ['icon']);
    this.img.setAttribute('src', 'favicon.png');
    this.span0.append(this.img);
    this.span1 = createEl('span', ['name']);
    this.span1.innerHTML = 'Welcome to play music!';
    this.span2 = createEl('span', ['time']);
    this.span2.innerHTML = '';
    this.div = createEl('div', ['title']);
    this.div.append(this.span0, this.span1, this.span2);

    this.si = 0;
  }

  formatTime(length) {
    return '-' + addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
  }

  setTime() {
    this.span2.innerHTML = this.formatTime(this.length);
  }
  setName(name) {
    this.span1.innerHTML = name;
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
        window.PLAYAREA[window.CURRENTPLAYAREA].playList.next();
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
