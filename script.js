let board = Array(9).fill('');
let player = 'X';
let ai = 'O';
let gameOver = false;
let useMinimax = false;

// 計分變數
let scores = {
    player: 0,
    ai: 0,
    draw: 0
};

const WINNING_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8], // 橫向
    [0,3,6],[1,4,7],[2,5,8], // 縱向
    [0,4,8],[2,4,6]          // 對角線
];

// --- DOM 元素集中管理 ---
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const easyBtn = document.getElementById('easy');
const hardBtn = document.getElementById('hard');
const gameArea = document.getElementById('game');
const statusMessage = document.getElementById('status-message');
const boardEl = document.getElementById('board'); 
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const drawScoreEl = document.getElementById('draw-score');


// --- 輔助函數 ---

function updateScoreBoard() {
    playerScoreEl.textContent = scores.player;
    aiScoreEl.textContent = scores.ai;
    drawScoreEl.textContent = scores.draw;
}

function checkWin(symbol, currentBoard = board) {
  return WINNING_COMBOS.some(combo => combo.every(i => currentBoard[i] === symbol));
}


// --- 遊戲邏輯核心 ---

function initializeGame(hardMode = false) {
    board = Array(9).fill('');
    player = 'X'; 
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
        cell.classList.remove('draw-win'); 
    });
    
    gameOver = false;
    useMinimax = hardMode;
    
    easyBtn.classList.toggle('active', !hardMode);
    hardBtn.classList.toggle('active', hardMode);
    
    gameArea.style.display = 'block';
    statusMessage.textContent = '輪到你了 (X)！';
    statusMessage.style.color = '#007bff'; 
    boardEl.removeAttribute('data-game-over'); 
    
    updateScoreBoard(); 
}

function checkResult(lastMover) {
    const winningCombo = WINNING_COMBOS.find(combo => combo.every(i => board[i] === lastMover));

    if (winningCombo) {
        // 勝利邏輯
        statusMessage.textContent = `${lastMover === player ? '恭喜你贏了' : '電腦贏了'}！遊戲結束。`;
        statusMessage.style.color = lastMover === player ? '#27ae60' : '#c0392b'; 
        gameOver = true;
        boardEl.setAttribute('data-game-over', 'true');
        
        if (lastMover === player) {
            scores.player++;
        } else {
            scores.ai++;
        }
        updateScoreBoard();
        
        winningCombo.forEach(i => cells[i].classList.add('win'));
        return true;
    }
    
    if (!board.includes('')) {
        // 平局邏輯
        statusMessage.textContent = '平局！沒有人獲勝。';
        statusMessage.color = '#e67e22'; 
        gameOver = true;
        boardEl.setAttribute('data-game-over', 'true');
        
        cells.forEach(cell => cell.classList.add('draw-win')); 
        
        scores.draw++;
        updateScoreBoard();
        
        return true;
    }
    
    // 遊戲繼續，切換提示訊息
    if (!gameOver) {
        const nextMover = lastMover === player ? '電腦 (O)' : '你 (X)';
        statusMessage.textContent = `輪到 ${nextMover} 了！`;
        statusMessage.style.color = '#007bff'; 
    }
    
    return false;
}


// --- AI 與 Minimax 邏輯 (不變) ---

function minimax(newBoard, depth, isMaximizing) {
    if (checkWin(ai, newBoard)) return 10 - depth;
    if (checkWin(player, newBoard)) return depth - 10;
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

function aiMove() {
    if (gameOver) return;

    let move = null;
    
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
        move = bestMove;
        
    } else {
        let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        if (empty.length > 0) {
            move = empty[Math.floor(Math.random() * empty.length)];
        }
    }

    if (move !== null) {
        board[move] = ai;
        cells[move].textContent = ai;
        checkResult(ai);
    } else {
        checkResult(ai); 
    }
}

// --- 集中事件處理函數 (重構核心) ---

function handleCellClick(e) {
    // 檢查遊戲是否結束或該格子是否已填寫
    if (gameOver || e.target.textContent !== '') {
        return;
    }

    const index = parseInt(e.target.dataset.index);

    // 玩家移動
    board[index] = player;
    cells[index].textContent = player;
    
    // 檢查勝負或平局
    if (checkResult(player)) return;

    // 電腦移動
    statusMessage.textContent = '電腦思考中...';
    // 延遲 AI 移動
    setTimeout(aiMove, 500); 
}

function attachEventListeners() {
    // 模式選擇按鈕
    easyBtn.addEventListener('click', () => initializeGame(false));
    hardBtn.addEventListener('click', () => initializeGame(true));

    // 棋盤格子點擊
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // 重新開始按鈕
    restartBtn.addEventListener('click', () => {
        initializeGame(useMinimax); 
    });
}


// --- 初始啟動 ---
function init() {
    updateScoreBoard(); // 顯示計分板
    attachEventListeners(); // 綁定所有事件
    // 遊戲等待用戶點擊模式按鈕開始，不自動初始化棋盤
}

// 頁面載入後執行
init();
