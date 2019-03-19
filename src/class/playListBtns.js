
import { createEl, selector, selectorAll } from '../method';
import PlayArea from './playArea';
import Drag from './drag';
import { EVENT } from '../data';

class PlayListBtns {
  constructor(songs, player) {
    Object.assign(this, { songs, player });
  }

  init() {
    if (this.songs.length) {
      this._createPlayArea();
      this._createPlayListBtn();
    } else {
      alert('Please select which you favourite songs.');
    }
  }

  _createPlayArea() {
    const newSongs = this.songs.map(({ id, name, length }) => { return { id, name, length }; });
    this.player['default' + (++this.player.currentIdx)] = new PlayArea({
      player: this.player,
      AUDIOS: newSongs,
      isDefault: false,
      index: this.player.currentIdx,
    });
    selector('.musiclist').appendChild(
      this.player['default' + this.player.currentIdx].getEl()
    );
  }

  _createPlayListBtn() {
    const newBtn = createEl('button', ['default' + this.player.currentIdx]);
    newBtn.innerText = 'New List' + this.player.currentIdx;

    const btnContainer = createEl('div');
    btnContainer.setAttribute('draggable', true);
    btnContainer.appendChild(newBtn);

    const inputContainer = createEl('span', ['hide']);
    const modifyInput = createEl('input', [], 'text');

    inputContainer.appendChild(modifyInput);
    btnContainer.appendChild(inputContainer);

    newBtn.addEventListener('dblclick', () => {
      inputContainer.classList.remove('hide');
      modifyInput.focus();
    });

    modifyInput.addEventListener('blur', () => {
      inputContainer.classList.add('hide');
      modifyInput.value = '';
    });

    modifyInput.addEventListener('keypress', e => {
      this._changePlayListBtnName(newBtn, e);
    });

    selector('.playlist .list').appendChild(btnContainer);
    new Drag(btnContainer).init();
  }

  _changePlayListBtnName(newBtn, e) {
    const key = e.which || e.keyCode;
    if (key === EVENT.Enter) {
      let isHasSameName = false;
      const modifyInput = e.target;
      const newPlayListName = modifyInput.value.trim();
      Array.from(selectorAll('.playlist .list button')).find(data => {
        if (data.innerText === newPlayListName) {
          isHasSameName = true;
        }
      });
      if (isHasSameName) {
        alert('There is a same name play list!');
        modifyInput.value = '';
      } else {
        if (newPlayListName) {
          newBtn.innerText = newPlayListName;
        }
        modifyInput.blur();
        modifyInput.value = '';
      }
    }
  }
};

export default PlayListBtns;
