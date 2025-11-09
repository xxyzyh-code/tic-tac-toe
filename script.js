let board = Array(9).fill('');
let player = 'X';
let ai = 'O';
let gameOver = false;
let useMinimax = false;

const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const easyBtn = document.getElementById('easy');
const hardBtn = document.getElementById('hard');
const gameArea = document.getElementById('game');

// 模式選擇
easyBtn.addEventListener('click', () => {
  useMinimax = false;
  gameArea.style.display = 'block';
});

hardBtn.addEventListener('click', () => {
  useMinimax = true;
  gameArea.style.display = 'block';
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.dataset.index;
    if (board[index] === '' && !gameOver) {
      board[index] = player;
      cell.textContent = player;
      if (checkWin(player)) {
        alert('你贏了！');
        gameOver = true;
        return;
      }
      aiMove();
    }
  });
});

function aiMove() {
  if (useMinimax) {
    let bestMove = null;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = ai;
        let score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    board[bestMove] = ai;
    cells[bestMove].textContent = ai;
  } else {
    let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    let move = empty[Math.floor(Math.random() * empty.length)];
    board[move] = ai;
    cells[move].textContent = ai;
  }

  if (checkWin(ai)) {
    alert('電腦贏了！');
    gameOver = true;
  }
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin(ai)) return 10 - depth;
  if (checkWin(player)) return depth - 10;
  if (!newBoard.includes('')) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = ai;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === '') {
        newBoard[i] = player;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWin(symbol) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => combo.every(i => board[i] === symbol));
}

restartBtn.addEventListener('click', () => {
  board = Array(9).fill('');
  cells.forEach(cell => cell.textContent = '');
  gameOver = false;
});
