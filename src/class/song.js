import { createEl, addLeadingZero } from '../method';
import Drag from './drag';
import { STATUS } from '../data';

class Song {
  constructor(id, name, seconds, player) {
    Object.assign(this, { id, name, seconds, player });

    this.selected = false;

    this._init();
    this._bindEvent();
  }

  _init() {
    this.songLi = createEl('li');
    this.songLi.setAttribute('draggable', 'true');
    this.songCheckbox = createEl('input', [], 'checkbox');

    this.songCbxContainer = createEl('span', ['cb']);
    this.songCbxContainer.appendChild(this.songCheckbox);

    this.sonsNameContainer = createEl('span', ['name']);
    this.sonsNameContainer.innerText = this.name;

    this.songTimeContainer = createEl('span', ['time']);
    this.songTimeContainer.innerText = this._formatTime();

    this.songLi.append(this.songCbxContainer, this.sonsNameContainer, this.songTimeContainer);
  }

  _bindEvent() {
    this.songCheckbox.addEventListener('click', () => {
      if (this.selected) {
        this.selected = false;
        this.songLi.classList.remove('on');
      } else {
        this.selected = true;
        this.songLi.classList.add('on');
      }
    });

    this.sonsNameContainer.addEventListener('click', () => {
      this._clickSelectEvent();
    });
    this.sonsNameContainer.addEventListener('dblclick', () => {
      this._dblclickPlayEvent();
    });

    new Drag(this.songLi, this, this.player).init();
  }

  _clickSelectEvent() {
    if (this.selected) {
      this.selected = false;
      this.songCheckbox.checked = false;
      this.songLi.classList.remove('on');
    } else {
      this.selected = true;
      this.songCheckbox.checked = true;
      this.songLi.classList.add('on');
    }
  }

  _dblclickPlayEvent() {
    if (this.songLi.classList.contains('on')) return;

    if (!this.selected) {
      this.selected = true;
      this.songCheckbox.checked = true;
      this.songLi.classList.add('on');
    }

    this.player.stop();
    this.player.setCurrentPlayArea();
    this.setPlay();
    this.player.playSong(this);
  }

  _formatTime() {
    return addLeadingZero(Math.floor(this.seconds / 60)) + ':' + addLeadingZero(this.seconds % 60);
  }

  setPlay() {
    this.songLi.classList.add(STATUS.PLAYING);
  }

  setStop() {
    this.songLi.classList.remove(STATUS.PLAYING);
  }

  getEl() {
    return this.songLi;
  }
}
export default Song;
