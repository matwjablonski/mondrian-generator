'use strict';

(function() {
  const canvas = document.getElementById('canvas');
  const columnsInput = document.getElementById('columns');
  const rowsInput = document.getElementById('rows');
  const availableColors = 8;
  const availableShapes = ['horizontalLine', 'verticalLine', 'square'];

  let areaMap = [];

  const getRandomMax = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  let rows = 5;
  let columns = 3;

  let lastRandom = getRandomMax(Math.ceil(rows * columns * 0.8));
  let boxes = rows * columns - lastRandom;

  let placeFound = true;

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
    prepareGridArea();
  };

  const getPossibleAreas = function() {
    const possibleAreas = [];
    for (let i = 0; i < boxes; i++) {
      possibleAreas.push(`area${i}`);
    }

    return possibleAreas;
  };

  const getAreasWithDuplicates = function() {
    const possibleAreas = getPossibleAreas();
    const duplicatesAreas = [];
    const howManyDuplicates = lastRandom > boxes ? boxes : lastRandom;

    for (let i = 0; i < lastRandom; i++) {
      duplicatesAreas.push(`area${getRandomMax(howManyDuplicates)}`);
    }

    return possibleAreas.concat(duplicatesAreas);
  };

  const createArrayFromNum = function(num) {
    const arr = [];

    for (let i = 0; i < num; i++) {
      arr.push(i);
    }

    return arr;
  };

  const groupByArea = function(areasArray) {
    return areasArray.reduce(function(acc, curr) {
      (acc[curr] = acc[curr] || []).push(curr);
      return acc;
    }, {});
  };

  const countAreas = function(groupedAreas) {
    const areas = [];
    for (let key in groupedAreas) {
      areas.push({
        items: groupedAreas[key],
        length: groupedAreas[key].length,
      });
    }

    return areas;
  };

  const sortAreasByLength = function(a, b) {
    return a.length > b.length ? 1 : -1;
  };

  const addGridAreaNameToBoxes = function() {
    for (let i = 0; i < boxes; i++) {
      canvas.children[i].style.gridArea = `area${i}`;
    }
  };

  const randomShape = function() {
    return availableShapes[getRandomMax(availableShapes.length)];
  };

  const findEmptySquare = function(area) {
    try {
      const possibleChoices = [];

      areaMap.forEach(function(row, rowIndex) {
        for (let i = 0; i < columns; i++) {
          if (rowIndex + 1 >= rows || i + 1 >= columns) {
            return;
          }
          if (
            row[i] === '.' &&
            row[i + 1] === '.' &&
            areaMap[rowIndex + 1][i] === '.' &&
            areaMap[rowIndex + 1][i + 1] === '.'
          ) {
            possibleChoices.push({
              firstLine: [rowIndex, i, i + 1],
              secondLine: [rowIndex + 1, i, i + 1],
            });
          }
        }
      });

      const choice = possibleChoices[getRandomMax(possibleChoices.length)];

      for (let key in choice) {
        const line = choice[key];
        areaMap[line[0]][line[1]] = area.items[0];
        areaMap[line[0]][line[2]] = area.items[0];
      }
      if (choice) {
        placeFound = true;
      }
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const findEmptyHorizontalLine = function(area) {
    try {
      const possibleChoices = [];
      const lineLength = area.length;
      const colIndexes = createArrayFromNum(lineLength);

      areaMap.forEach(function(row, rowIndex) {
        const testedLine = [];
        colIndexes.forEach(function(colIndex) {
          if (row[colIndex] === '.') {
            testedLine.push(colIndex);
          }
        });

        if (testedLine.length === lineLength) {
          possibleChoices.push({
            rowIndex,
            testedLine,
          });
        }
      });

      const choice = possibleChoices[getRandomMax(possibleChoices.length)];
      choice &&
        choice.testedLine.forEach(function(colIndex) {
          areaMap[choice.rowIndex][colIndex] = area.items[0];
        });
      if (choice) {
        placeFound = true;
      }
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const findEmptyVerticalLine = function(area) {
    try {
      const possibleChoices = [];
      const lineLength = area.length;
      const rowIndexes = createArrayFromNum(lineLength);
      const columnsArr = createArrayFromNum(columns);
      const regex = /^(\.+)$/;

      areaMap.forEach(function(row, rowIndex) {
        columnsArr.forEach(function(columnIndex) {
          const testedLine = [];
          rowIndexes.forEach(function(index) {
            testedLine.push(areaMap[index][columnIndex]);
          });
          if (regex.test(testedLine.join(''))) {
            possibleChoices.push({ rowIndex, columnIndex });
          }
        });
      });

      const choice = possibleChoices[getRandomMax(possibleChoices.length)];
      rowIndexes.forEach(function(rowIndex) {
        if (choice) {
          areaMap[rowIndex][choice.columnIndex] = area.items[0];
          placeFound = true;
        } else {
          placeFound = false;
        }
      });
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const findEmptyPlaceForDot = function(area) {
    try {
      const possibleChoices = [];

      areaMap.forEach(function(row, rowIndex) {
        row.forEach(function(col, colIndex) {
          if (col === '.') {
            possibleChoices.push({ rowIndex, colIndex });
          }
        });
      });

      const choice = possibleChoices[getRandomMax(possibleChoices.length)];
      if (choice) {
        placeFound = true;
      }
      areaMap[choice.rowIndex][choice.colIndex] = area.items[0];
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const findPlaceInMapForArea = function(area) {
    try {
      const areaShape = randomShape();
      placeFound = false;
      if (area.length % 2 === 0 && area.length > 2 && areaShape === 'square') {
        return findEmptySquare(area);
      }

      if (
        area.length <= columns &&
        area.length > 1 &&
        areaShape === 'horizontalLine'
      ) {
        return findEmptyHorizontalLine(area);
      }

      if (
        area.length > 1 &&
        area.length <= rows &&
        areaShape === 'verticalLine'
      ) {
        return findEmptyVerticalLine(area);
      }

      if (area.length === 1) {
        return findEmptyPlaceForDot(area);
      }

      return findPlaceInMapForArea(area);
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const findPlace = function(sortedFields) {
    try {
      findPlaceInMapForArea(sortedFields[sortedFields.length - 1]);
      if (placeFound) {
        sortedFields.pop();
      }
      if (sortedFields.length > 0) {
        findPlace(sortedFields);
      }
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
  };

  const convertAreaMapToString = function() {
    let string = '';

    areaMap.forEach(function(line, lineIndex) {
      string += `"${line.join(' ')}"\n`;
      if (lineIndex < areaMap.length) {
        string += ' ';
      }
    });

    return string;
  };

  const prepareGridArea = function() {
    try {
      areaMap = [];
      addGridAreaNameToBoxes();
      const sortedFields = countAreas(
        groupByArea(getAreasWithDuplicates())
      ).sort(sortAreasByLength);

      for (let rowIn = 0; rowIn < rows; rowIn++) {
        const row = [];
        for (let colIn = 0; colIn < columns; colIn++) {
          row.push('.');
        }

        areaMap.push(row);
      }

      findPlace(sortedFields);
      canvas.style.gridTemplateAreas = convertAreaMapToString();
    } catch (e) {
      createNewPainting();
      console.error('Error', e);
    }
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
