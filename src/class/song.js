import { createEl, addZero } from '../method';
import Drag from './drag';
import { STATUS } from '../data';

class Song {
  constructor(id, name, length, player) {
    Object.assign(this, { id, name, length, player });

    this.selected = false;
    this.status = STATUS.READY;

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
    this.songTimeContainer.innerText = this.formatTime();

    this.songLi.appendChild(this.songCbxContainer);
    this.songLi.appendChild(this.sonsNameContainer);
    this.songLi.appendChild(this.songTimeContainer);
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
      this.clickSelectEvent();
    });
    this.sonsNameContainer.addEventListener('dblclick', () => {
      this.dblclickPlayEvent();
    });

    new Drag(this.songLi, this, this.player).init();
  }

  clickSelectEvent() {
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

  dblclickPlayEvent() {
    if (this.status === STATUS.PLAYING) return;

    if (!this.selected) {
      this.selected = true;
      this.songCheckbox.checked = true;
      this.songLi.classList.add('on');
    }

    this.player.stop();
    this.setPlay();
    this.player.playSong(this.id, this.name, this.length);
  }

  formatTime() {
    return addZero(Math.floor(this.length / 60)) + ':' + addZero(this.length % 60);
  }

  setPlay() {
    if (this.status === STATUS.PLAYING) {
      this.setPause();
      return;
    }
    this.songLi.classList.add(STATUS.PLAYING);
    this.status = STATUS.PLAYING;
  }

  setStop() {
    if (this.status === STATUS.STOP) return;
    this.songLi.classList.remove(STATUS.PLAYING);
    this.status = STATUS.STOP;
  }

  setPause() {
    if (this.status === STATUS.PAUSE) {
      this.setPlay();
      return;
    }
    this.status = STATUS.PAUSE;
  }

  getEl() {
    return this.songLi;
  }
}
export default Song;
