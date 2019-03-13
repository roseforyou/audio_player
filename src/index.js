import { selector, selectorAll } from './method';
import { AUDIOS } from './data';
import Title from './class/title';
import Bar from './class/bar';
import PlayButtons from './class/playButtons';
import PlayArea from './class/playArea';

window.PLAYAREA = {
  currentPlayarea: 'default',
  currentIdx: 0,
  playButtons: {},
  playSong: (id, name, length) => {
    if (name) window.PLAYAREA.title.setName(name);
    if (length) window.PLAYAREA.title.setLength(length);
    window.PLAYAREA.title.play();
    if (length) window.PLAYAREA.bar.setLength(length);
    window.PLAYAREA.bar.play();
    window.PLAYAREA.playButtons.setPlayStatus('playing');
  },
  title: new Title(),
  bar: new Bar(),
  stopSong: () => {
    window.PLAYAREA.title.setLength(0);
    window.PLAYAREA.title.stop();

    window.PLAYAREA.bar.stop();
    window.PLAYAREA.playButtons.setPlayStatus('stop');
  },
  pauseSong: () => {
    window.PLAYAREA.title.pause();
    window.PLAYAREA.bar.pause();
    window.PLAYAREA.playButtons.setPlayStatus('pause');
  }
};

AUDIOS.forEach(data => {
  Object.assign((data.length = Math.round(Math.random() * 6 * 10 + 10)), data);
});

// operate buttons [prev, play/pause, stop, next]
window.PLAYAREA.playButtons = new PlayButtons(window.PLAYAREA);
selector('.container').prepend(window.PLAYAREA.playButtons.getEl());

// music bar
selector('.container').prepend(window.PLAYAREA.bar.getEl());

// song title, time show area
selector('.container').prepend(window.PLAYAREA.title.getEl());

// song play list button event, and switch play area
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
// song play list delete event
selector('.playlist .op').addEventListener('click', e => {
  const currentEl = e.target;
  if (currentEl.nodeName === 'BUTTON') {
    if (confirm('Are you sure delete current play list?!')) {
      selector('.musiclist >div:not(.hide)').remove();
      window.PLAYAREA.currentPlayarea = 'default';
      const btn = selector('.playlist .list button.on');
      window.PLAYAREA[btn.classList[0]].playList.stop();
      delete window.PLAYAREA[btn.classList[0]];
      btn.parentNode.remove();

      selector('.playlist .list .default').click();
    }
  }
});
window.delSelectedSongs = (list, delArr) => {
  list.songsObjList.forEach(data => {
    if (
      (data.status === 'playing' || data.status === 'pause') &&
      new Set(delArr).has(data.name)
    ) {
      window.PLAYAREA.stopSong();
      data.setStop();
    }
  });

  list.ul.querySelectorAll('li').forEach(data => {
    if (delArr.includes(data.querySelector('.name').innerText)) {
      data.remove();
    }
  });

  list.songsObjList
    .filter(data => {
      return delArr.includes(data.name);
    })
    .forEach(data => {
      list.songsObjList.splice(list.songsObjList.indexOf(data), 1);
    });
};
window.loopAllPlayList = isDelete => {
  const delSongName = window.PLAYAREA['default'].playList.songsObjList
    .filter(data => {
      return data.selected === true;
    })
    .map(data => {
      return data.name;
    });
  let containedListName = [];

  if (isDelete) {
    for (const key of Object.keys(window.PLAYAREA)) {
      if (key.indexOf('default') > -1) {
        window.delSelectedSongs(window.PLAYAREA[key].playList, delSongName);
      }
    }
  } else {
    for (const key of Object.keys(window.PLAYAREA)) {
      if (key.indexOf('default') > -1 && key.length > 'default'.length) {
        if (
          window.PLAYAREA[key].playList.songsObjList.find(data => {
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
      containedListName = containedListName.map(data => {
        return selector('.playlist .' + data).innerText;
      });
      msg += `\nPlay List: [${containedListName.join(
        ', '
      )}] also contains, will deleted!`;
    }

    if (confirm(msg)) {
      window.loopAllPlayList(true);
    }
  }
};

window.PLAYAREA['default'] = new PlayArea({ AUDIOS, isDefault: true });
selector('.musiclist').appendChild(window.PLAYAREA.default.getEl());
window.PLAYAREA.default.playList.random();
window.PLAYAREA.default.show();
selector('.container').style.display = 'block';
//
window.onkeyup = e => {
  const key = e.which || e.keyCode;
  if (key === 32) {
    selectorAll('.container>.buttons button')[1].click();
  }
  if (key === 38) {
    window.PLAYAREA[window.PLAYAREA.currentPlayarea].playList.prev();
  }
  if (key === 40) {
    window.PLAYAREA[window.PLAYAREA.currentPlayarea].playList.next();
  }
};
