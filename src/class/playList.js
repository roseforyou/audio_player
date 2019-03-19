import { createEl, selector, swapNodes, getActiveListBtn } from '../method';
import PlayListBtns from './playListBtns';
import Song from './song';

class PlayList {
  constructor(songsList, player) {
    Object.assign(this, { sl: [...songsList], ul: createEl('ul'), songsObjList: [], player });

    this._createSongsList();
  }

  _createSongsList() {
    this.songsObjList = this.sl.map(({ id, name, length }) => {
      const song = new Song(id, name, length, this.player);
      this.ul.appendChild(song.getEl());
      return song;
    });
  }

  addPlayList() {
    const songs = this.songsObjList.filter(data => data.selected === true);
    new PlayListBtns(songs, this.player).init();
  }

  random() {
    this.ul.classList.remove('asc');
    this.ul.classList.remove('desc');

    this.songsObjList.forEach((v, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.songsObjList[i];
      this.songsObjList[i] = this.songsObjList[j];
      this.songsObjList[j] = temp;

      if (i !== j) swapNodes(this.ul.childNodes[i], this.ul.childNodes[j]);
    });
  }

  sortHandle(isAsc, nameA, nameB) {
    return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }

  sort() {
    if (this.ul.classList.contains('asc')) {
      this.songsObjList.sort((a, b) => this.sortHandle(false, a.name.toUpperCase(), b.name.toUpperCase()));

      [...this.ul.childNodes]
        .sort((a, b) => this.sortHandle(false, selector('.name', a).innerText.toUpperCase(), selector('.name', b).innerText.toUpperCase()))
        .forEach(node => this.ul.appendChild(node));

      this.ul.classList.remove('asc');
      this.ul.classList.add('desc');
    } else {
      this.songsObjList.sort((a, b) => this.sortHandle(true, a.name.toUpperCase(), b.name.toUpperCase()));

      [...this.ul.childNodes]
        .sort((a, b) => this.sortHandle(true, selector('.name', a).innerText.toUpperCase(), selector('.name', b).innerText.toUpperCase()))
        .forEach(node => this.ul.appendChild(node));

      this.ul.classList.remove('desc');
      this.ul.classList.add('asc');
    }
  }

  delete() {
    if (!this.songsObjList.find(data => data.selected === true)) {
      alert('Please select which you want to delete!');
    } else {
      if (getActiveListBtn().classList.contains('default')) {
        this.player.loopAllPlayList(false);
      } else {
        const delSongName = this.songsObjList
          .filter(data => data.selected === true)
          .map(data => data.name);
        if (confirm(`Are you sure delete [${delSongName.join(',')}]?`)) {
          this.player.delSelectedSongs(this, delSongName);
        }
      }
    }
  }

  getCurrentPlayList() {
    return this.player[this.player.currentPlayarea].playList.songsObjList;
  }

  getEl() {
    return this.ul;
  }
}

export default PlayList;
