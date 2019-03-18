import { createEl, selector, swapNodes, getActiveListBtn } from '../method';
import PlayListBtns from './playListBtns';
import Song from './song';
import { STATUS } from '../data';

class PlayList {
  constructor(player, songsList) {
    // old
    // const sl = JSON.parse(JSON.stringify(songsList));
    // use ES6
    const sl = [...songsList];
    Object.assign(this, { sl, player, ul: createEl('ul'), songsObjList: [] });

    this._createSongsList();
  }

  _createSongsList() {
    this.songsObjList = this.sl.map(({ id, name, length }) => {
      const song = new Song(id, name, length, this, this.player);
      this.ul.appendChild(song.getEl());
      return song;
    });
  }

  playSong(id, name, length) {
    const s = this.songsObjList.find(data => data.status === STATUS.PLAYING);
    if (s) {
      s.setStop();
    }

    this.songsObjList
      .find(data => data.id === id)
      .setPlay();
    this.player.playSong(id, name, length);
  }

  random() {
    this.ul.classList.remove('asc');
    this.ul.classList.remove('desc');
    for (let i = this.songsObjList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.songsObjList[i];
      this.songsObjList[i] = this.songsObjList[j];
      this.songsObjList[j] = temp;

      if (i !== j) swapNodes(this.ul.childNodes[i], this.ul.childNodes[j]);
    }
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

  _play(songs) {
    const playingSongs = songs.find(data => data.status === STATUS.PLAYING);
    if (playingSongs) {
      return;
    }

    const pauseSong = songs.find(data => data.status === STATUS.PAUSE);
    if (pauseSong) {
      pauseSong.setPlay();
      this.player.playSong();
      return;
    }

    const firstCheckedSong = songs.find(data => data.selected === true);

    if (firstCheckedSong) {
      firstCheckedSong.setPlay();
      const { id, name, length } = firstCheckedSong;
      this.player.playSong(id, name, length);
    } else {
      if (!songs.length) return;
      songs[0].setPlay();
      const { id, name, length } = songs[0];
      this.player.playSong(id, name, length);
    }
  }

  setCurrentPlayArea() {
    if (this.player.status === STATUS.STOP || this.player.status === STATUS.READY) {
      this.player.currentPlayarea = getActiveListBtn().classList[0];
    }
  }

  play() {
    this.setCurrentPlayArea();
    this._play(this.getCurrentPlayList());
  }

  pause() {
    const song = this.songsObjList.find(data => data.status === STATUS.PLAYING);
    if (typeof song === 'undefined') return;
    song.setPause();
    this.player.pauseSong();
  }

  stop() {
    const song = this.songsObjList.find(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    if (song) {
      song.setStop();
      this.player.stopSong();
    }
  }

  prev() {
    this.setCurrentPlayArea();
    const _songsList = this.getCurrentPlayList();
    const idx = _songsList.findIndex(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    let prevIdx = 0;
    if (idx > -1) {
      _songsList[idx].setStop();
      this.player.stopSong();

      if (idx === 0) {
        prevIdx = _songsList.length - 1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = _songsList.length - 1;
    }

    if (!_songsList.length) return;
    _songsList[prevIdx].setPlay();
    const { id, name, length } = _songsList[prevIdx];
    this.player.playSong(id, name, length);
  }

  next() {
    this.setCurrentPlayArea();
    const _songsList = this.getCurrentPlayList();
    const idx = _songsList.findIndex(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    let nextIdx = 0;
    if (idx > -1) {
      _songsList[idx].setStop();
      this.player.stopSong();

      if (idx === _songsList.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }
    if (!_songsList.length) return;
    _songsList[nextIdx].setPlay();
    const { id, name, length } = _songsList[nextIdx];
    this.player.playSong(id, name, length);
  }

  getCurrentPlayList() {
    return this.player[this.player.currentPlayarea].playList.songsObjList;
  }

  addPlayList() {
    const songs = this.songsObjList.filter(data => data.selected === true);
    new PlayListBtns(songs, this.player).init();
  }

  getEl() {
    return this.ul;
  }
}

export default PlayList;
