import { selector, selectorAll, getActiveListBtn } from './method';
import { AUDIOS, EVENT, STATUS } from './data';
import Title from './class/title';
import Bar from './class/bar';
import PlayButtons from './class/playButtons';
import PlayArea from './class/playArea';

class Player {
  constructor() {
    AUDIOS.forEach(data => {
      Object.assign((data.length = Math.round(Math.random() * 6 * 10 + 10)), data);
    });

    this.currentPlayarea = 'default';
    this.currentIdx = 0;
    this.container = selector('.container');
  }

  init() {
    this.timer = 0;
    this.interval = 50;
    this.songCurrentSeconds = 0;
    this.songTotalSeconds = 0;

    this.status = STATUS.READY;
    this.playButtons = new PlayButtons(this);
    this.title = new Title(this);
    this.bar = new Bar();

    this.container.prepend(this.playButtons.getEl());
    this.container.prepend(this.bar.getEl());
    this.container.prepend(this.title.getEl());

    this[this.currentPlayarea] = new PlayArea({ player: this, AUDIOS, isDefault: true });
    selector('.musiclist').appendChild(this[this.currentPlayarea].getEl());
    this[this.currentPlayarea].playList.random();
    this[this.currentPlayarea].show();
    this.container.style.display = 'block';

    this.playListBtnEvent();
    this.playListDelEvent();
    this.keyboardEvent();
  }

  playSong(id, name, seconds) {
    this.songCurrentSeconds = seconds;
    this.songTotalSeconds = seconds;

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

    let titleTrigger = 0;
    this.timer = setInterval(() => {
      if (this.songCurrentSeconds <= 0) {
        clearInterval(this.timer);
        return;
      }
      this.songCurrentSeconds = this.songCurrentSeconds - this.interval / 1000;
      this.bar.setLength(this.songCurrentSeconds, this.songTotalSeconds);
      if (titleTrigger > 0 && titleTrigger % 1000 === 0) {
        this.title.setTime(--seconds);
      }
      titleTrigger += this.interval;
    }, this.interval);

    this.status = STATUS.PLAYING;
    this.playButtons.setPlayTxt();
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
        selectorAll('.container>.buttons button')[1].click();
      }
      if (key === EVENT.ArrowUp) {
        this[this.currentPlayarea].playList.prev();
      }
      if (key === EVENT.ArrowDown) {
        this[this.currentPlayarea].playList.next();
      }
    };
  }
}
new Player().init();
