// Utilities
function resetProcessFields() {
  processes.forEach(p => {
    p.remaining = p.burst;
    p.completion = 0;
    p.turnaround = 0;
    p.waiting = 0;
    p.status = 'ready'; // changed from 'waiting'
  });
}

// Helper to finalize all statuses after each run
function finalizeProcessStatus() {
  const lastTime = Math.max(
    ...processes.map(p => p.completion || 0),
    animationSteps.length ? animationSteps[animationSteps.length - 1].time : 0
  );

  processes.forEach(p => {
    if (p.remaining <= 0 || p.completion > 0) p.status = 'completed';
    else if (p.arrival <= lastTime) p.status = 'waiting';
    else p.status = 'ready';
  });
}

// FCFS - non-preemptive
function runFCFS() {
  resetProcessFields();
  processes.sort((a,b) => a.arrival - b.arrival || a.id - b.id);

  let currentTime = 0;
  animationSteps = [];
  ganttChart = [];

  for (let i = 0; i < processes.length; i++) {
    const proc = processes[i];
    if (currentTime < proc.arrival) {
      while (currentTime < proc.arrival) {
        animationSteps.push({
          time: currentTime,
          currentProcess: -1,
          readyQueue: processes.filter(p => p.arrival <= currentTime && p.completion === 0).map(p => p.id),
          completedProcesses: processes.filter(p => p.completion > 0).map(p => p.id)
        });
        currentTime++;
      }
    }

    const startTime = currentTime;
    for (let t = 0; t < proc.burst; t++) {
      animationSteps.push({
        time: currentTime,
        currentProcess: proc.id,
        readyQueue: processes.filter(p => p.arrival <= currentTime && p.completion === 0 && p.id !== proc.id).map(p => p.id),
        completedProcesses: processes.filter(p => p.completion > 0).map(p => p.id)
      });
      currentTime++;
    }

    proc.remaining = 0;
    proc.completion = currentTime;
    proc.turnaround = proc.completion - proc.arrival;
    proc.waiting = proc.turnaround - proc.burst;
    proc.status = 'completed';

    ganttChart.push({
      processId: proc.id,
      processName: proc.name,
      start: startTime,
      end: currentTime,
      color: processColors[proc.id % processColors.length]
    });
  }

  finalizeProcessStatus();
  calculateStatistics();
}

// SJF - non-preemptive
function runSJF() {
  resetProcessFields();
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  const isCompleted = new Array(n).fill(false);
  animationSteps = [];
  ganttChart = [];

  while (completed < n) {
    let idx = -1;
    let minBurst = Infinity;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= currentTime && !isCompleted[i]) {
        if (processes[i].burst < minBurst) {
          minBurst = processes[i].burst;
          idx = i;
        } else if (processes[i].burst === minBurst && processes[i].arrival < processes[idx].arrival) {
          idx = i;
        }
      }
    }

    if (idx === -1) {
      animationSteps.push({
        time: currentTime,
        currentProcess: -1,
        readyQueue: processes.filter((p,i)=> !isCompleted[i] && p.arrival <= currentTime).map(p => p.id),
        completedProcesses: processes.filter((p,i)=> isCompleted[i]).map(p => p.id)
      });
      currentTime++;
      continue;
    }

    const proc = processes[idx];
    const startTime = currentTime;
    for (let t = 0; t < proc.burst; t++) {
      animationSteps.push({
        time: currentTime,
        currentProcess: proc.id,
        readyQueue: processes.filter((p,i)=> !isCompleted[i] && i !== idx && p.arrival <= currentTime).map(p => p.id),
        completedProcesses: processes.filter((p,i)=> isCompleted[i]).map(p => p.id)
      });
      currentTime++;
    }

    proc.remaining = 0;
    proc.completion = currentTime;
    proc.turnaround = proc.completion - proc.arrival;
    proc.waiting = proc.turnaround - proc.burst;
    proc.status = 'completed';
    isCompleted[idx] = true;
    completed++;

    ganttChart.push({
      processId: proc.id,
      processName: proc.name,
      start: startTime,
      end: currentTime,
      color: processColors[proc.id % processColors.length]
    });
  }

  finalizeProcessStatus();
  calculateStatistics();
}

// Priority - non-preemptive
function runPriority() {
  resetProcessFields();
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  const isCompleted = new Array(n).fill(false);
  animationSteps = [];
  ganttChart = [];

  while (completed < n) {
    let idx = -1;
    let bestPriority = Infinity;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= currentTime && !isCompleted[i]) {
        if (processes[i].priority < bestPriority) {
          bestPriority = processes[i].priority;
          idx = i;
        }
      }
    }

    if (idx === -1) {
      animationSteps.push({
        time: currentTime,
        currentProcess: -1,
        readyQueue: processes.filter((p,i)=> !isCompleted[i] && p.arrival <= currentTime).map(p => p.id),
        completedProcesses: processes.filter((p,i)=> isCompleted[i]).map(p => p.id)
      });
      currentTime++;
      continue;
    }

    const proc = processes[idx];
    const startTime = currentTime;
    for (let t = 0; t < proc.burst; t++) {
      animationSteps.push({
        time: currentTime,
        currentProcess: proc.id,
        readyQueue: processes.filter((p,i)=> !isCompleted[i] && i !== idx && p.arrival <= currentTime).map(p => p.id),
        completedProcesses: processes.filter((p,i)=> isCompleted[i]).map(p => p.id)
      });
      currentTime++;
    }

    proc.remaining = 0;
    proc.completion = currentTime;
    proc.turnaround = proc.completion - proc.arrival;
    proc.waiting = proc.turnaround - proc.burst;
    proc.status = 'completed';
    isCompleted[idx] = true;
    completed++;

    ganttChart.push({
      processId: proc.id,
      processName: proc.name,
      start: startTime,
      end: currentTime,
      color: processColors[proc.id % processColors.length]
    });
  }

  finalizeProcessStatus();
  calculateStatistics();
}

// Round Robin (preemptive)
function runRoundRobin(quantum = 2) {
  resetProcessFields();
  const n = processes.length;
  animationSteps = [];
  ganttChart = [];

  const order = processes.slice().sort((a,b)=> a.arrival - b.arrival || a.id - b.id);
  let currentTime = 0;
  let queue = [];
  let i = 0;
  let completed = 0;

  while (completed < n) {
    while (i < order.length && order[i].arrival <= currentTime) {
      queue.push(order[i].id);
      i++;
    }

    if (queue.length === 0) {
      if (i < order.length) {
        animationSteps.push({
          time: currentTime,
          currentProcess: -1,
          readyQueue: [],
          completedProcesses: processes.filter(p => p.remaining === 0).map(p => p.id)
        });
        currentTime++;
        continue;
      } else break;
    }

    const pid = queue.shift();
    const proc = processes.find(p => p.id === pid);
    const execTime = Math.min(quantum, proc.remaining);
    const startTime = currentTime;

    for (let t = 0; t < execTime; t++) {
      while (i < order.length && order[i].arrival <= currentTime) {
        queue.push(order[i].id);
        i++;
      }

      animationSteps.push({
        time: currentTime,
        currentProcess: proc.id,
        readyQueue: queue.slice(),
        completedProcesses: processes.filter(p => p.remaining === 0 && p.id !== proc.id).map(p => p.id)
      });
      currentTime++;
      proc.remaining--;
    }

    ganttChart.push({
      processId: proc.id,
      processName: proc.name,
      start: startTime,
      end: currentTime,
      color: processColors[proc.id % processColors.length]
    });

    while (i < order.length && order[i].arrival <= currentTime) {
      queue.push(order[i].id);
      i++;
    }

    if (proc.remaining > 0) {
      queue.push(proc.id);
    } else {
      proc.remaining = 0;
      proc.completion = currentTime;
      proc.turnaround = proc.completion - proc.arrival;
      proc.waiting = proc.turnaround - proc.burst;
      proc.status = 'completed';
      completed++;
    }
  }

  finalizeProcessStatus();
  calculateStatistics();
}

// Calculate statistics
function calculateStatistics() {
  const n = processes.length;
  let totalWait = 0;
  let totalTurn = 0;
  processes.forEach(p => {
    totalWait += p.waiting;
    totalTurn += p.turnaround;
  });

  const avgWait = n ? (totalWait / n).toFixed(2) : '0.00';
  const avgTurn = n ? (totalTurn / n).toFixed(2) : '0.00';
  const totalTime = Math.max(...processes.map(p => p.completion || 0), animationSteps.length ? animationSteps[animationSteps.length-1].time : 0);
  const totalBurst = processes.reduce((s,p)=> s + p.burst, 0);
  const cpuUtil = totalTime ? ((totalBurst / totalTime) * 100).toFixed(2) : '0.00';

  document.getElementById('avgWaitTime').textContent = avgWait;
  document.getElementById('avgTurnTime').textContent = avgTurn;
  document.getElementById('cpuUtil').textContent = cpuUtil + '%';
}
