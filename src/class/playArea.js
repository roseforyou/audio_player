import { createEl, addZero, selector } from "../method";
import PlayList from "./playList";

class PlayArea {
  constructor(AUDIOS, isDefault) {
    this.playAreaDiv = createEl("div");
    this.btnsDIV = createEl("div", ["buttons", "listbuttons"]);
    if (isDefault) {
      this.playAreaDiv.classList.add("default");
      this.addListBTN = createEl("button");
      this.addListBTN.innerHTML = "Add play list";
      this.addListBTN.addEventListener("click", () => {
        this.playList.addPlayList();
      });
    } else {
      this.playAreaDiv.classList.add("default" + window.CURRENTIDX);
    }
    this.sortBTN = createEl("button");
    this.sortBTN.innerHTML = "Sort";
    this.sortBTN.addEventListener("click", () => {
      this.playList.sort();
    });
    this.randomBTN = createEl("button");
    this.randomBTN.innerHTML = "Random";
    this.randomBTN.addEventListener("click", () => {
      this.playList.random();
    });
    this.deleteBTN = createEl("button");
    this.deleteBTN.innerHTML = "Delete";
    this.deleteBTN.addEventListener("click", () => {
      this.playList.delete();
    });
    if (isDefault) {
      this.btnsDIV.append(this.addListBTN);
    }
    this.btnsDIV.append(this.sortBTN, this.randomBTN, this.deleteBTN);
    this.playAreaDiv.appendChild(this.btnsDIV);

    this.playList = new PlayList(AUDIOS);
    this.playAreaDiv.appendChild(this.playList.getEl());
    this.hide();
  }

  show() {
    this.playAreaDiv.classList.remove("hide");
  }

  hide() {
    this.playAreaDiv.classList.add("hide");
  }

  getEl() {
    return this.playAreaDiv;
  }
}

export default PlayArea;
