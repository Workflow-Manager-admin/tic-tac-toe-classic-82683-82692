import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Main Tic Tac Toe App with 2-player mode, grid display, turn indicator, win/draw messaging, and restart.
 */
// PUBLIC_INTERFACE
function App() {
  // Game state: 3x3 array, 'X' | 'O' | null
  const [board, setBoard] = useState(Array(9).fill(null));
  // true if X's turn, false if O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // null | 'X' | 'O' | 'Draw'
  const [status, setStatus] = useState("playing");

  // Reset game
  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setStatus("playing");
  }

  // Returns winner: 'X', 'O', or null
  // PUBLIC_INTERFACE
  function calculateWinner(b) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b2, c] = line;
      if (
        b[a] &&
        b[a] === b[b2] &&
        b[a] === b[c]
      ) {
        return b[a];
      }
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function isBoardFull(b) {
    return b.every((square) => square);
  }

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || status !== "playing") return; // Prevent move
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // Status hook - detect winner or draw
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) setStatus(winner);
    else if (isBoardFull(board)) setStatus("draw");
    else setStatus("playing");
  }, [board]);

  // Styling: custom palette via CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--ttt-primary', "#1976d2");
    document.documentElement.style.setProperty('--ttt-secondary', "#424242");
    document.documentElement.style.setProperty('--ttt-accent', "#ff9800");
    document.documentElement.style.setProperty('--ttt-bg', "#fff");
    document.documentElement.style.setProperty('--ttt-border', "#e0e0e0");
    document.documentElement.style.setProperty('--ttt-tile-shadow', "rgba(25,118,210,0.12)");
    document.documentElement.style.setProperty('--ttt-tile-x', "#1976d2");
    document.documentElement.style.setProperty('--ttt-tile-o', "#ff9800");
    document.documentElement.style.setProperty('--ttt-msg-win', "#1976d2");
    document.documentElement.style.setProperty('--ttt-msg-draw', "#424242");
  }, []);

  // Get display status message
  let message = "";
  if (status === "playing") {
    message = `Current turn: ${xIsNext ? "X" : "O"}`;
  } else if (status === "draw") {
    message = "It's a draw!";
  } else if (status === "X" || status === "O") {
    message = `Player ${status} wins!`;
  }

  return (
    <div className="ttt-root">
      <h1 className="ttt-title">Tic Tac Toe</h1>
      <div className="ttt-board-wrap">
        <Board squares={board} onClick={handleClick} winLine={
          status !== "playing" && status !== "draw" ? getWinningLine(board) : null
        } />
      </div>
      <div
        className={
          status === "X" || status === "O"
            ? "ttt-status ttt-win"
            : status === "draw"
            ? "ttt-status ttt-draw"
            : "ttt-status"
        }
        data-testid="status-message"
      >
        {message}
      </div>
      <button className="ttt-btn" onClick={handleRestart}>
        Restart Game
      </button>
      <footer className="ttt-footer">
        <small>
          Classic 2-Player &middot; React Minimalist &middot; By KAVIA
        </small>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winLine }) {
  // 3x3 grid, each cell is Square
  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map((row) => (
        <div className="ttt-row" key={row} role="row">
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                value={squares[idx]}
                onClick={() => onClick(idx)}
                key={idx}
                highlight={winLine && winLine.includes(idx)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={
        "ttt-square" +
        (highlight ? " ttt-highlight" : "") +
        (value === "X" ? " ttt-x" : value === "O" ? " ttt-o" : "")
      }
      onClick={onClick}
      aria-label={value ? `Tile ${value}` : "Empty tile"}
      tabIndex="0"
      type="button"
      data-testid="square"
    >
      {value}
    </button>
  );
}

// Find winning line, returns array of indexes if win, null otherwise
// PUBLIC_INTERFACE
function getWinningLine(b) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b2, c] = line;
    if (
      b[a] &&
      b[a] === b[b2] &&
      b[a] === b[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;
