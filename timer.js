class PomodoroTimer {
   /*Constructor merupakan metode khusus yang otomatis dipanggilsaat objek baru dibuat menggunakan keyword new.
  Parameter:
  - durations  : menyimpan durasi setiap mode timer.
  - onTick     : callback yang dijalankan setiap detik.
  - onComplete : callback yang dijalankan saat timer selesai.
  Sumber:MDN - constructor
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor */
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
  /*
  Getter digunakan untuk mengambil nilai durasi
  berdasarkan mode yang sedang aktif.
  Getter memungkinkan properti diakses seperti variabel biasa
  tanpa perlu memanggil fungsi.
  Sumber:MDN - get https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get*/

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
 /*
  Menentukan mode berikutnya setelah sesi kerja selesai. Operator modulus (%) digunakan untuk menentukan apakah sudah mencapai jumlah sesi tertentu.
  Sumber:MDN - Remainder (%)https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder*/
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
