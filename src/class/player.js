import { selector, selectorAll, getActiveListBtn, shuffleAudios } from '../method';
import { EVENT, STATUS } from '../data';
import Title from './title';
import Bar from './bar';
import PlayButtons from './playButtons';
import PlayArea from './playArea';
import PlayListBtns from './playListBtns';

class Player {
  constructor() {
    this.currentPlayarea = 'default';
    this.currentIdx = 0;
    this.container = selector('.container');

    this.timer = 0;
    this.interval = 50;
    this.songCurrentSeconds = 0;
    this.songTotalSeconds = 0;

    this.status = STATUS.READY;
  }

  init() {
    this.playButtons = this._createPlayButton();
    this.title = this._createTitle();
    this.bar = this._createBar();
    this._createPlayList();
    this._keyboardEvent();
    this.container.prepend(this.title.getEl(), this.playButtons.getEl(), this.bar.getEl());
  }

  _createPlayButton() {
    return new PlayButtons(this);
  }

  _createTitle() {
    return new Title();
  }

  _createBar() {
    return new Bar();
  }

  _createPlayList() {
    new PlayListBtns(shuffleAudios(), this, true).init();
  }

  createPlayArea(audios, isDefault) {
    return new PlayArea({ player: this, audios, isDefault });
  }

  _timerHandle() {
    this.timer = setInterval(() => {
      if (this.songCurrentSeconds <= 0) {
        clearInterval(this.timer);
        this.next();
        return;
      }
      this.songCurrentSeconds = this.songCurrentSeconds - this.interval / 1000;
      this.bar.setLength(this.songCurrentSeconds, this.songTotalSeconds);
      if (this.titleTriggerSecs > 0 && this.titleTriggerSecs % 1000 === 0) {
        this.title.setTime(this.songTotalSeconds - this.titleTriggerSecs / 1000);
      }
      this.titleTriggerSecs += this.interval;
    }, this.interval);
  }

  setCurrentPlayArea() {
    if (this.status === STATUS.STOP || this.status === STATUS.READY) {
      this.currentPlayarea = getActiveListBtn().classList[0];
    }
  }

  _beforePlayHandle() {
    const currentSongs = this[this.currentPlayarea].playList.songsObjList;
    const playingSongs = currentSongs.find(data => data.status === STATUS.PLAYING);
    if (playingSongs) {
      return;
    }
    const pauseSong = currentSongs.find(data => data.status === STATUS.PAUSE);

    if (pauseSong) {
      pauseSong.setPlay();
      this.playSong();
      return;
    }

    const firstCheckedSong = currentSongs.find(data => data.selected === true);

    if (firstCheckedSong) {
      firstCheckedSong.setPlay();
      const { name, seconds } = firstCheckedSong;
      this.playSong(name, seconds);
    } else {
      if (!currentSongs.length) return;
      currentSongs[0].setPlay();
      const { name, seconds } = currentSongs[0];
      this.playSong(name, seconds);
    }
  }

  play() {
    this.setCurrentPlayArea();
    this._beforePlayHandle();
  }

  pause() {
    const currentSongs = this[this.currentPlayarea].playList.songsObjList;
    const song = currentSongs.find(data => data.status === STATUS.PLAYING);
    if (currentSongs) {
      song.setPause();
      this.pauseSong();
    }
  }

  stop() {
    const currentSongs = this[this.currentPlayarea].playList.songsObjList;
    const song = currentSongs.find(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    if (song) {
      song.setStop();
      this.stopSong();
    }
  }

  prev() {
    this.setCurrentPlayArea();
    const currentSongs = this[this.currentPlayarea].playList.songsObjList;
    const idx = currentSongs.findIndex(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    let prevIdx = 0;
    if (idx > -1) {
      currentSongs[idx].setStop();
      this.stopSong();

      if (idx === 0) {
        prevIdx = currentSongs.length - 1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = currentSongs.length - 1;
    }

    if (!currentSongs.length) return;
    currentSongs[prevIdx].setPlay();
    const { name, seconds } = currentSongs[prevIdx];
    this.playSong(name, seconds);
  }

  next() {
    this.setCurrentPlayArea();
    const currentSongs = this[this.currentPlayarea].playList.songsObjList;
    const idx = currentSongs.findIndex(data => data.status === STATUS.PLAYING || data.status === STATUS.PAUSE);
    let nextIdx = 0;
    if (idx > -1) {
      currentSongs[idx].setStop();
      this.stopSong();

      if (idx === currentSongs.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }
    if (!currentSongs.length) return;
    currentSongs[nextIdx].setPlay();
    const { name, seconds } = currentSongs[nextIdx];
    this.playSong(name, seconds);
  }

  playSong(name, seconds) {
    if (this.status !== STATUS.PAUSE) {
      this.songCurrentSeconds = seconds;
      this.songTotalSeconds = seconds;
      this.titleTriggerSecs = 0;
    }

    if (name) {
      this.title.setName(name);
    }
    if (seconds) {
      this.title.setTime(seconds);
    }
    this.title.addAnimate();

    if (seconds) {
      this.bar.fullSize();
    }

    this.status = STATUS.PLAYING;
    this.playButtons.setPlayTxt();

    clearInterval(this.timer);
    this._timerHandle();
  }

  stopSong() {
    clearInterval(this.timer);
    this.songCurrentSeconds = 0;
    this.bar.zeroSize();

    this.title.setTime(0);
    this.title.removeAnimate();

    this.status = STATUS.STOP;
    this.playButtons.setPlayTxt();
  }

  pauseSong() {
    clearInterval(this.timer);
    this.title.removeAnimate();

    this.status = STATUS.PAUSE;
    this.playButtons.setPlayTxt();
  }

  delSelectedSongs(list, delArr) {
    list.songsObjList.forEach(data => {
      if ((data.status === STATUS.PLAYING || data.status === STATUS.PAUSE) && new Set(delArr).has(data.name)) {
        this.stopSong();
        data.setStop();
      }
    });

    selectorAll('li', list.ul).forEach(data => {
      if (delArr.includes(selector('.name', data).innerText)) {
        data.remove();
      }
    });

    list.songsObjList
      .filter(data => delArr.includes(data.name))
      .forEach(data => {
        list.songsObjList.splice(list.songsObjList.indexOf(data), 1);
      });
  }

  loopAllPlayList(isDelete) {
    const delSongName = this['default'].playList.songsObjList
      .filter(data => data.selected === true)
      .map(data => data.name);
    let containedListName = [];

    if (isDelete) {
      for (const key of Object.keys(this)) {
        if (key.indexOf('default') > -1) {
          this.delSelectedSongs(this[key].playList, delSongName);
        }
      }
    } else {
      for (const key of Object.keys(this)) {
        if (key.indexOf('default') > -1 && key.length > 'default'.length) {
          if (
            this[key].playList.songsObjList.find(data => {
              if (delSongName.includes(data.name)) {
                return data;
              }
            })
          ) {
            containedListName.push(key);
          }
        }
      }
      let msg = `Are you sure delete [${delSongName.join(', ')}]?`;
      if (containedListName.length) {
        containedListName = containedListName.map(data => selector('.playlist .' + data).innerText);
        msg += `\nPlay List: [${containedListName.join(
          ', '
        )}] also contains, will deleted!`;
      }

      if (confirm(msg)) {
        this.loopAllPlayList(true);
      }
    }
  }

  _keyboardEvent() {
    window.onkeyup = e => {
      const key = e.which || e.keyCode;
      if (key === EVENT.Space) {
        if (this.status === STATUS.PLAYING) {
          this.pause();
        } else {
          this.play();
        }
      }
      if (key === EVENT.ArrowUp) {
        this.prev();
      }
      if (key === EVENT.ArrowDown) {
        this.next();
      }
    };
  }
}

export default Player;
