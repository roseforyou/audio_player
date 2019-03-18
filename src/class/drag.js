import { selector, selectorAll, swapNodes } from '../method';
class Drag {
  constructor(dragEl, song, player) {
    Object.assign(this, { dragEl, song, player });
  }

  init() {
    // https://www.html5rocks.com/en/tutorials/dnd/basics/
    const handleDragStart = e => {
      if (this.song) {
        this.song.dragFrom = true;
        e.dataTransfer.setData('abc', 'li');
      } else {
        this.dragEl.setAttribute('dragFrom', true);
        e.dataTransfer.setData('tag', 'button');
      }
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = e => {
      this.dragEl.classList.add('over');
    };

    const handleDragLeave = e => {
      this.dragEl.classList.remove('over');
    };

    const handleDragOver = e => {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }

      e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
      return false;
    };

    const handleDrop = e => {
      if (this.song) {
        if (!e.dataTransfer.getData('abc')) {
          this.clearDragClass('over');
          return;
        }
      } else {
        if (!e.dataTransfer.getData('tag')) {
          this.clearDragClass('over');
          return;
        }
      }

      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      if (this.song) {
        this.song.dragTo = true;
      } else {
        this.dragEl.setAttribute('dragTo', true);
      }

      const idxFrom = this.getDragIdx('dragFrom');
      const idxTo = this.getDragIdx('dragTo');

      if (idxFrom !== idxTo) {
        swapNodes(this.getDragEl(idxFrom), this.getDragEl(idxTo));
        if (this.song) {
          this.swapArrayItem(idxFrom, idxTo);
        }
      }
    };

    const handleDragEnd = () => {
      this.clearDragClass('over');
      this.clearDragAttribute();
    };
    this.dragEl.addEventListener('dragstart', handleDragStart, false);
    this.dragEl.addEventListener('dragenter', handleDragEnter, false);
    this.dragEl.addEventListener('dragover', handleDragOver, false);
    this.dragEl.addEventListener('dragleave', handleDragLeave, false);
    this.dragEl.addEventListener('drop', handleDrop, false);
    this.dragEl.addEventListener('dragend', handleDragEnd, false);
  }

  clearDragAttribute() {
    if (this.song) {
      const songs = this.getCurrentPlayList().songsObjList;
      songs.find(data => {
        if (data.hasOwnProperty('dragTo')) delete data.dragTo;
      });
      songs.find(data => {
        if (data.hasOwnProperty('dragFrom')) delete data.dragFrom;
      });
    } else {
      Array.from(selectorAll('.playlist .list>div')).forEach(data => {
        data.removeAttribute('dragFrom');
        data.removeAttribute('dragTo');
      });
    }
  }

  clearDragClass(cls) {
    if (this.song) {
      selectorAll('li', this.getCurrentPlayList().ul).forEach(data => data.classList.remove(cls));
    } else {
      Array.from(selectorAll('.playlist .list>div')).forEach(data => data.classList.remove(cls));
    }
  }

  getDragEl(idx) {
    if (this.song) {
      return selectorAll('li', this.getCurrentPlayList().ul)[idx];
    } else {
      return selectorAll('.playlist .list>div')[idx];
    }
  }

  getDragIdx(attr) {
    if (this.song) {
      return this.getCurrentPlayList().songsObjList.findIndex(data => data[attr] === true);
    } else {
      return Array.from(selectorAll('.playlist .list>div')).findIndex(data => data.getAttribute(attr));
    }
  }

  swapArrayItem(a, b) {
    const playlist = this.getCurrentPlayList();
    const temp = playlist.songsObjList[b];
    playlist.songsObjList[b] = playlist.songsObjList[a];
    playlist.songsObjList[a] = temp;
  }

  getCurrentPlayList() {
    return this.player[selector('.playlist .list button.on').classList[0]].playList;
  }
};

export default Drag;
