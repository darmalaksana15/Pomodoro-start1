const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const sessionEl = document.getElementById("session-number");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeTabs = document.querySelectorAll(".mode-tab");
//getElementById:
//querySelectorAll:Mengambil semua elemen yang memiliki class mode-tab, misalnya tab Work, Short Break, dan Long Break.
//Sumber:https://www.w3schools.com/jsref/met_document_getelementbyid.asp
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function updateDisplay(remaining) {
  const { minutes, seconds } = formatTime(remaining);
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

function setModeUI(mode) {
  document.body.dataset.mode = mode;
  modeTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.mode === mode);
  });
}

const timer = new PomodoroTimer({
  durations: {
    work: POMODORO_CONFIG.work,
    shortBreak: POMODORO_CONFIG.shortBreak,
    longBreak: POMODORO_CONFIG.longBreak,
  },
  onTick: updateDisplay,
  onComplete(mode) {
    if (mode === "work") {
      timer.completeWorkSession();
    } else {
      timer.completeBreakSession();
    }

    setModeUI(timer.mode);
    sessionEl.textContent = timer.session;
    updateDisplay(timer.remaining);

    if (Notification.permission === "granted") {
      const label = timer.mode === "work" ? "Work" : "Break";
      new Notification(`Pomodoro — ${label} time`);
    }
  },
});

updateDisplay(timer.remaining);

startBtn.addEventListener("click", () => {
  if (timer.isRunning) {
    timer.pause();
    startBtn.textContent = "Start";
  } else {
    timer.start();
    startBtn.textContent = "Pause";
  }
});

resetBtn.addEventListener("click", () => {
  timer.reset();
  startBtn.textContent = "Start";
});

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    timer.pause();
    timer.setMode(tab.dataset.mode);
    setModeUI(timer.mode);
    startBtn.textContent = "Start";
  });
});

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}
