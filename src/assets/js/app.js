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

  // const calcAreaShape = function(size) {
  //   if (size > columns && size > rows && size % 2 === 0) {
  //     return 'double';
  //   }

  //   if (size % 2 === 0 && size > 2) {
  //     return 'square';
  //   }

  //   if (size > columns && size <= rows) {
  //     return 'verticalLine';
  //   }

  //   if (size <= columns) {
  //     return 'horizontalLine';
  //   }

  //   return 'dot';
  // };

  const findEmptySquare = function(area) {
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
  };

  const findEmptyDouble = function(area) {
    console.log('double', area.length);
  };

  const findEmptyHorizontalLine = function(area) {
    const possibleChoices = [];
    const lineLength = area.length;
    const colIndexes = [];

    for (let i = 0; i < lineLength; i++) {
      colIndexes.push(i);
    }

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

    // console.log('choice', choice);
    // const calcResult = areaMap[index].indexOf('.') === -1;

    // if (calcResult) {
    //   findPlaceInMapForArea(area);
    // } else {
    //   area.items.forEach(function(areaItem, areaIndex) {
    //     areaMap[index][areaIndex] = areaItem;
    //   });
    // }

    // console.log('findEmptyHorizontalLine', map);
  };

  const findEmptyVerticalLine = function(area, index) {
    const calcResult = areaMap.map(function(mapItem) {
      return mapItem[index] === '.';
    });

    if (calcResult.indexOf(false) === -1) {
      areaMap.forEach(function(mapItem, mapIndex) {
        area.items.forEach(function(a, areaIndex) {
          mapItem[index] = a;
        });
      });
    } else {
      findPlaceInMapForArea(area);
    }

    // console.log('findEmptyVerticalLine', map);
  };

  const findEmptyPlaceForDot = function(area) {
    const possibleChoices = [];

    areaMap.forEach(function(row, rowIndex) {
      row.forEach(function(col, colIndex) {
        if (col === '.') {
          possibleChoices.push({ rowIndex, colIndex });
        }
      });
    });

    const choice = possibleChoices[getRandomMax(possibleChoices.length)];

    areaMap[choice.rowIndex][choice.colIndex] = area.items[0];
  };

  const findPlaceInMapForArea = function(area) {
    const areaShape = randomShape();

    switch (areaShape) {
      case 'square':
        area.length % 2 === 0 && area.length > 2
          ? findEmptySquare(area)
          : findPlaceInMapForArea(area);
        break;
      case 'horizontalLine':
        area.length <= columns && area.length > 1
          ? findEmptyHorizontalLine(area)
          : findPlaceInMapForArea(area);
        break;
      default:
        area.length === 1 && findEmptyPlaceForDot(area);
    }
    // const rowIndex = getRandomMax(rows);
    // console.log(map, area);
  };

  const findPlace = function(sortedFields) {
    findPlaceInMapForArea(sortedFields[sortedFields.length - 1]);
    sortedFields.pop();
    if (sortedFields.length > 0) {
      findPlace(sortedFields);
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
    areaMap = [];
    addGridAreaNameToBoxes();
    const sortedFields = countAreas(groupByArea(getAreasWithDuplicates())).sort(
      sortAreasByLength
    );

    for (let rowIn = 0; rowIn < rows; rowIn++) {
      const row = [];
      for (let colIn = 0; colIn < columns; colIn++) {
        row.push('.');
      }

      areaMap.push(row);
    }

    findPlace(sortedFields);

    console.log(convertAreaMapToString());

    // console.log(areaMap);
    // areas
    //   .map(function(arr) {
    //     return arr.join(' ');
    //   })
    //   .forEach(function(line, index) {
    //     a += `"${line}"`;
    //   });

    console.log(areaMap);
    canvas.style.gridTemplateAreas = convertAreaMapToString();
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
