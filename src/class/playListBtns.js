
import { createEl, selector, selectorAll, getActiveListBtn } from '../method';
import Drag from './drag';
import { EVENT } from '../data';

class PlayListBtns {
  constructor(songs, player, isDefault = false) {
    Object.assign(this, { songs, player, isDefault });

    this.musicList = selector('.musiclist');
    this.btnList = selector('.playlist .list');
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
    if (this.isDefault) {
      this.player[this.player.currentPlayarea] = this.player.createPlayArea(this.songs, true);
      this.musicList.appendChild(this.player[this.player.currentPlayarea].getEl());
    } else {
      ++this.player.currentIdx;
      const newSongs = this.songs.map(({ name, seconds }) => ({ name, seconds }));
      this.player['default' + this.player.currentIdx] = this.player.createPlayArea(newSongs);
      this.musicList.appendChild(this.player['default' + this.player.currentIdx].getEl());
    }
  }

  _createPlayListBtn() {
    if (this.isDefault) {
      this.newBtn = createEl('button', ['default', 'on']);
      this.newBtn.innerText = 'Music List';

      this.btnContainer = createEl('div');
      this.btnContainer.appendChild(this.newBtn);
      this.btnList.appendChild(this.btnContainer);

      this.delBtn = createEl('button');
      this.delBtn.innerText = 'Delete';
      this.delBtn.addEventListener('click', () => {
        this._delPlayList();
      });

      this.delContainer = createEl('div', ['op', 'hide']);
      this.delContainer.appendChild(this.delBtn);
      selector('.playlist').appendChild(this.delContainer);
    } else {
      this.newBtn = createEl('button', ['default' + this.player.currentIdx]);
      this.newBtn.innerText = 'New List' + this.player.currentIdx;

      this.btnContainer = createEl('div');
      this.btnContainer.setAttribute('draggable', true);
      this.btnContainer.appendChild(this.newBtn);

      this.inputContainer = createEl('span', ['hide']);
      this.modifyInput = createEl('input', [], 'text');

      this.inputContainer.appendChild(this.modifyInput);
      this.btnContainer.appendChild(this.inputContainer);

      this.newBtn.addEventListener('dblclick', () => {
        this._dblclickChangeName();
      });

      this.modifyInput.addEventListener('blur', () => {
        this._cancelInput();
      });

      this.modifyInput.addEventListener('keypress', e => {
        this._changePlayListBtnName(e);
      });

      this.btnList.appendChild(this.btnContainer);
      new Drag(this.btnContainer).init();
    }

    this.newBtn.addEventListener('click', () => {
      this._switchPlayArea();
    });
  }

  _delPlayList() {
    if (confirm('Are you sure delete current play list?!')) {
      getActiveListBtn().remove();
      this.player.stop();
      this.currentPlayarea = 'default';
      const btn = selector('.playlist .list button.on');
      delete this[btn.classList[0]];
      btn.parentNode.remove();

      selector('.playlist .list .default').click();
    }
  }

  _switchPlayArea() {
    if (!this.newBtn.classList.contains('on')) {
      const onBtn = selector('.playlist .list button.on');
      if (onBtn) {
        onBtn.classList.remove('on');
        getActiveListBtn().classList.add('hide');
      }

      this.newBtn.classList.add('on');
      selector('.musiclist>.' + this.newBtn.classList[0]).classList.remove('hide');

      if (this.newBtn.classList[0] === 'default') {
        selector('.playlist .op').classList.add('hide');
      } else {
        selector('.playlist .op').classList.remove('hide');
      }
    }
  }

  _cancelInput() {
    this.inputContainer.classList.add('hide');
    this.modifyInput.value = '';
  }

  _dblclickChangeName() {
    this.inputContainer.classList.remove('hide');
    this.modifyInput.focus();
  }

  _changePlayListBtnName(e) {
    const key = e.which || e.keyCode;
    if (key === EVENT.Enter) {
      let isHasSameName = false;
      const newPlayListName = this.modifyInput.value.trim();
      Array.from(selectorAll('.playlist .list button')).find(data => {
        if (data.innerText === newPlayListName) {
          isHasSameName = true;
        }
      });
      if (isHasSameName) {
        alert('There is a same name play list!');
        this.modifyInput.value = '';
      } else {
        if (newPlayListName) {
          this.newBtn.innerText = newPlayListName;
        }
        this.modifyInput.blur();
        this.modifyInput.value = '';
      }
    }
  }
};

export default PlayListBtns;
