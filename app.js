import {
  BOARD_SIZE,
  EMPTY_CELL,
  createBoard as createEmptyBoard,
  findWinningLine,
  isBoardFull,
} from "./game-core.js";

const boardElement = document.querySelector("#board");
const statusElement = document.querySelector("#game-status");
const moveCountElement = document.querySelector("#move-count");
const turnStoneElement = document.querySelector("#turn-stone");
const blackPlayerElement = document.querySelector("#black-player");
const whitePlayerElement = document.querySelector("#white-player");
const undoButton = document.querySelector("#undo-button");
const restartButton = document.querySelector("#restart-button");

const cells = [];
let game = createGame();

function createGame() {
  return {
    board: createEmptyBoard(),
    currentPlayer: "black",
    moves: [],
    winner: null,
    draw: false,
    winningLine: [],
  };
}

function playerName(player) {
  return player === "black" ? "黑棋" : "白棋";
}

function cellLabel(row, column, player) {
  const location = `第 ${row + 1} 行，第 ${column + 1} 列`;
  return player ? `${location}，${playerName(player)}` : `${location}，空位`;
}

function createBoard() {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowElement = document.createElement("div");
    rowElement.className = "board-row";

    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const button = document.createElement("button");
      button.className = "intersection";
      button.type = "button";
      button.dataset.row = String(row);
      button.dataset.column = String(column);
      button.setAttribute("aria-label", cellLabel(row, column, EMPTY_CELL));
      button.addEventListener("click", () => playAt(row, column));

      cells[row] ??= [];
      cells[row][column] = button;
      rowElement.append(button);
    }

    boardElement.append(rowElement);
  }
}

function playAt(row, column) {
  if (game.winner || game.draw || game.board[row][column] !== EMPTY_CELL) {
    return;
  }

  const player = game.currentPlayer;
  game.board[row][column] = player;
  game.moves.push({ row, column, player });

  const winningLine = findWinningLine(game.board, row, column, player);
  if (winningLine) {
    game.winner = player;
    game.winningLine = winningLine;
  } else if (isBoardFull(game.board)) {
    game.draw = true;
  } else {
    game.currentPlayer = player === "black" ? "white" : "black";
  }

  render();
}

function undoMove() {
  const move = game.moves.pop();
  if (!move) {
    return;
  }

  game.board[move.row][move.column] = EMPTY_CELL;
  game.currentPlayer = move.player;
  game.winner = null;
  game.draw = false;
  game.winningLine = [];
  render();
  cells[move.row][move.column].focus();
}

function restartGame() {
  game = createGame();
  render();
  cells[7][7].focus();
}

function render() {
  const lastMove = game.moves.at(-1);
  const winningCells = new Set(
    game.winningLine.map(({ row, column }) => `${row},${column}`),
  );

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const button = cells[row][column];
      const player = game.board[row][column];
      const isLastMove = lastMove?.row === row && lastMove?.column === column;

      button.classList.toggle("occupied", Boolean(player));
      button.classList.toggle("last-move", isLastMove);
      button.classList.toggle("winning", winningCells.has(`${row},${column}`));
      button.setAttribute("aria-label", cellLabel(row, column, player));
      button.replaceChildren();

      if (player) {
        const stone = document.createElement("span");
        stone.className = `stone ${player}`;
        stone.setAttribute("aria-hidden", "true");
        button.append(stone);
      }
    }
  }

  const gameFinished = Boolean(game.winner || game.draw);
  const currentPlayer = playerName(game.currentPlayer);

  if (game.winner) {
    statusElement.textContent = `${playerName(game.winner)}获胜！连成五子。`;
  } else if (game.draw) {
    statusElement.textContent = "平局，棋盘已下满。";
  } else if (game.moves.length === 0) {
    statusElement.textContent = "黑棋先手，请落子。";
  } else {
    statusElement.textContent = `${currentPlayer}回合，请落子。`;
  }

  moveCountElement.textContent = game.moves.length === 0
    ? "等待开局"
    : `已落子 ${game.moves.length} 手`;
  turnStoneElement.className = `turn-stone ${game.currentPlayer}`;
  blackPlayerElement.classList.toggle("is-active", !gameFinished && game.currentPlayer === "black");
  whitePlayerElement.classList.toggle("is-active", !gameFinished && game.currentPlayer === "white");
  undoButton.disabled = game.moves.length === 0;
}

undoButton.addEventListener("click", undoMove);
restartButton.addEventListener("click", restartGame);

createBoard();
render();
