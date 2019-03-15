import { createEl, addZero, selector } from '../method';
import Drag from './drag';

class Song {
  constructor(id, name, length, playListObj, player) {
    Object.assign(this, { id, name, length, playListObj, player });

    this.selected = false;

    this.status = 'ready'; // ready playing pause stop

    this.li = createEl('li');
    this.li.setAttribute('draggable', 'true');
    this.cb = createEl('input', [], 'checkbox');
    this.cb.addEventListener('click', () => {
      if (this.selected) {
        this.selected = false;
        this.li.classList.remove('on');
      } else {
        this.selected = true;
        this.li.classList.add('on');
      }
    });

    this.span1 = createEl('span', ['cb']);
    this.span1.appendChild(this.cb);

    this.span2 = createEl('span', ['name']);
    this.span2.innerText = this.name;
    this.span2.addEventListener('click', () => {
      if (this.selected) {
        this.selected = false;
        this.cb.checked = false;
        this.li.classList.remove('on');
      } else {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add('on');
      }
    });

    this.span2.addEventListener('dblclick', () => {
      if (this.status === 'playing') return;
      this.playListObj.playSong(this.id, this.name, this.length);
      if (!this.selected) {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add('on');
      }

      const currrentPlayAreaName = selector('.musiclist>div:not(.hide)')
        .classList[0];
      if (currrentPlayAreaName === this.player.currentPlayarea) return;
      const s = this.player[this.player.currentPlayarea].playList.songsObjList.find(data => data.status === 'playing' || data.status === 'pause');
      if (s) {
        s.setStop();
      }
      this.player.currentPlayarea = selector(
        '.musiclist>div:not(.hide)'
      ).classList[0];
    });

    this.span3 = createEl('span', ['time']);
    this.span3.innerText = this.formatTime(this.length);

    this.li.appendChild(this.span1);
    this.li.appendChild(this.span2);
    this.li.appendChild(this.span3);
    new Drag(this.li, this, this.player).init();
  }

  formatTime(length) {
    return addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
  }

  setPlay() {
    if (this.status === 'playing') {
      this.setPause();
      return;
    }
    this.li.classList.add('playing');
    this.status = 'playing';
  }

  setStop() {
    if (this.status === 'stop') return;
    this.li.classList.remove('playing');
    this.status = 'stop';
  }

  setPause() {
    if (this.status === 'pause') {
      this.setPlay();
      return;
    }
    this.status = 'pause';
  }

  getEl() {
    return this.li;
  }
}
export default Song;
