import { AUDIOS } from './data';

function shuffleArray(array) {
  const newArrr = [...array];
  newArrr.forEach((v, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArrr[i];
    newArrr[i] = newArrr[j];
    newArrr[j] = temp;
  });
  return newArrr;
}

function createEl(label, cls, type) {
  const el = document.createElement(label);
  if (cls && cls.length) el.classList.add(...cls);
  if (type) el.type = type;
  return el;
}

function addZero(str) {
  return str >= 10 ? str : '0' + str;
}

function selector(key, parentNode) {
  if (parentNode) {
    return parentNode.querySelector(key);
  } else {
    return document.querySelector(key);
  }
}

function selectorAll(key, parentNode) {
  if (parentNode) {
    return parentNode.querySelectorAll(key);
  } else {
    return document.querySelectorAll(key);
  }
}

function swapNodes(a, b) {
  const aparent = a.parentNode;
  const asibling = a.nextSibling === b ? a : a.nextSibling;
  b.parentNode.insertBefore(a, b);
  aparent.insertBefore(b, asibling);
}

function getActiveListBtn() {
  return selector('.musiclist>div:not(.hide)');
}

function _getRandomNum(range) {
  return Math.round(Math.random() * range * 10 + 10);
}

function shuffleAudios() {
  AUDIOS.forEach(data => {
    data.seconds = _getRandomNum(6);
  });
  return shuffleArray(AUDIOS);
}

export { shuffleArray, createEl, addZero, selector, selectorAll, swapNodes, getActiveListBtn, shuffleAudios };
