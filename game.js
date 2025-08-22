const game = document.getElementById("game");
const scoreBoard = document.getElementById("score");
const timeBoard = document.getElementById("time");
let score = 0;
let seconds = 0;

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
  if (!e.target.classList.contains("cell")) return;
  selectedCells = [e.target];
  e.target.classList.add("selected");
  isDragging = true;
}

function dragSelect(e) {
  if (!isDragging) return;
  if (!e.target.classList.contains("cell")) return;
  const last = selectedCells[selectedCells.length - 1];
  const r1 = parseInt(last.dataset.row),
    c1 = parseInt(last.dataset.col);
  const r2 = parseInt(e.target.dataset.row),
    c2 = parseInt(e.target.dataset.col);

  if (
    !selectedCells.includes(e.target) &&
    Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1
  ) {
    selectedCells.push(e.target);
    e.target.classList.add("selected");
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
      c.classList.add("explode"); // 애니메이션 클래스
      c.addEventListener(
        "animationend",
        () => {
          const newNum = Math.floor(Math.random() * 9) + 1;
          c.dataset.value = newNum;
          c.innerText = newNum;
          c.classList.remove("selected", "explode");
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

const timerBar = document.getElementById("timer-bar");
const MAX_TIME = 300; // 5분

const timer = setInterval(() => {
  seconds++;
  const remaining = MAX_TIME - seconds;
  const percent = (remaining / MAX_TIME) * 100;
  timerBar.style.width = percent + "%";

  // 기존 시간 텍스트도 업데이트
  const min = String(Math.floor(remaining / 60)).padStart(2, "0");
  const sec = String(remaining % 60).padStart(2, "0");
  timeBoard.innerText = `시간: ${min}:${sec}`;

  if (seconds >= MAX_TIME) {
    clearInterval(timer);
    isDragging = false;

    // 이벤트 제거
    game.removeEventListener("mousedown", startDrag);
    game.removeEventListener("mouseover", dragSelect);
    document.removeEventListener("mouseup", endDrag);

    alert(`시간 종료! 최종 점수: ${score}`);
  }
}, 1000);
