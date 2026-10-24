export const BOARD_SIZE = 15;
export const WIN_LENGTH = 5;
export const EMPTY_CELL = null;

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

export function createBoard(size = BOARD_SIZE) {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("Board size must be a positive integer.");
  }

  return Array.from({ length: size }, () => Array(size).fill(EMPTY_CELL));
}

export function findWinningLine(board, row, column, player, winLength = WIN_LENGTH) {
  if (
    !Array.isArray(board) ||
    !Number.isInteger(winLength) ||
    winLength < 1 ||
    board[row]?.[column] !== player
  ) {
    return null;
  }

  for (const [rowStep, columnStep] of DIRECTIONS) {
    const line = [[row, column]];

    for (const sign of [-1, 1]) {
      let nextRow = row + rowStep * sign;
      let nextColumn = column + columnStep * sign;
      const stones = [];

      while (board[nextRow]?.[nextColumn] === player) {
        stones.push([nextRow, nextColumn]);
        nextRow += rowStep * sign;
        nextColumn += columnStep * sign;
      }

      if (sign < 0) {
        line.unshift(...stones);
      } else {
        line.push(...stones);
      }
    }

    if (line.length >= winLength) {
      return line.map(([winningRow, winningColumn]) => ({
        row: winningRow,
        column: winningColumn,
      }));
    }
  }

  return null;
}

export function isBoardFull(board) {
  return (
    Array.isArray(board) &&
    board.length > 0 &&
    board.every((row) => Array.isArray(row) && row.length > 0 && row.every((cell) => cell !== EMPTY_CELL))
  );
}
