import { selector, selectorAll } from './method';
import { AUDIOS } from './data';
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

    selector('.playlist .list').addEventListener('click', e => {
      const currentEl = e.target;
      if (currentEl.nodeName === 'BUTTON') {
        if (currentEl.classList.contains('on')) {

        } else {
          const onBtn = selector('.playlist .list button.on');
          if (onBtn) {
            onBtn.classList.remove('on');
            selector('.musiclist>div:not(.hide)').classList.add('hide');
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

    selector('.playlist .op').addEventListener('click', e => {
      const currentEl = e.target;
      if (currentEl.nodeName === 'BUTTON') {
        if (confirm('Are you sure delete current play list?!')) {
          selector('.musiclist >div:not(.hide)').remove();
          this.currentPlayarea = 'default';
          const btn = selector('.playlist .list button.on');
          this[btn.classList[0]].playList.stop();
          delete this[btn.classList[0]];
          btn.parentNode.remove();

          selector('.playlist .list .default').click();
        }
      }
    });

    window.onkeyup = e => {
      const key = e.which || e.keyCode;
      if (key === 32) {
        selectorAll('.container>.buttons button')[1].click();
      }
      if (key === 38) {
        this[this.currentPlayarea].playList.prev();
      }
      if (key === 40) {
        this[this.currentPlayarea].playList.next();
      }
    };
  }

  playSong(id, name, length) {
    if (name) {
      this.title.setName(name);
    }
    if (length) {
      this.title.setLength(length);
    }
    this.title.play();

    if (length) {
      this.bar.setLength(length);
    }
    this.bar.play();
    this.playButtons.setPlayStatus('playing');
  }

  stopSong() {
    this.title.setLength(0);
    this.title.stop();

    this.bar.stop();
    this.playButtons.setPlayStatus('stop');
  }

  pauseSong() {
    this.title.pause();
    this.bar.pause();
    this.playButtons.setPlayStatus('pause');
  }

  delSelectedSongs(list, delArr) {
    list.songsObjList.forEach(data => {
      if (
        (data.status === 'playing' || data.status === 'pause') &&
        new Set(delArr).has(data.name)
      ) {
        this.stopSong();
        data.setStop();
      }
    });

    list.ul.querySelectorAll('li').forEach(data => {
      if (delArr.includes(data.querySelector('.name').innerText)) {
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
}
const player = new Player();
player.init();
