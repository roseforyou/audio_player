import { createEl, selector, selectorAll } from '../method';
import Song from './song';
import PlayArea from './playArea';

class PlayList {
  constructor(songsList) {
    const sl = JSON.parse(JSON.stringify(songsList));
    Object.assign(this, { sl });

    this.ul = createEl('ul');

    this.songsObjList = this.sl.map(data => {
      const s = new Song(data.id, data.name, data.length, this);
      this.ul.appendChild(s.getEl());
      return s;
    });
  }

  playSong(id, name, length) {
    const s = this.songsObjList.find(data => {
      return data.status === 'playing';
    });
    if (s) {
      s.setStop();
    }

    this.songsObjList
      .find(data => {
        return data.id === id;
      })
      .setPlay();
    window.PLAYAREA.playSong(id, name, length);
  }

  moveChildNode(newChildIdx, oldChildIdx) {
    this.ul.insertBefore(
      this.ul.childNodes[newChildIdx],
      this.ul.childNodes[oldChildIdx]
    );
    if (newChildIdx === this.songsObjList.length - 1) {
      this.ul.appendChild(this.ul.childNodes[oldChildIdx + 1]);
    } else {
      this.ul.insertBefore(
        this.ul.childNodes[oldChildIdx + 1],
        this.ul.childNodes[newChildIdx + 1]
      );
    }
  }

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

      if (i < j) {
        this.moveChildNode(j, i);
      } else if (i > j) {
        this.moveChildNode(i, j);
      }
    }
  }

  sortHandle(sort, nameA, nameB) {
    if (sort === 'asc') {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    } else {
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
    }

    return 0;
  }

  sort() {
    if (this.ul.classList.contains('asc')) {
      this.songsObjList.sort((a, b) => {
        return this.sortHandle(
          'desc',
          a.name.toUpperCase(),
          b.name.toUpperCase()
        );
      });

      [...this.ul.childNodes]
        .sort((a, b) => {
          return this.sortHandle(
            'desc',
            a.querySelector('.name').innerText.toUpperCase(),
            b.querySelector('.name').innerText.toUpperCase()
          );
        })
        .map(node => this.ul.appendChild(node));

      this.ul.classList.remove('asc');
      this.ul.classList.add('desc');
    } else {
      this.songsObjList.sort((a, b) => {
        return this.sortHandle(
          'asc',
          a.name.toUpperCase(),
          b.name.toUpperCase()
        );
      });

      [...this.ul.childNodes]
        .sort((a, b) => {
          return this.sortHandle(
            'asc',
            a.querySelector('.name').innerText.toUpperCase(),
            b.querySelector('.name').innerText.toUpperCase()
          );
        })
        .map(node => this.ul.appendChild(node));

      this.ul.classList.remove('desc');
      this.ul.classList.add('asc');
    }
  }

  delete() {
    if (
      typeof this.songsObjList.find(data => {
        return data.selected === true;
      }) === 'undefined'
    ) {
      alert('Please select which you want to delete!');
    } else {
      if (selector('.musiclist>div:not(.hide)').classList.contains('default')) {
        window.loopAllPlayList(false);
      } else {
        const delSongName = this.songsObjList
          .filter(data => {
            return data.selected === true;
          })
          .map(data => {
            return data.name;
          });
        if (confirm(`Are you sure delete [${delSongName.join(',')}]?`)) {
          window.delSelectedSongs(this, delSongName);
        }
      }
    }
  }

  _play(songs) {
    if (
      songs.find(data => {
        return data.status === 'playing';
      })
    ) { return; }

    const pauseSong = songs.find(data => {
      return data.status === 'pause';
    });
    if (pauseSong) {
      pauseSong.setPlay();
      window.PLAYAREA.playSong();
      return;
    }

    const firstCheckedSong = songs.find(data => {
      return data.selected === true;
    });

    if (firstCheckedSong) {
      firstCheckedSong.setPlay();
      const { id, name, length } = firstCheckedSong;
      window.PLAYAREA.playSong(id, name, length);
    } else {
      if (songs.length === 0) return;
      songs[0].setPlay();
      const { id, name, length } = songs[0];
      window.PLAYAREA.playSong(id, name, length);
    }
  }

  play() {
    const currrentPlayAreaName = selector('.musiclist>div:not(.hide)')
      .classList[0];
    if (currrentPlayAreaName === window.PLAYAREA.currentPlayarea) {
      this._play(this.songsObjList);
    } else {
      // window.PLAYAREA.currentPlayarea under song is all 'stop' or 'ready' will play new switch list song.
      const findPlayingSongs = window.PLAYAREA[window.PLAYAREA.currentPlayarea].playList.songsObjList.find(data => {
        return data.status === 'playing' || data.status === 'pause';
      });
      if (findPlayingSongs) {
        // if have playing song, play old play area's song.

        this._play(
          window.PLAYAREA[window.PLAYAREA.currentPlayarea].playList.songsObjList
        );
      } else {
        // if not have playing song, play new switch list song.

        window.PLAYAREA.currentPlayarea = selector(
          '.musiclist>div:not(.hide)'
        ).classList[0];

        this._play(
          window.PLAYAREA[window.PLAYAREA.currentPlayarea].playList.songsObjList
        );
      }
    }
  }
  pause() {
    const song = this.songsObjList.find(data => {
      return data.status === 'playing';
    });
    if (typeof song === 'undefined') return;
    song.setPause();
    window.PLAYAREA.pauseSong();
  }
  stop() {
    const song = this.songsObjList.find(data => {
      return data.status === 'playing' || data.status === 'pause';
    });
    if (song) {
      song.setStop();
      window.PLAYAREA.stopSong();
    }
  }
  prev() {
    const idx = this.songsObjList.findIndex(data => {
      return data.status === 'playing' || data.status === 'pause';
    });
    let prevIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      window.PLAYAREA.stopSong();

      if (idx === 0) {
        prevIdx = this.songsObjList.length - 1;
      } else {
        prevIdx = idx - 1;
      }
    } else {
      prevIdx = this.songsObjList.length - 1;
    }

    if (this.songsObjList.length === 0) return;
    this.songsObjList[prevIdx].setPlay();
    const { id, name, length } = this.songsObjList[prevIdx];
    window.PLAYAREA.playSong(id, name, length);
  }
  next() {
    const idx = this.songsObjList.findIndex(data => {
      return data.status === 'playing' || data.status === 'pause';
    });
    let nextIdx = 0;
    if (idx > -1) {
      this.songsObjList[idx].setStop();
      window.PLAYAREA.stopSong();

      if (idx === this.songsObjList.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
    } else {
      nextIdx = 0;
    }
    if (this.songsObjList.length === 0) return;
    this.songsObjList[nextIdx].setPlay();
    const { id, name, length } = this.songsObjList[nextIdx];
    window.PLAYAREA.playSong(id, name, length);
  }

  addPlayList() {
    const songs = this.songsObjList.filter(data => {
      return data.selected === true;
    });
    if (songs.length) {
      const currentPlayAreaCount = ++window.PLAYAREA.currentIdx;
      const newSongs = songs.map(data => {
        const { id, name, length } = data;
        return { id, name, length };
      });
      window.PLAYAREA['default' + currentPlayAreaCount] = new PlayArea({
        AUDIOS: newSongs,
        isDefault: false,
        index: currentPlayAreaCount,
      });
      selector('.musiclist').appendChild(
        window.PLAYAREA['default' + currentPlayAreaCount].getEl()
      );
      const newBtn = createEl('button', ['default' + currentPlayAreaCount]);
      newBtn.innerText = 'New List' + currentPlayAreaCount;

      const btnDiv = createEl('div');
      btnDiv.setAttribute('draggable', true);
      btnDiv.appendChild(newBtn);

      const span = createEl('span', ['hide']);
      const input = createEl('input', [], 'text');

      span.appendChild(input);
      btnDiv.appendChild(span);

      newBtn.addEventListener('dblclick', () => {
        span.classList.remove('hide');
        input.focus();
      });

      input.addEventListener('blur', () => {
        span.classList.add('hide');
        input.value = '';
      });

      input.addEventListener('keypress', e => {
        const key = e.which || e.keyCode;
        if (key === 13) {
          let isHasSameName = false;
          Array.prototype.find.call(
            selectorAll('.playlist .list button'),
            data => {
              if (data.innerText === input.value.trim()) {
                isHasSameName = true;
              }
            }
          );
          if (isHasSameName) {
            alert('There is a same name play list!');
            input.value = '';
          } else {
            newBtn.innerText = input.value.trim();
            input.blur();
            input.value = '';
          }
        }
      });

      selector('.playlist .list').appendChild(btnDiv);
      // https://www.html5rocks.com/en/tutorials/dnd/basics/
      const handleDragStart = e => {
        btnDiv.setAttribute('dragFrom', true);
        e.dataTransfer.setData('tag', 'button');
        e.dataTransfer.effectAllowed = 'move';
      };

      const handleDragEnter = e => {
        btnDiv.classList.add('over');
      };

      const handleDragLeave = e => {
        btnDiv.classList.remove('over');
      };

      const handleDragOver = e => {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
        return false;
      };

      const handleDrop = e => {
        if (!e.dataTransfer.getData('tag')) {
          this.clearDragClass('over');
          return;
        }
        if (e.stopPropagation) {
          e.stopPropagation(); // Stops some browsers from redirecting.
        }
        btnDiv.setAttribute('dragTo', true);

        const idxFrom = this.getDragIdx('dragFrom');
        const idxTo = this.getDragIdx('dragTo');

        if (idxFrom !== idxTo) {
          this.swapNodes(this.getDragBtn(idxFrom), this.getDragBtn(idxTo));
        }
      };

      const handleDragEnd = () => {
        this.clearDragClass('over');
        this.clearDragAttribute();
      };
      btnDiv.addEventListener('dragstart', handleDragStart, false);
      btnDiv.addEventListener('dragenter', handleDragEnter, false);
      btnDiv.addEventListener('dragover', handleDragOver, false);
      btnDiv.addEventListener('dragleave', handleDragLeave, false);
      btnDiv.addEventListener('drop', handleDrop, false);
      btnDiv.addEventListener('dragend', handleDragEnd, false);
    } else {
      alert('Please select which you like song.');
    }
  }
  clearDragAttribute() {
    Array.prototype.forEach.call(selectorAll('.playlist .list>div'), data => {
      data.removeAttribute('dragFrom');
      data.removeAttribute('dragTo');
    });
  }
  clearDragClass(cls) {
    Array.prototype.forEach.call(selectorAll('.playlist .list>div'), data =>
      data.classList.remove(cls)
    );
  }
  getDragBtn(idx) {
    return selectorAll('.playlist .list>div')[idx];
  }
  getDragIdx(attr) {
    return Array.prototype.findIndex.call(
      selectorAll('.playlist .list>div'),
      data => {
        return data.getAttribute(attr);
      }
    );
  }
  swapNodes(a, b) {
    const aparent = a.parentNode;
    const asibling = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
  }

  getEl() {
    return this.ul;
  }
}

export default PlayList;
