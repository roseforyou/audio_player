import { createEl, addZero } from '../method';

class Title {
  constructor(player) {
    Object.assign(this, { player });
    this.name = '';

    this.logoContainer = createEl('span', ['img']);
    this.img = createEl('img', ['icon']);
    this.img.setAttribute('src', 'favicon.png');
    this.logoContainer.append(this.img);
    this.titleContainer = createEl('span', ['name']);
    this.titleContainer.innerText = 'Welcome to play music!';
    this.timeContainer = createEl('span', ['time']);
    this.timeContainer.innerText = '';
    this.div = createEl('div', ['title']);
    this.div.append(this.logoContainer, this.titleContainer, this.timeContainer);
  }

  formatTime(seconds) {
    return '-' + addZero(Math.floor(seconds / 60)) + ':' + addZero(seconds % 60);
  }

  setTime(seconds) {
    this.timeContainer.innerText = this.formatTime(seconds);
  }

  setName(name) {
    this.titleContainer.innerText = name;
  }

  addAnimate() {
    this.logoContainer.classList.add('animate');
  }

  removeAnimate() {
    this.logoContainer.classList.remove('animate');
  }

  getEl() {
    return this.div;
  }
}
export default Title;
