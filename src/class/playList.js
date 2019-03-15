import { createEl, selector, swapNodes } from '../method';
import PlayListBtns from './playListBtns';
import Song from './song';

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
    const s = this.songsObjList.find(data => data.status === 'playing');
    if (s) {
      s.setStop();
    }

    this.songsObjList
      .find(data => data.id === id)
      .setPlay();
    this.player.playSong(id, name, length);
  }

  // moveChildNode(newChildIdx, oldChildIdx) {
  //   const ul = this.ul;
  //   ul.insertBefore(
  //     ul.childNodes[newChildIdx],
  //     ul.childNodes[oldChildIdx]
  //   );
  //   // only for two nodes of params position switch, other nodes position not change.
  //   if (newChildIdx === this.songsObjList.length - 1) {
  //     ul.appendChild(ul.childNodes[oldChildIdx + 1]);
  //   } else {
  //     ul.insertBefore(
  //       ul.childNodes[oldChildIdx + 1],
  //       ul.childNodes[newChildIdx + 1]
  //     );
  //   }
  // }

  random() {
    this.ul.classList.remove('asc');
    this.ul.classList.remove('desc');
    for (let i = this.songsObjList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.songsObjList[i];
      this.songsObjList[i] = this.songsObjList[j];
      this.songsObjList[j] = temp;

      // this method is not useful
      // let ctempi = this.ul.childNodes[i].cloneNode(true);
      // let ctempj = this.ul.childNodes[j].cloneNode(true);
      // this.ul.replaceChild(ctempj, this.ul.childNodes[i]);
      // this.ul.replaceChild(ctempi, this.ul.childNodes[j]);

      // if (i < j) {
      //   this.moveChildNode(j, i);
      // } else if (i > j) {
      //   this.moveChildNode(i, j);
      // }
      if (i !== j) swapNodes(this.ul.childNodes[i], this.ul.childNodes[j]);
    }
  }

  // sortHandle(sort, nameA, nameB) {
  //   if (sort === 'asc') {
  //     if (nameA < nameB) {
  //       return -1;
  //     }
  //     if (nameA > nameB) {
  //       return 1;
  //     }
  //   } else {
  //     if (nameA > nameB) {
  //       return -1;
  //     }
  //     if (nameA < nameB) {
  //       return 1;
  //     }
  //   }
  //   return 0;
  // }

  sortHandle(isAsc, nameA, nameB) {
    return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }

  sort() {
    if (this.ul.classList.contains('asc')) {
      this.songsObjList.sort((a, b) => this.sortHandle(false, a.name.toUpperCase(), b.name.toUpperCase()));

      [...this.ul.childNodes]
        .sort((a, b) => this.sortHandle(false, a.querySelector('.name').innerText.toUpperCase(), b.querySelector('.name').innerText.toUpperCase()))
        .forEach(node => this.ul.appendChild(node));

      this.ul.classList.remove('asc');
      this.ul.classList.add('desc');
    } else {
      this.songsObjList.sort((a, b) => this.sortHandle(true, a.name.toUpperCase(), b.name.toUpperCase()));

      [...this.ul.childNodes]
        .sort((a, b) => this.sortHandle(true, a.querySelector('.name').innerText.toUpperCase(), b.querySelector('.name').innerText.toUpperCase()))
        .forEach(node => this.ul.appendChild(node));

      this.ul.classList.remove('desc');
      this.ul.classList.add('asc');
    }
  }

  delete() {
    if (!this.songsObjList.find(data => data.selected === true)) {
      alert('Please select which you want to delete!');
    } else {
      if (selector('.musiclist>div:not(.hide)').classList.contains('default')) {
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
    const playingSongs = songs.find(data => data.status === 'playing');
    if (playingSongs) {
      return;
    }

    const pauseSong = songs.find(data => data.status === 'pause');
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

  play() {
    const currrentPlayAreaName = selector('.musiclist>div:not(.hide)')
      .classList[0];
    if (currrentPlayAreaName === this.player.currentPlayarea) {
      this._play(this.songsObjList);
    } else {
      // this.player.currentPlayarea under song is all 'stop' or 'ready' will play new switch list song.
      const findPlayingSongs = this.player[this.player.currentPlayarea].playList.songsObjList.find(data => data.status === 'playing' || data.status === 'pause');
      if (findPlayingSongs) {
        // if have playing song, play old play area's song.
        this._play(
          this.player[this.player.currentPlayarea].playList.songsObjList
        );
      } else {
        // if not have playing song, play new switch list song.
        this.player.currentPlayarea = selector(
          '.musiclist>div:not(.hide)'
        ).classList[0];

        this._play(
          this.player[this.player.currentPlayarea].playList.songsObjList
        );
      }
    }
  }
  pause() {
    const song = this.songsObjList.find(data => data.status === 'playing');
    if (typeof song === 'undefined') return;
    song.setPause();
    this.player.pauseSong();
  }
  stop() {
    const song = this.songsObjList.find(data => data.status === 'playing' || data.status === 'pause');
    if (song) {
      song.setStop();
      this.player.stopSong();
    }
  }
  prev() {
    const idx = this.songsObjList.findIndex(data => data.status === 'playing' || data.status === 'pause');
    let prevIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      this.player.stopSong();

      if (idx === 0) {
        prevIdx = this.songsObjList.length - 1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = this.songsObjList.length - 1;
    }

    if (!this.songsObjList.length) return;
    this.songsObjList[prevIdx].setPlay();
    const { id, name, length } = this.songsObjList[prevIdx];
    this.player.playSong(id, name, length);
  }
  next() {
    const idx = this.songsObjList.findIndex(data => data.status === 'playing' || data.status === 'pause');
    let nextIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      this.player.stopSong();

      if (idx === this.songsObjList.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }
    if (!this.songsObjList.length) return;
    this.songsObjList[nextIdx].setPlay();
    const { id, name, length } = this.songsObjList[nextIdx];
    this.player.playSong(id, name, length);
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
