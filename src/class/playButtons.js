import { createEl } from '../method';
import { STATUS } from '../data';

class PlayButtons {
  constructor(player) {
    Object.assign(this, { player });

    this._init();
  }

  _init() {
    this.prevBtn = this._createBtn('Prev');
    this.playBtn = this._createBtn('Play');
    this.stopBtn = this._createBtn('Stop');
    this.nextBtn = this._createBtn('Next');

    this.buttonsDiv = createEl('div', ['buttons']);
    this.buttonsDiv.append(
      this.prevBtn,
      this.playBtn,
      this.stopBtn,
      this.nextBtn,
    );
  }

  _createBtn(name) {
    const btn = createEl('button');
    btn.innerText = name;
    btn.addEventListener('click', () => {
      if (name === 'Prev') {
        this.player.prev();
      } else if (name === 'Play') {
        if (this.player.status === STATUS.PLAYING) {
          this.player.pause();
        } else {
          this.player.play();
        }
      } else if (name === 'Stop') {
        this.player.stop();
      } else if (name === 'Next') {
        this.player.next();
      }
    });
    return btn;
  }

  setPlayTxt() {
    const status = this.player.status;
    if (status === STATUS.PLAYING) {
      this.playBtn.innerText = 'Pause';
      this.playBtn.classList.add('on');
    } else if (status === STATUS.PAUSE || status === STATUS.STOP) {
      this.playBtn.innerText = 'Play';
      this.playBtn.classList.remove('on');
    }
  }

  getEl() {
    return this.buttonsDiv;
  }
}

export default PlayButtons;
