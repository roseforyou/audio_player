function shuffleArray(array) {
  let newArrr = JSON.parse(JSON.stringify(array));
  for (let i = newArrr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = newArrr[i];
    newArrr[i] = newArrr[j];
    newArrr[j] = temp;
  }
  return newArrr;
}

function createEl(label, cls, type) {
  let el = document.createElement(label);
  if (cls && cls.length) el.classList.add(...cls);
  if (type) el.type = type;
  return el;
}

function addZero(str) {
  return str >= 10 ? str : "0" + str;
}

function selector(key) {
  return document.querySelector(key);
}

function selectorAll(key) {
  return document.querySelectorAll(key);
}

export { shuffleArray, createEl, addZero, selector, selectorAll };
