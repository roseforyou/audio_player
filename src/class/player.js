import { selector, selectorAll, getActiveListBtn, shuffleAudios } from '../method';
import { AUDIOS, EVENT, STATUS } from '../data';
import Title from './title';
import Bar from './bar';
import PlayButtons from './playButtons';
import PlayArea from './playArea';

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
    this.playButtons = new PlayButtons(this);
    this.title = new Title();
    this.bar = new Bar();

    this.container.prepend(this.playButtons.getEl());
    this.container.prepend(this.bar.getEl());
    this.container.prepend(this.title.getEl());

    this[this.currentPlayarea] = new PlayArea({ player: this, AUDIOS: shuffleAudios(AUDIOS), isDefault: true });
    selector('.musiclist').appendChild(this[this.currentPlayarea].getEl());
    this.container.style.display = 'block';

    this.playListBtnEvent();
    this.playListDelEvent();
    this.keyboardEvent();
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

  _setCurrentPlayArea() {
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
      const { id, name, length } = firstCheckedSong;
      this.playSong(id, name, length);
    } else {
      if (!currentSongs.length) return;
      currentSongs[0].setPlay();
      const { id, name, length } = currentSongs[0];
      this.playSong(id, name, length);
    }
  }

  play() {
    this._setCurrentPlayArea();
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
    this._setCurrentPlayArea();
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
    const { id, name, length } = currentSongs[prevIdx];
    this.playSong(id, name, length);
  }

  next() {
    this._setCurrentPlayArea();
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
    const { id, name, length } = currentSongs[nextIdx];
    this.playSong(id, name, length);
  }

  playSong(id, name, seconds) {
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

  playListBtnEvent() {
    selector('.playlist .list').addEventListener('click', e => {
      const currentEl = e.target;
      if (currentEl.nodeName === 'BUTTON') {
        if (currentEl.classList.contains('on')) {

        } else {
          const onBtn = selector('.playlist .list button.on');
          if (onBtn) {
            onBtn.classList.remove('on');
            getActiveListBtn().classList.add('hide');
          }
          currentEl.classList.add('on');

          selector('.musiclist>.' + currentEl.classList[0]).classList.remove(
            'hide'
          );

          if (currentEl.classList[0] === 'default') {
            selector('.playlist .op').classList.add('hide');
          } else {
            selector('.playlist .op').classList.remove('hide');
          }
        }
      }
    });
  }

  playListDelEvent() {
    selector('.playlist .op').addEventListener('click', e => {
      const currentEl = e.target;
      if (currentEl.nodeName === 'BUTTON') {
        if (confirm('Are you sure delete current play list?!')) {
          getActiveListBtn().remove();
          this.currentPlayarea = 'default';
          const btn = selector('.playlist .list button.on');
          this[btn.classList[0]].playList.stop();
          delete this[btn.classList[0]];
          btn.parentNode.remove();

          selector('.playlist .list .default').click();
        }
      }
    });
  }

  keyboardEvent() {
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
