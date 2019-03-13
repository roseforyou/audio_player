import { createEl } from '../method';
import PlayList from './playList';

class PlayArea {
  constructor({ AUDIOS, isDefault, index }) {
    Object.assign(this, { isDefault, index });

    this.playList = new PlayList(AUDIOS);
    this.playAreaDiv = createEl('div');
    this.btnsArea = createEl('div', ['buttons', 'listbuttons']);

    this._init();
  }

  _init() {
    this._playAreaDivRander();
    this._createBtnsList();
    this.hide();
  }

  _playAreaDivRander() {
    if (this.isDefault) {
      this.playAreaDiv.classList.add('default');
    } else {
      this.playAreaDiv.classList.add('default' + this.index);
    }

    this.playAreaDiv.appendChild(this.btnsArea);
    this.playAreaDiv.appendChild(this.playList.getEl());
  }

  _createBtnsList() {
    if (this.isDefault) {
      this.addListBTN = this._createBtn('Add play list', () => {
        this.playList.addPlayList();
      });
      this.btnsArea.append(this.addListBTN);
    }

    this.sortBTN = this._createBtn('Sort', () => {
      this.playList.sort();
    });
    this.randomBTN = this._createBtn('Random', () => {
      this.playList.random();
    });
    this.deleteBTN = this._createBtn('Delete', () => {
      this.playList.delete();
    });

    this.btnsArea.append(this.sortBTN, this.randomBTN, this.deleteBTN);
  }

  _createBtn(name, clkCallBack) {
    const btn = createEl('button');
    btn.innerText = name;
    btn.addEventListener('click', clkCallBack);
    return btn;
  }

  show() {
    this.playAreaDiv.classList.remove('hide');
  }

  hide() {
    this.playAreaDiv.classList.add('hide');
  }

  getEl() {
    return this.playAreaDiv;
  }
}

export default PlayArea;
