let board = Array(9).fill('');
let player = 'X';
let ai = 'O';
let gameOver = false;
let useMinimax = false;

// 🚨 建議 3：將勝利組合設為常數
const WINNING_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8], // 橫向
    [0,3,6],[1,4,7],[2,5,8], // 縱向
    [0,4,8],[2,4,6]          // 對角線
];

const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const easyBtn = document.getElementById('easy');
const hardBtn = document.getElementById('hard');
const gameArea = document.getElementById('game');
const statusMessage = document.getElementById('status-message');

// --- 遊戲初始化與模式選擇 ---
function initializeGame(hardMode = false) {
    board = Array(9).fill('');
    player = 'X'; // 確保 X 總是先手
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win'); // 🚨 建議 1：重新開始時移除勝利樣式
    });
    
    gameOver = false;
    useMinimax = hardMode;
    
    // 🚨 建議 2：設置模式按鈕的 active 狀態
    easyBtn.classList.toggle('active', !hardMode);
    hardBtn.classList.toggle('active', hardMode);
    
    gameArea.style.display = 'block';
    statusMessage.textContent = '輪到你了 (X)！';
}

easyBtn.addEventListener('click', () => initializeGame(false));
hardBtn.addEventListener('click', () => initializeGame(true));

// --- 玩家下棋邏輯 ---
cells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    // 檢查遊戲是否結束或該格子是否已填寫
    if (gameOver || e.target.textContent !== '') {
      return;
    }

    const index = parseInt(e.target.dataset.index); // 確保是數字

    // 玩家移動
    board[index] = player;
    cells[index].textContent = player;
    
    // 檢查勝負或平局
    if (checkResult(player)) return;

    // 電腦移動
    statusMessage.textContent = '電腦思考中...';
    // 延遲 AI 移動，讓 UI 有時間更新，看起來更自然
    setTimeout(aiMove, 500); 
  });
});

// --- AI 下棋邏輯 ---
function aiMove() {
  if (gameOver) return;

  let move;
  
  if (useMinimax) {
    // 困難模式：使用 Minimax 
    let bestMove = null;
    let bestScore = -Infinity;
    
    // 遍歷所有可移動的位置
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = ai;
        let score = minimax(board, 0, false);
        board[i] = ''; // 撤銷移動
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    move = bestMove;
    
  } else {
    // 簡單模式：隨機移動
    let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = empty[Math.floor(Math.random() * empty.length)];
  }

  // 如果還有可移動的位置
  if (move !== null && board[move] === '') {
    board[move] = ai;
    cells[move].textContent = ai;
    checkResult(ai);
  } else {
     // 理論上 Minimax 不會出現找不到位置的情況，但隨機模式可能需要處理棋盤滿了但沒有判斷平局的情況
     checkResult(ai); 
  }
}

// --- Minimax 演算法（不變，邏輯完善） ---
function minimax(newBoard, depth, isMaximizing) {
  // 評估函數的返回值
  if (checkWin(ai, newBoard)) return 10 - depth;
  if (checkWin(player, newBoard)) return depth - 10;
  if (!newBoard.includes('')) return 0; // 平局

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

// --- 檢查勝負與平局 ---
function checkWin(symbol, currentBoard = board) {
  // 🚨 建議 3：使用常數
  return WINNING_COMBOS.some(combo => combo.every(i => currentBoard[i] === symbol));
}

function checkResult(lastMover) {
    // 🚨 建議 1：使用 WINNING_COMBOS 尋找獲勝連線
    const winningCombo = WINNING_COMBOS.find(combo => combo.every(i => board[i] === lastMover));

    if (winningCombo) {
        statusMessage.textContent = `${lastMover === player ? '恭喜你贏了' : '電腦贏了'}！遊戲結束。`;
        gameOver = true;
        
        // 🚨 建議 1：高亮獲勝格子
        winningCombo.forEach(i => cells[i].classList.add('win'));
        
        return true;
    }
    
    // 檢查平局：棋盤上是否還有空位
    if (!board.includes('')) {
        statusMessage.textContent = '平局！沒有人獲勝。';
        gameOver = true;
        return true;
    }
    
    // 遊戲繼續，切換提示訊息
    if (!gameOver) {
        statusMessage.textContent = `輪到 ${lastMover === player ? '電腦 (O)' : '你 (X)'} 了！`;
    }
    
    return false;
}

// --- 重新開始按鈕 ---
restartBtn.addEventListener('click', () => {
  // 為了保持選擇的模式，我們只需要重新初始化遊戲
  initializeGame(useMinimax); 
});
