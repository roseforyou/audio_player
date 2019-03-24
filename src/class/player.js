import { selector, selectorAll, getActiveListBtn, shuffleAudios } from '../method';
import { EVENT, STATUS } from '../data';
import Title from './title';
import Bar from './bar';
import PlayButtons from './playButtons';
import PlayArea from './playArea';
import PlayListBtns from './playListBtns';

class Player {
  constructor() {
    this.currentIdx = 0;
    this.currentPlayarea = 'default';
    this.currentSong = null;
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
    if (this.status === STATUS.PLAYING) {
      return;
    }

    if (this.status === STATUS.PAUSE) {
      this.currentSong.setPlay();
      this.playSong();
      return;
    }

    const currentSongs = this._getCurrentPlayAreaSongs();
    const firstCheckedSong = currentSongs.find(data => data.selected === true);

    if (firstCheckedSong) {
      this.playSong(firstCheckedSong);
    } else {
      if (!currentSongs.length) return;
      this.playSong(currentSongs[0]);
    }
  }

  play() {
    this.setCurrentPlayArea();
    this._beforePlayHandle();
  }

  pause() {
    clearInterval(this.timer);
    this.title.removeAnimate();

    this.status = STATUS.PAUSE;
    this.playButtons.setPlayTxt();
  }

  stop() {
    if (this.currentSong) {
      this.currentSong.setStop();
    }
    this.stopSong();
  }

  prev() {
    this.setCurrentPlayArea();
    const currentSongs = this._getCurrentPlayAreaSongs();
    if (!currentSongs.length) return;

    if (this.currentSong) {
      let prevIdx = 0;
      const idx = currentSongs.findIndex(data => data.id === this.currentSong.id);
      if (idx) {
        prevIdx = idx - 1;
      } else {
        prevIdx = currentSongs.length - 1;
      }
      this.stop();
      this.playSong(currentSongs[prevIdx]);
    } else {
      this.playSong(currentSongs[currentSongs.length - 1]);
    }
  }

  next() {
    this.setCurrentPlayArea();
    const currentSongs = this._getCurrentPlayAreaSongs();
    if (!currentSongs.length) return;

    if (this.currentSong) {
      let nextIdx = 0;
      const idx = currentSongs.findIndex(data => data.id === this.currentSong.id);
      if (idx === currentSongs.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
      this.stop();
      this.playSong(currentSongs[nextIdx]);
    } else {
      this.playSong(currentSongs[0]);
    }
  }

  playSong(song = {}) {
    const { name = '', seconds = 0 } = song;
    if (this.status !== STATUS.PAUSE) {
      this.songCurrentSeconds = seconds;
      this.songTotalSeconds = seconds;
      this.titleTriggerSecs = 0;
      this.currentSong = song;
      this.currentSong.setPlay();
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

    this.currentSong = null;
    this.status = STATUS.STOP;
    this.playButtons.setPlayTxt();
  }

  delSelectedSongs(playArea, delArr) {
    const songs = this[playArea].playList.songsObjList;

    selectorAll('li', selector(playArea + '>ul')).forEach(data => {
      if (delArr.includes(selector('.name', data).innerText)) {
        data.remove();
      }
    });

    songs.filter(data => delArr.includes(data.name))
      .forEach(data => {
        if (this.currentPlayarea === playArea && (this.status === STATUS.PLAYING || this.status === STATUS.PAUSE) && new Set(delArr).has(this.currentSong.name)) {
          this.stop();
        }
        songs.splice(songs.indexOf(data), 1);
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
          this.delSelectedSongs(key, delSongName);
        }
      }
    } else {
      for (const key of Object.keys(this)) {
        if (/default\d+/.test(key)) {
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
        msg += `\nPlay List: [${containedListName.join(', ')}] also contains, will deleted!`;
      }

      if (confirm(msg)) {
        this.loopAllPlayList(true);
      }
    }
  }

  _keyboardEvent() {
    document.onkeyup = e => {
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

  _getCurrentPlayAreaSongs() {
    return this[this.currentPlayarea].playList.songsObjList;
  }
}

export default Player;
