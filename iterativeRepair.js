/*jslint node: true */
"use strict";
function iterativeRepair(size) {
  var solution = _repairLoop(size);
  render(solution);
}

function _repairLoop(size) {
  var numConflicts = Number.POSITIVE_INFINITY;
  var totalIterations = 0;
  var board;
  while (numConflicts > 0) {
    var iterations = 0;
    board = generateRandomBoard(size);
    while (iterations < 30) {
      for (var i = 0; i < board.length; i++) minimizeConflicts(board, i);
      numConflicts = totalConflicts(board);
      iterations += board.length;
      render(board);
      if (numConflicts === 0) break;
    }
    totalIterations += iterations;
    console.log("RESEED!!!")
  }
  return board;
}

function generateRandomBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) board.push(i);
  return fisherYatesShuffle(board);
}

function minimizeConflicts(board, col) {
  var minConflicts = Number.POSITIVE_INFINITY;
  var minRow;
  for (var row = 0; row < board.length; row++) {
    board[col] = row;
    var conflicts = totalConflicts(board);
    if (conflicts < minConflicts) {
      minConflicts = conflicts;
      minRow = row;
    }
  }
  board[col] = minRow;
}

function totalConflicts(board) {
  return diagConflictCount(board) + rowConflictCount(board);
}

function diagConflictCount(board) { // assumes all unique rows
  var downDiags = [];
  while (downDiags.length < board.length * 2) downDiags.push(false);
  var upDiags = downDiags.slice();
  var numConflicts = 0;
  for (var i = 0; i < board.length; i++) {
    var downDiag = i - board[i] + (board.length - 1);
    if (!downDiags[downDiag]) {
      downDiags[downDiag] = true;
    } else {
      numConflicts++;
    }

    var upDiag = i + board[i];
    if (!upDiags[upDiag]) {
      upDiags[upDiag] = true;
    } else {
      numConflicts++;
    }
  }
  return numConflicts;
}

function rowConflictCount(board) {
  var row = [];
  var numConflicts = 0;
  while (row.length < board.length) row.push(false);
  for (var i = 0; i < board.length; i++) {
    if (row[board[i]]) {
      numConflicts++;
    } else {
      row[board[i]] = true;
    }
  }
  return numConflicts;
}

function pointConflictCount(board, x, y) {
  var conflicts = 0;
  for (var i = 0; i < board.length; i++) {
    // columns always unique!
    // look at rows
    if (board[i] === x && i !== x) conflicts++; // double check this logic... this is so that a thing doesn't conflict with itself
    // i = column
    // board[i] = row

    // look at diags
    if (x - y === board[i] - i || x + y === board[i] + i) conflicts++;
  }
  return conflicts;
}

function fisherYatesShuffle(arr) {
  for (var i = 0; i < arr.length; i++) {
    var j = Math.floor(Math.random() * (arr.length - i) + i);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function render(board) {
  console.log(board);
  var rows = [];
  for (var i = 0; i < board.length; i++) {
    var row = [];
    for (var j = 0; j < board.length; j++) {
      row.push(board[i] === j ? "Q" : ".");
    }
    rows.push(row);
  }
  for (i = 0; i < rows.length; i++) {
    for (var k = 0; k < rows.length; k++) {
      var temp = rows[i][k];
      rows[i][k] = rows[k][i];
      rows[k][i] = temp;
    }
  }
  rows.forEach(function (row) { console.log(row.join(" ")); });
}
