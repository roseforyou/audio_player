import { createEl, addZero, selector } from '../method';

class Song {
  constructor(id, name, length, playListObj) {
    Object.assign(this, { id, name, length, playListObj });

    this.selected = false;

    this.status = 'ready'; // ready playing pause stop

    this.li = createEl('li');
    this.li.setAttribute('draggable', 'true');
    this.cb = createEl('input', [], 'checkbox');
    this.cb.addEventListener('click', () => {
      if (this.selected) {
        this.selected = false;
        this.li.classList.remove('on');
      } else {
        this.selected = true;
        this.li.classList.add('on');
      }
    });

    this.span1 = createEl('span', ['cb']);
    this.span1.appendChild(this.cb);

    this.span2 = createEl('span', ['name']);
    this.span2.innerHTML = this.name;
    this.span2.addEventListener('click', () => {
      if (this.selected) {
        this.selected = false;
        this.cb.checked = false;
        this.li.classList.remove('on');
      } else {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add('on');
      }
    });

    this.span2.addEventListener('dblclick', () => {
      if (this.status === 'playing') return;
      this.playListObj.playSong(this.id, this.name, this.length);
      if (!this.selected) {
        this.selected = true;
        this.cb.checked = true;
        this.li.classList.add('on');
      }

      const currrentPlayAreaName = selector('.musiclist>div:not(.hide)')
        .classList[0];
      if (currrentPlayAreaName === window.CURRENTPLAYAREA) return;
      const s = window.PLAYAREA[window.CURRENTPLAYAREA].playList.songsObjList.find(data => {
        return data.status === 'playing' || data.status === 'pause';
      });
      if (s) {
        s.setStop();
      }
      window.CURRENTPLAYAREA = selector(
        '.musiclist>div:not(.hide)'
      ).classList[0];
    });

    this.span3 = createEl('span', ['time']);
    this.span3.innerHTML = this.formatTime(this.length);

    this.li.appendChild(this.span1);
    this.li.appendChild(this.span2);
    this.li.appendChild(this.span3);

    // https://www.html5rocks.com/en/tutorials/dnd/basics/
    const handleDragStart = e => {
      this.dragFrom = true;
      // for prevent other drag tag which not song list
      e.dataTransfer.setData('abc', 'li');
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = e => {
      this.li.classList.add('over');
    };

    const handleDragLeave = e => {
      this.li.classList.remove('over');
    };

    const handleDragOver = e => {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }

      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    };

    const handleDrop = e => {
      if (!e.dataTransfer.getData('abc')) {
        this.clearDragClass('over');
        return;
      }
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }
      this.dragTo = true;

      const idxFrom = this.getDragIdx('dragFrom');
      const idxTo = this.getDragIdx('dragTo');

      if (idxFrom !== idxTo) {
        this.swapNodes(this.getDragLi(idxFrom), this.getDragLi(idxTo));
        this.swapArrayItem(idxFrom, idxTo);
      }
    };

    const handleDragEnd = () => {
      this.clearDragClass('over');
      const songs =
        window.PLAYAREA[selector('.playlist .list button.on').classList[0]]
          .playList.songsObjList;
      songs.find(data => {
        if (data.hasOwnProperty('dragTo')) delete data.dragTo;
      });
      songs.find(data => {
        if (data.hasOwnProperty('dragFrom')) delete data.dragFrom;
      });
    };
    this.li.addEventListener('dragstart', handleDragStart, false);
    this.li.addEventListener('dragenter', handleDragEnter, false);
    this.li.addEventListener('dragover', handleDragOver, false);
    this.li.addEventListener('dragleave', handleDragLeave, false);
    this.li.addEventListener('drop', handleDrop, false);
    this.li.addEventListener('dragend', handleDragEnd, false);
  }
  clearDragClass(cls) {
    window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.ul
      .querySelectorAll('li')
      .forEach(data => data.classList.remove(cls));
  }
  getDragLi(idx) {
    return window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.ul.querySelectorAll('li')[idx];
  }
  getDragIdx(prop) {
    return window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.songsObjList.findIndex(data => {
      return data[prop] === true;
    });
  }
  swapArrayItem(a, b) {
    const x =
      window.PLAYAREA[selector('.playlist .list button.on').classList[0]]
        .playList.songsObjList[b];
    window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.songsObjList[b] =
      window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.songsObjList[a];
    window.PLAYAREA[selector('.playlist .list button.on').classList[0]].playList.songsObjList[a] = x;
  }
  swapNodes(a, b) {
    const aparent = a.parentNode;
    const asibling = a.nextSibling === b ? a : a.nextSibling;
    b.parentNode.insertBefore(a, b);
    aparent.insertBefore(b, asibling);
  }

  formatTime(length) {
    return addZero(Math.floor(length / 60)) + ':' + addZero(length % 60);
  }

  setPlay() {
    if (this.status === 'playing') {
      this.setPause();
      return;
    }
    this.li.classList.add('playing');
    this.status = 'playing';
  }

  setStop() {
    if (this.status === 'stop') return;
    this.li.classList.remove('playing');
    this.status = 'stop';
  }

  setPause() {
    if (this.status === 'pause') {
      this.setPlay();
      return;
    }
    this.status = 'pause';
  }

  getEl() {
    return this.li;
  }
}
export default Song;
