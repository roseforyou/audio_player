import { createEl } from '../method';
import { STATUS } from '../data';

class PlayButtons {
  constructor(player) {
    Object.assign(this, { player });

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
      const playList = this.player[this.player.currentPlayarea].playList;
      if (name === 'Prev') {
        playList.prev();
      } else if (name === 'Play') {
        if (this.player.status === STATUS.PLAYING) {
          playList.pause();
        } else {
          playList.play();
        }
      } else if (name === 'Stop') {
        playList.stop();
      } else if (name === 'Next') {
        playList.next();
      }
    });
    return btn;
  }

  setPlayTxt() {
    if (this.player.status === STATUS.PLAYING) {
      this.playBtn.innerText = 'Pause';
      this.playBtn.classList.add('on');
    } else if (this.player.status === STATUS.PAUSE || this.player.status === STATUS.STOP) {
      this.playBtn.innerText = 'Play';
      this.playBtn.classList.remove('on');
    }
  }

  getEl() {
    return this.buttonsDiv;
  }
}

export default PlayButtons;
