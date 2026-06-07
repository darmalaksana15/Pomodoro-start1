class PomodoroTimer {
  constructor({ durations, onTick, onComplete }) {
    this.durations = durations;
    this.onTick = onTick;
    this.onComplete = onComplete;

    this.mode = "work";
    this.session = 1;
    this.remaining = durations.work;
    this.isRunning = false;
    this.intervalId = null;
  }

  get duration() {
    return this.durations[this.mode];
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    this.onTick(this.remaining);
  }

  setMode(mode) {
    this.mode = mode;
    this.reset();
  }

  tick() {
    if (this.remaining <= 0) return;

    this.remaining -= 1;
    this.onTick(this.remaining);

    if (this.remaining <= 0) {
      this.pause();
      this.onComplete(this.mode);
    }
  }

  completeWorkSession() {
    const isLongBreak =
      this.session % POMODORO_CONFIG.sessionsBeforeLongBreak === 0;
    this.mode = isLongBreak ? "longBreak" : "shortBreak";
    this.remaining = this.duration;
  }

  completeBreakSession() {
    this.mode = "work";
    this.session += 1;
    this.remaining = this.duration;
  }
}
