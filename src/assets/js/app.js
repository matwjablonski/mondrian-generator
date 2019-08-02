'use strict';

(function() {
  const canvas = document.getElementById('canvas');
  const columnsInput = document.getElementById('columns');
  const rowsInput = document.getElementById('rows');
  const availableColors = 8;

  const getRandomMax = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  let rows = 5;
  let columns = 3;

  let lastRandom = getRandomMax(Math.ceil(rows * columns * 0.8));
  let boxes = rows * columns - lastRandom;

  const randomAmountOfColorizedBoxes = function() {
    const percentage = Math.ceil(Math.random() * 100);
    const boxesToColorize = Math.ceil((boxes * percentage) / 100);
    for (let i = 0; i < boxesToColorize; i++) {
      const boxIndex = getRandomMax(boxesToColorize);
      const colorIndex = getRandomMax(availableColors);
      canvas.children[boxIndex].classList.add(`color-${colorIndex}`);
    }
  };

  const clearCanvas = function() {
    canvas.innerHTML = '';
  };

  const createBoxes = function() {
    clearCanvas();
    boxes = rows * columns - lastRandom;

    for (let i = 0; i < boxes; i++) {
      const box = document.createElement('div');
      canvas.appendChild(box);
    }
  };

  const createNewPainting = function() {
    createBoxes();
    randomAmountOfColorizedBoxes();
  };

  columnsInput.addEventListener('change', function(e) {
    columns = parseInt(e.target.value, 10);
    canvas.style.gridTemplateColumns = `repeat(${e.target.value}, 1fr)`;
    createNewPainting();
  });

  rowsInput.addEventListener('change', function(e) {
    rows = parseInt(e.target.value, 10);
    canvas.style.gridTemplateRows = `repeat(${e.target.value}, 1fr)`;
    createNewPainting();
  });

  createNewPainting();
})();
