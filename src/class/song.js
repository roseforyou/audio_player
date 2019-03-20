import { createEl, addLeadingZero } from '../method';
import Drag from './drag';
import { STATUS } from '../data';

class Song {
  constructor(name, seconds, player) {
    Object.assign(this, { name, seconds, player });

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
    this.songTimeContainer.innerText = this._formatTime();

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
    if (this.status === STATUS.PLAYING) return;

    if (!this.selected) {
      this.selected = true;
      this.songCheckbox.checked = true;
      this.songLi.classList.add('on');
    }

    this.player.stop();
    this.player.setCurrentPlayArea();
    this.setPlay();
    this.player.playSong(this.name, this.seconds);
  }

  _formatTime() {
    return addLeadingZero(Math.floor(this.seconds / 60)) + ':' + addLeadingZero(this.seconds % 60);
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
