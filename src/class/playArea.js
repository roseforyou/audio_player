import { createEl } from '../method';
import PlayList from './playList';

class PlayArea {
  constructor({ player, audios, isDefault = false }) {
    Object.assign(this, { player, isDefault });

    this._init(audios);
  }

  _init(audios) {
    this.playList = new PlayList(audios, this.player);
    this.btnsArea = createEl('div', ['buttons', 'listbuttons']);
    this.playAreaDiv = createEl('div');

    this._createBtnsList();
    this._playAreaDivRander();
    if (!this.isDefault) this.hide();
  }

  _playAreaDivRander() {
    if (this.isDefault) {
      this.playAreaDiv.classList.add('default');
    } else {
      this.playAreaDiv.classList.add('default' + this.player.currentIdx);
    }

    this.playAreaDiv.append(this.btnsArea, this.playList.getEl());
  }

  _createBtnsList() {
    if (this.isDefault) {
      this.addListBTN = this._createBtn('Add play list', () => {
        this.playList.addPlayList();
      });
      this.btnsArea.appendChild(this.addListBTN);
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
