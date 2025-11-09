const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
let board = Array(9).fill('');
let player = 'X';
let ai = 'O';
let gameOver = false;

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
  let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  if (empty.length === 0) return;
  let move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = ai;
  cells[move].textContent = ai;
  if (checkWin(ai)) {
    alert('電腦贏了！');
    gameOver = true;
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
