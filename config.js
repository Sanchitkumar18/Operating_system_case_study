// config.js
// Global configuration and shared variables

const processColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
];

let processes = [];         // array of process objects
let animationSteps = [];    // array of step objects { time, currentProcess, readyQueue, completedProcesses }
let currentStep = 0;
let isPlaying = false;
let animationInterval = null;
let ganttChart = [];        // array of { processId, processName, start, end, color }

const ganttCanvas = document.getElementById('ganttCanvas');
const queueCanvas = document.getElementById('queueCanvas');
const ganttCtx = ganttCanvas && ganttCanvas.getContext ? ganttCanvas.getContext('2d') : null;
const queueCtx = queueCanvas && queueCanvas.getContext ? queueCanvas.getContext('2d') : null;
