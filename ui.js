// ui.js

function generateProcessInputs() {
  const num = parseInt(document.getElementById('numProcesses').value, 10) || 4;
  const container = document.getElementById('processInputs');
  container.innerHTML = '';

  for (let i = 0; i < num; i++) {
    const div = document.createElement('div');
    div.className = 'process-row';
    // Set inner HTML with inputs having classes arrival/burst/priority and unique ids
    div.innerHTML = `
      <input type="number" class="arrival" id="arrival${i}" placeholder="Arrival ${i+1}" value="${i}" min="0">
      <input type="number" class="burst" id="burst${i}" placeholder="Burst ${i+1}" value="${Math.floor(Math.random()*6)+2}" min="1">
      <input type="number" class="priority" id="priority${i}" placeholder="Priority ${i+1}" value="${Math.floor(Math.random()*5)+1}" min="1">
    `;
    // simple styling so they appear as row elements (CSS uses .process-row)
    container.appendChild(div);
  }
}

function updateProcessTable(step) {
  const tbody = document.getElementById('processTableBody');
  tbody.innerHTML = '';

  processes.forEach(p => {
    const tr = document.createElement('tr');

    let status = 'waiting';
    let statusClass = 'status-ready';
    if (step.completedProcesses && step.completedProcesses.includes(p.id)) {
      status = 'completed';
      statusClass = 'status-completed';
    } else if (step.currentProcess === p.id) {
      status = 'running';
      statusClass = 'status-running';
    } else if (step.readyQueue && step.readyQueue.includes(p.id)) {
      status = 'ready';
      statusClass = 'status-ready';
    }

    tr.innerHTML = `
      <td><strong>${p.name}</strong></td>
      <td>${p.arrival}</td>
      <td>${p.burst}</td>
      <td>${p.priority}</td>
      <td>${p.completion || '-'}</td>
      <td>${p.turnaround || '-'}</td>
      <td>${p.waiting || '-'}</td>
      <td><span class="status-indicator ${statusClass}">${status.toUpperCase()}</span></td>
    `;
    tbody.appendChild(tr);
  });
}
