import assert from "node:assert/strict";
import test from "node:test";
import { createBoard, findWinningLine, isBoardFull } from "../game-core.js";

function place(board, cells, player = "black") {
  for (const [row, column] of cells) {
    board[row][column] = player;
  }
}

test("creates an empty 15 by 15 board", () => {
  const board = createBoard();

  assert.equal(board.length, 15);
  assert.ok(board.every((row) => row.length === 15 && row.every((cell) => cell === null)));
});

test("finds horizontal and vertical five-in-a-row", () => {
  const horizontal = createBoard();
  place(horizontal, [[7, 3], [7, 4], [7, 5], [7, 6], [7, 7]]);
  assert.equal(findWinningLine(horizontal, 7, 5, "black").length, 5);

  const vertical = createBoard();
  place(vertical, [[2, 8], [3, 8], [4, 8], [5, 8], [6, 8]], "white");
  assert.equal(findWinningLine(vertical, 4, 8, "white").length, 5);
});

test("finds both diagonal directions", () => {
  const downRight = createBoard();
  place(downRight, [[3, 3], [4, 4], [5, 5], [6, 6], [7, 7]]);
  assert.equal(findWinningLine(downRight, 5, 5, "black").length, 5);

  const downLeft = createBoard();
  place(downLeft, [[3, 7], [4, 6], [5, 5], [6, 4], [7, 3]]);
  assert.equal(findWinningLine(downLeft, 5, 5, "black").length, 5);
});

test("does not join stones across an empty intersection", () => {
  const board = createBoard();
  place(board, [[7, 2], [7, 3], [7, 5], [7, 6], [7, 7]]);

  assert.equal(findWinningLine(board, 7, 7, "black"), null);
});

test("a run of six or more wins in the free-style rules", () => {
  const board = createBoard();
  place(board, [[6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7]]);

  assert.equal(findWinningLine(board, 6, 4, "black").length, 6);
});

test("detects a full board", () => {
  const board = createBoard(2);
  assert.equal(isBoardFull(board), false);
  board[0][0] = "black";
  board[0][1] = "white";
  board[1][0] = "white";
  board[1][1] = "black";
  assert.equal(isBoardFull(board), true);
});
