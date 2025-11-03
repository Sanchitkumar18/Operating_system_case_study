

// Helper: read inputs and populate processes array
function readProcessesFromUI() {
  processes = [];
  const rows = document.querySelectorAll('#processInputs .process-row');
  rows.forEach((row, i) => {
    const arrivalInput = row.querySelector('.arrival');
    const burstInput = row.querySelector('.burst');
    const priorityInput = row.querySelector('.priority');

    const arrival = parseInt(arrivalInput.value, 10) || 0;
    const burst = Math.max(1, parseInt(burstInput.value, 10) || 1);
    const priority = Math.max(1, parseInt(priorityInput.value, 10) || 1);

    processes.push({
      id: i,                   // zero-based id
      name: 'P' + (i + 1),
      arrival,
      burst,
      priority,
      remaining: burst,
      completion: 0,
      turnaround: 0,
      waiting: 0,
      status: 'waiting'
    });
  });
}

// startSimulation invoked by Start button
function startSimulation() {
  // prepare
  readProcessesFromUI();
  animationSteps = [];
  ganttChart = [];
  currentStep = 0;
  isPlaying = false;
  clearInterval(animationInterval);

  const algorithm = document.getElementById('algorithm').value;
  const quantum = parseInt(document.getElementById('quantum').value, 10) || 2;

  // run chosen algorithm
  if (algorithm === 'fcfs') runFCFS();
  else if (algorithm === 'sjf') runSJF();
  else if (algorithm === 'priority') runPriority();
  else if (algorithm === 'rr') runRoundRobin(quantum);
  else runFCFS();

  // set up timeline slider
  const timeline = document.getElementById('timeline');
  timeline.disabled = false;
  timeline.max = animationSteps.length - 1;
  timeline.value = 0;
  document.getElementById('timelineLabel').textContent = '0';

  // enable controls
  document.getElementById('playPauseBtn').disabled = false;
  document.getElementById('stepBackBtn').disabled = false;
  document.getElementById('stepFwdBtn').disabled = false;

  // first draw
  drawCurrentState();

  // start animation
  startAnimation();
}

// resetSimulation invoked by Reset button
function resetSimulation() {
  clearInterval(animationInterval);
  isPlaying = false;
  animationSteps = [];
  ganttChart = [];
  currentStep = 0;

  document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
  document.getElementById('playPauseBtn').disabled = true;
  document.getElementById('stepBackBtn').disabled = true;
  document.getElementById('stepFwdBtn').disabled = true;
  document.getElementById('timeline').disabled = true;
  document.getElementById('timeline').value = 0;
  document.getElementById('timelineLabel').textContent = '0';

  document.getElementById('currentTime').textContent = '0';
  document.getElementById('avgWaitTime').textContent = '0';
  document.getElementById('avgTurnTime').textContent = '0';
  document.getElementById('cpuUtil').textContent = '0%';

  if (ganttCtx) ganttCtx.clearRect(0, 0, ganttCanvas.width, ganttCanvas.height);
  if (queueCtx) queueCtx.clearRect(0, 0, queueCanvas.width, queueCanvas.height);

  document.getElementById('processTableBody').innerHTML = '';
}

// timeline control
document.getElementById('timeline').addEventListener('input', function() {
  currentStep = parseInt(this.value, 10) || 0;
  document.getElementById('timelineLabel').textContent = currentStep;
  drawCurrentState();
});

// algorithm change: toggle quantum input visibility
document.getElementById('algorithm').addEventListener('change', function() {
  document.getElementById('quantumGroup').style.display = this.value === 'rr' ? 'block' : 'none';
});

// speed control update: if playing, restart animation to pick up new speed
document.getElementById('speedControl').addEventListener('input', function() {
  const speed = this.value;
  document.getElementById('speedValue').textContent = (speed / 5).toFixed(1) + 'x';
  if (isPlaying) {
    clearInterval(animationInterval);
    startAnimation();
  }
});

// initial UI setup
generateProcessInputs();
