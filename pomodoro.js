document.addEventListener("DOMContentLoaded", () => {
  const startStopBtn = document.getElementById("start-button");
  const pauseResumeBtn = document.getElementById("pause-button");

  const timerDisplay = document.getElementById("timer-display");
  const phaseDisplay = document.getElementById("phase-display");

  const workInput = document.getElementById("work-duration");
  const breakInput = document.getElementById("break-duration");

  const pomodoro = new PomodoroTimer({
    workMinutes: 25,
    breakMinutes: 5,
    timerDisplay,
    phaseDisplay
  });

  function syncButtons() {
    // Start/Stop label
    startStopBtn.textContent = (pomodoro.running() || pomodoro.paused()) ? "Stop" : "Start";

    // Pause/Resume label + enabled state
    if (!pomodoro.running() && !pomodoro.paused()) {
      pauseResumeBtn.disabled = true;          // stopped
      pauseResumeBtn.textContent = "Pause";
    } else if (pomodoro.running()) {
      pauseResumeBtn.disabled = false;
      pauseResumeBtn.textContent = "Pause";
    } else {
      pauseResumeBtn.disabled = false;         // paused
      pauseResumeBtn.textContent = "Resume";
    }
  }

  syncButtons();

  startStopBtn.addEventListener("click", () => {
    // If running or paused: STOP resets
    if (pomodoro.running() || pomodoro.paused()) {
      pomodoro.stop();
      syncButtons();
      return;
    }

    // Otherwise START: apply inputs then start
    const work = Math.max(1, parseInt(workInput.value, 10) || 25);
    const brk  = Math.max(1, parseInt(breakInput.value, 10) || 5);
    pomodoro.setWorkDuration(work);
    pomodoro.setBreakDuration(brk);

    pomodoro.start();
    syncButtons();
  });

  pauseResumeBtn.addEventListener("click", () => {
    if (pomodoro.running()) {
      pomodoro.pause();
    } else if (pomodoro.paused()) {
      pomodoro.start(); // resume
    }
    syncButtons();
  });
});
