const game = document.getElementById("game");
const scoreBoard = document.getElementById("score");
const timeBoard = document.getElementById("time");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let seconds = 0;
let timer; // 전역으로 선언

const GRID_ROWS = 10;
const GRID_COLS = 17;
let grid = [];

// 격자 초기화
for (let i = 0; i < GRID_ROWS; i++) {
  grid[i] = [];
  for (let j = 0; j < GRID_COLS; j++) {
    const num = Math.floor(Math.random() * 9) + 1;
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.row = i;
    cell.dataset.col = j;
    cell.dataset.value = num;
    cell.innerText = num;
    game.appendChild(cell);
    grid[i][j] = cell;
  }
}

let selectedCells = [];
let isDragging = false;

// === 이벤트 핸들러 함수 ===
function startDrag(e) {
  if (
    !e.target.classList.contains("cell") ||
    e.target.dataset.value === "" // 터진 셀은 시작점으로 선택 불가
  )
    return;

  selectedCells = [e.target];
  e.target.classList.add("selected");
  isDragging = true;
}

function dragSelect(e) {
  if (!isDragging) return;
  if (!e.target.classList.contains("cell")) return;

  const first = selectedCells[0]; // 드래그 시작점
  const r1 = parseInt(first.dataset.row);
  const c1 = parseInt(first.dataset.col);
  const r2 = parseInt(e.target.dataset.row);
  const c2 = parseInt(e.target.dataset.col);

  // 선택 영역 좌표 계산
  const rowStart = Math.min(r1, r2);
  const rowEnd = Math.max(r1, r2);
  const colStart = Math.min(c1, c2);
  const colEnd = Math.max(c1, c2);

  // 이전 선택 초기화
  selectedCells.forEach((cell) => cell.classList.remove("selected"));
  selectedCells = [];

  // 영역 내 모든 셀 선택
  for (let i = rowStart; i <= rowEnd; i++) {
    for (let j = colStart; j <= colEnd; j++) {
      const cell = grid[i][j];
      if (cell.dataset.value !== "") {
        // 터진 셀 제외
        cell.classList.add("selected");
        selectedCells.push(cell);
      }
    }
  }
}

function endDrag() {
  if (selectedCells.length === 0) return;

  const sum = selectedCells.reduce(
    (acc, c) => acc + Number(c.dataset.value),
    0
  );

  if (sum === 10) {
    score += selectedCells.length * 10;
    scoreBoard.innerText = "점수: " + score;

    selectedCells.forEach((c) => {
      // 선택 표시 제거
      c.classList.remove("selected");

      // 폭발 애니메이션 추가
      c.classList.add("explode");

      // 애니메이션 끝나면 초기화
      c.addEventListener(
        "animationend",
        () => {
          // 클래스는 cell만 남기고 제거
          c.className = "cell";
          // 값 제거
          c.dataset.value = "";
          c.innerText = "";
          // 스타일 제거 (배경, 글자 색 등)
          c.style.background = "none";
          c.style.color = "transparent";
          c.style.border = "none";
          c.style.boxShadow = "none";
          c.style.cursor = "default";
        },
        { once: true }
      );
    });
  } else {
    selectedCells.forEach((c) => c.classList.remove("selected"));
  }

  selectedCells = [];
  isDragging = false;
}

// === 이벤트 등록 ===
game.addEventListener("mousedown", startDrag);
game.addEventListener("mouseover", dragSelect);
document.addEventListener("mouseup", endDrag);

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");

// 게임 초기화 및 타이머 시작 함수
function startGame() {
  startScreen.style.display = "none";
  gameContainer.style.display = "flex";

  // 게임 초기화
  initGame();

  // 타이머 시작
  startTimer();
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  seconds = 0;
  startTimer();
  initGame();
});
const resetBoardBtn = document.getElementById("reset-board-btn");
resetBoardBtn.addEventListener("click", resetBoard);
restartBtn.addEventListener("click", () => {
  // 모달 숨기기
  const modal = document.getElementById("game-over-modal");
  modal.style.display = "none";

  // 게임 초기화
  initGame();

  // 타이머 재시작
  startTimer();
});

// 보드 초기화 함수
function resetBoard() {
  for (let i = 0; i < GRID_ROWS; i++) {
    for (let j = 0; j < GRID_COLS; j++) {
      const cell = grid[i][j];

      // 터진 셀은 건너뜀
      if (cell.dataset.value === "") continue;

      // 새 숫자 생성
      const num = Math.floor(Math.random() * 9) + 1;
      cell.dataset.value = num;
      cell.innerText = num;

      // 스타일 초기화
      cell.className = "cell";
      cell.removeAttribute("style");
    }
  }

  // 선택 초기화
  selectedCells = [];
  isDragging = false;
}

// === 게임 초기화 함수 ===
function initGame() {
  // 1. 기존 셀 제거
  game.innerHTML = "";
  grid = [];

  for (let i = 0; i < GRID_ROWS; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_COLS; j++) {
      const num = Math.floor(Math.random() * 9) + 1;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.dataset.value = num;
      cell.innerText = num;
      game.appendChild(cell);
      grid[i][j] = cell;
    }
  }

  // 점수 초기화
  score = 0;
  scoreBoard.innerText = "점수: 0";

  // 선택 초기화
  selectedCells = [];
  isDragging = false;
}

// === 타이머 시작 함수 ===
function startTimer() {
  const timerBar = document.getElementById("timer-bar");
  const MAX_TIME = 300; // 5분

  if (timer) clearInterval(timer);

  const startTime = Date.now();

  timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000); // 경과 시간
    const remaining = MAX_TIME - elapsed;

    if (remaining < 0) {
      clearInterval(timer);
      isDragging = false;

      game.removeEventListener("mousedown", startDrag);
      game.removeEventListener("mouseover", dragSelect);
      document.removeEventListener("mouseup", endDrag);

      timerBar.style.width = 0;
      timeBoard.innerText = `시간: 00:00`;

      const modal = document.getElementById("game-over-modal");
      const finalScore = document.getElementById("final-score");
      finalScore.innerText = `최종 점수: ${score}`;
      modal.style.display = "flex";

      return;
    }

    // 타이머 UI 업데이트
    const percent = (remaining / MAX_TIME) * 100;
    timerBar.style.width = percent + "%";
    const min = String(Math.floor(remaining / 60)).padStart(2, "0");
    const sec = String(remaining % 60).padStart(2, "0");
    timeBoard.innerText = `시간: ${min}:${sec}`;
  }, 250); // 250ms마다 체크, 더 부드럽게
}
