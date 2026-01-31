class PomodoroTimer {
  constructor({ workMinutes, breakMinutes, timerDisplay, phaseDisplay }) {
    this.workMinutes = workMinutes;
    this.breakMinutes = breakMinutes;

    this.timerDisplay = timerDisplay;
    this.phaseDisplay = phaseDisplay;

    this.intervalId = null;

    this.phase = "work";
    this.completedPomodoros = 0;

    this.isRunning = false;
    this.isPaused = false;

    this.endTimeMs = 0;
    this.remainingSeconds = this.getPhaseSeconds();

    this.render();
  }

  // ---- state helpers ----
  running() { return this.isRunning; }
  paused() { return this.isPaused; }

  // ---- duration setters ----
  setWorkDuration(minutes) {
    this.workMinutes = minutes;
    if (!this.isRunning && !this.isPaused && this.phase === "work") {
      this.remainingSeconds = this.getPhaseSeconds();
      this.render();
    }
  }

  setBreakDuration(minutes) {
    this.breakMinutes = minutes;
    if (!this.isRunning && !this.isPaused && this.phase === "break") {
      this.remainingSeconds = this.getPhaseSeconds();
      this.render();
    }
  }

  // ---- main controls ----

  // Start from current remainingSeconds (works for Resume too)
  start() {
    if (this.isRunning) return;

    // If we were paused, we are now resuming
    this.isPaused = false;
    this.isRunning = true;

    this.endTimeMs = Date.now() + this.remainingSeconds * 1000;

    this.intervalId = setInterval(() => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((this.endTimeMs - Date.now()) / 1000)
      );

      this.remainingSeconds = secondsLeft;
      this.render();

      if (secondsLeft <= 0) {
        this.switchPhase();
      }
    }, 250);
  }

  pause() {
    if (!this.isRunning) return;

    clearInterval(this.intervalId);
    this.intervalId = null;

    this.isRunning = false;
    this.isPaused = true;

    // lock in remaining time
    this.remainingSeconds = Math.max(
      0,
      Math.ceil((this.endTimeMs - Date.now()) / 1000)
    );

    this.endTimeMs = 0;
    this.render();
  }

  // Stop always resets everything (work phase, full time, count = 0)
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    this.isRunning = false;
    this.isPaused = false;

    this.phase = "work";
    this.completedPomodoros = 0;

    this.endTimeMs = 0;
    this.remainingSeconds = this.getPhaseSeconds();

    this.render();
  }

  // ---- internal helpers ----

  getPhaseSeconds() {
    return (this.phase === "work" ? this.workMinutes : this.breakMinutes) * 60;
  }

  switchPhase() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    // We stay in “running mode” across phases
    // (so we do not set isRunning = false)
    if (this.phase === "work") this.completedPomodoros++;

    this.phase = this.phase === "work" ? "break" : "work";
    this.remainingSeconds = this.getPhaseSeconds();
    this.endTimeMs = 0;

    this.beep();

    // continue automatically if not paused
    if (!this.isPaused) {
      this.isRunning = false; // allow start() to rebuild interval
      this.start();
    }
  }

  render() {
    if (this.timerDisplay) {
      this.timerDisplay.textContent = this.format(this.remainingSeconds);
    }
    if (this.phaseDisplay) {
      const label = this.phase === "work" ? "Work" : "Break";
      this.phaseDisplay.textContent = `${label} (Done: ${this.completedPomodoros})`;
    }
  }

  format(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  beep(freq = 880, duration = 0.12, volume = 0.12) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  }
}
