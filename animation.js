function startAnimation() {
  if (!animationSteps || animationSteps.length === 0) {
    return; // nothing to animate
  }

  isPlaying = true;
  document.getElementById('playPauseBtn').disabled = false;
  document.getElementById('stepFwdBtn').disabled = false;
  document.getElementById('stepBackBtn').disabled = false;
  document.getElementById('timeline').disabled = false;

  const speedVal = parseInt(document.getElementById('speedControl').value, 10) || 5;
  const interval = Math.max(80, 1100 - (speedVal * 100)); // clamp

  if (animationInterval) clearInterval(animationInterval);
  animationInterval = setInterval(() => {
    if (currentStep < animationSteps.length - 1) {
      currentStep++;
      document.getElementById('timeline').value = currentStep;
      document.getElementById('timelineLabel').textContent = currentStep;
      drawCurrentState();
    } else {
      clearInterval(animationInterval);
      isPlaying = false;
      document.getElementById('playPauseBtn').textContent = '▶️ Play';
    }
  }, interval);

  document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
}

function togglePlayPause() {
  if (!animationSteps || animationSteps.length === 0) return;

  if (isPlaying) {
    clearInterval(animationInterval);
    isPlaying = false;
    document.getElementById('playPauseBtn').textContent = '▶️ Play';
  } else {
    startAnimation();
  }
}

function stepForward() {
  if (!animationSteps || animationSteps.length === 0) return;
  if (currentStep < animationSteps.length - 1) {
    currentStep++;
    document.getElementById('timeline').value = currentStep;
    document.getElementById('timelineLabel').textContent = currentStep;
    drawCurrentState();
  }
}

function stepBackward() {
  if (!animationSteps || animationSteps.length === 0) return;
  if (currentStep > 0) {
    currentStep--;
    document.getElementById('timeline').value = currentStep;
    document.getElementById('timelineLabel').textContent = currentStep;
    drawCurrentState();
  }
}

function drawCurrentState() {
  if (!animationSteps || animationSteps.length === 0) return;
  const step = animationSteps[currentStep];
  if (!step) return;

  document.getElementById('currentTime').textContent = step.time;

  // 🔥 Sync process statuses live based on step info
  processes.forEach(p => {
    if (step.currentProcess === p.id) p.status = 'running';
    else if (step.completedProcesses.includes(p.id)) p.status = 'completed';
    else if (step.readyQueue.includes(p.id)) p.status = 'ready';
    else p.status = 'waiting';
  });

  drawGanttChart(step.time);
  drawQueue(step);
  updateProcessTable(step);
}

/* Draw the Gantt chart timeline */
function drawGanttChart(currentTime) {
  if (!ganttCtx) return;
  ganttCtx.clearRect(0, 0, ganttCanvas.width, ganttCanvas.height);

  const maxTime = Math.max(
    ...processes.map(p => p.completion || 0),
    animationSteps.length ? animationSteps[animationSteps.length - 1].time + 1 : 1
  );

  const paddingLeft = 50;
  const paddingRight = 20;
  const width = ganttCanvas.width - paddingLeft - paddingRight;
  const scale = maxTime > 0 ? width / maxTime : 1;
  const barHeight = 40;
  const y = 60;

  ganttCtx.fillStyle = '#333';
  ganttCtx.font = '12px Arial';
  for (let t = 0; t <= maxTime; t++) {
    const x = paddingLeft + t * scale;
    ganttCtx.fillText(t, x - 6, y - 20);
    ganttCtx.beginPath();
    ganttCtx.moveTo(x, y - 8);
    ganttCtx.lineTo(x, y + barHeight + 8);
    ganttCtx.strokeStyle = '#eee';
    ganttCtx.stroke();
  }

  ganttChart.forEach(item => {
    const x = paddingLeft + item.start * scale;
    const w = Math.max(1, (item.end - item.start) * scale);
    ganttCtx.fillStyle = item.color;
    ganttCtx.fillRect(x, y, w, barHeight);

    ganttCtx.strokeStyle = '#333';
    ganttCtx.lineWidth = 1;
    ganttCtx.strokeRect(x, y, w, barHeight);

    ganttCtx.fillStyle = '#fff';
    ganttCtx.font = 'bold 12px Arial';
    const label = item.processName || 'P' + (item.processId + 1);
    ganttCtx.fillText(label, x + w / 2 - 10, y + barHeight / 2 + 4);
  });

  // draw time pointer
  const currentX = paddingLeft + currentTime * scale;
  ganttCtx.beginPath();
  ganttCtx.moveTo(currentX, y - 20);
  ganttCtx.lineTo(currentX, y + barHeight + 20);
  ganttCtx.strokeStyle = '#ff0000';
  ganttCtx.lineWidth = 2;
  ganttCtx.stroke();

  ganttCtx.fillStyle = '#ff0000';
  ganttCtx.font = '12px Arial';
  ganttCtx.fillText('T=' + currentTime, currentX - 15, y + barHeight + 35);
}

/* Draw CPU + Ready Queue + Completed section */
function drawQueue(step) {
  if (!queueCtx) return;
  queueCtx.clearRect(0, 0, queueCanvas.width, queueCanvas.height);

  // CPU Box
  queueCtx.fillStyle = '#f0f0f0';
  queueCtx.fillRect(40, 30, 160, 90);
  queueCtx.strokeStyle = '#333';
  queueCtx.strokeRect(40, 30, 160, 90);
  queueCtx.fillStyle = '#333';
  queueCtx.font = 'bold 14px Arial';
  queueCtx.fillText('CPU', 120, 25);

  // Current Process in CPU
  if (typeof step.currentProcess === 'number' && step.currentProcess !== -1) {
    const p = processes.find(pp => pp.id === step.currentProcess);
    const color = processColors[p.id % processColors.length];
    queueCtx.fillStyle = color;
    queueCtx.fillRect(60, 50, 120, 50);
    queueCtx.strokeStyle = '#333';
    queueCtx.strokeRect(60, 50, 120, 50);
    queueCtx.fillStyle = '#fff';
    queueCtx.font = 'bold 16px Arial';
    queueCtx.fillText(p.name, 120, 80);
  } else {
    queueCtx.fillStyle = '#999';
    queueCtx.font = '14px Arial';
    queueCtx.fillText('IDLE', 120, 80);
  }

  // Ready Queue
  queueCtx.fillStyle = '#333';
  queueCtx.font = 'bold 14px Arial';
  queueCtx.fillText('Ready Queue', 320, 30);
  queueCtx.fillStyle = '#fff3cd';
  queueCtx.fillRect(260, 30, 600, 90);
  queueCtx.strokeStyle = '#333';
  queueCtx.strokeRect(260, 30, 600, 90);

  const rq = step.readyQueue || [];
  rq.forEach((pid, idx) => {
    const p = processes.find(pp => pp.id === pid);
    const x = 280 + idx * 90;
    const y = 45;
    const color = processColors[p.id % processColors.length];
    queueCtx.fillStyle = color;
    queueCtx.fillRect(x, y, 70, 60);
    queueCtx.strokeStyle = '#333';
    queueCtx.strokeRect(x, y, 70, 60);
    queueCtx.fillStyle = '#fff';
    queueCtx.font = 'bold 14px Arial';
    queueCtx.fillText(p.name, x + 35, y + 35);
  });

  if (rq.length === 0) {
    queueCtx.fillStyle = '#999';
    queueCtx.font = '14px Arial';
    queueCtx.fillText('Empty', 520, 75);
  }

  // Completed Section
  queueCtx.fillStyle = '#333';
  queueCtx.font = 'bold 14px Arial';
  queueCtx.fillText('Completed', 320, 150);
  queueCtx.fillStyle = '#d1ecf1';
  queueCtx.fillRect(260, 160, 600, 50);
  queueCtx.strokeStyle = '#333';
  queueCtx.strokeRect(260, 160, 600, 50);

  const completed = step.completedProcesses || [];
  completed.forEach((pid, idx) => {
    const p = processes.find(pp => pp.id === pid);
    const x = 280 + idx * 90;
    const y = 165;
    const color = processColors[p.id % processColors.length];
    queueCtx.globalAlpha = 0.6;
    queueCtx.fillStyle = color;
    queueCtx.fillRect(x, y, 70, 30);
    queueCtx.globalAlpha = 1.0;
    queueCtx.strokeStyle = '#333';
    queueCtx.strokeRect(x, y, 70, 30);
    queueCtx.fillStyle = '#fff';
    queueCtx.font = '12px Arial';
    queueCtx.fillText(p.name, x + 35, y + 20);
  });

  if (completed.length === 0) {
    queueCtx.fillStyle = '#999';
    queueCtx.font = '12px Arial';
    queueCtx.fillText('None', 520, 185);
  }
}

/* 🧩 Update process details table dynamically */
function updateProcessTable(step) {
  const table = document.getElementById('processTableBody');
  if (!table) return;

  table.innerHTML = ''; // clear table

  processes.forEach(p => {
    const row = document.createElement('tr');

    const cells = [
      p.name,
      p.arrival,
      p.burst,
      p.priority,
      p.completion > 0 ? p.completion : '-',
      p.turnaround || '-',
      p.waiting || '-',
      p.status.toUpperCase()
    ];

    cells.forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      row.appendChild(td);
    });

    // color-code row by status
    switch (p.status) {
      case 'running':
        row.style.backgroundColor = '#d4edda'; // green
        break;
      case 'ready':
        row.style.backgroundColor = '#fff3cd'; // yellow
        break;
      case 'completed':
        row.style.backgroundColor = '#d1ecf1'; // blue
        break;
      case 'waiting':
        row.style.backgroundColor = '#e2e3e5'; // gray
        break;
    }

    table.appendChild(row);
  });
}
