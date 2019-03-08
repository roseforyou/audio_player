import { createEl } from '../method';

class PlayButtons {
  constructor(prev, play, stop, next) {
    this.prev = prev;
    this.play = play;
    this.stop = stop;
    this.next = next;

    this.prevDiv = createEl('button');
    this.prevDiv.innerHTML = 'Prev';
    this.prevDiv.addEventListener('click', () => {
      window.PLAYAREA[window.CURRENTPLAYAREA].playList.prev();
    });

    this.playDiv = createEl('button');
    this.playDiv.innerHTML = 'Play';
    this.playDiv.addEventListener('click', () => {
      if (this.status === 'playing') {
        window.PLAYAREA[window.CURRENTPLAYAREA].playList.pause();
      } else {
        window.PLAYAREA[window.CURRENTPLAYAREA].playList.play();
      }
    });

    this.stopDiv = createEl('button');
    this.stopDiv.innerHTML = 'Stop';
    this.stopDiv.addEventListener('click', () => {
      window.PLAYAREA[window.CURRENTPLAYAREA].playList.stop();
    });

    this.nextDiv = createEl('button');
    this.nextDiv.innerHTML = 'Next';
    this.nextDiv.addEventListener('click', () => {
      window.PLAYAREA[window.CURRENTPLAYAREA].playList.next();
    });

    this.buttonsDiv = createEl('div', ['buttons']);
    this.buttonsDiv.append(
      this.prevDiv,
      this.playDiv,
      this.stopDiv,
      this.nextDiv
    );

    this.status = '';
  }

  setPlayTxt() {
    if (this.status === 'playing') {
      this.playDiv.innerHTML = 'Pause';
      this.playDiv.classList.add('on');
    } else if (this.status === 'pause' || this.status === 'stop') {
      this.playDiv.innerHTML = 'Play';
      this.playDiv.classList.remove('on');
    }
  }

  setPlayStatus(status) {
    this.status = status;
    this.setPlayTxt();
  }

  getEl() {
    return this.buttonsDiv;
  }
}

export default PlayButtons;
