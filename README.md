# CPU Scheduling Algorithm Visualizer

## Project Overview
An interactive web-based visualization tool for operating system CPU scheduling algorithms. This application provides real-time, step-by-step animated demonstrations of four major CPU scheduling algorithms: FCFS, SJF, Priority, and Round Robin.

## Course Information
- **Course Code**: BCSE303L
- **Course Name**: Operating System
- **Assessment**: Digital Assessment No. 1
- **Slot**: C2+TC2
- **Total Marks**: 20

## Features

### Core Functionality
- **Multiple Scheduling Algorithms**:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Priority Scheduling
  - Round Robin (RR) with configurable time quantum

- **Interactive Controls**:
  - Play/Pause animation
  - Step-forward and step-backward navigation
  - Adjustable animation speed (0.2x to 2x)
  - Timeline scrubber for jumping to specific execution points

- **Visual Components**:
  - Animated Gantt Chart showing process execution timeline
  - Real-time CPU state and process queue visualization
  - Color-coded process states (Running, Ready, Waiting, Completed)
  - Current time indicator with red timeline marker

- **Real-Time Statistics**:
  - Current execution time
  - Average waiting time
  - Average turnaround time
  - CPU utilization percentage

- **Process Configuration**:
  - Customizable number of processes (2-8)
  - User-defined arrival times, burst times, and priorities
  - Dynamic process input generation

- **Detailed Process Table**:
  - Real-time process status updates
  - Completion time, turnaround time, and waiting time calculations
  - Visual status indicators

## Technical Specifications

### Technology Stack
- **HTML5**: Structure and semantic markup
- **CSS3**: Responsive styling with gradients and animations
- **JavaScript (ES6+)**: Algorithm implementation and animation logic
- **Canvas API**: High-performance 2D graphics rendering

### Architecture
- **Modular Design**: Separate functions for each scheduling algorithm
- **Event-Driven**: Real-time user interaction handling
- **Zero Dependencies**: Completely standalone, no external libraries
- **Client-Side Only**: No server required, runs entirely in browser

### Browser Compatibility
- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure
```
operating_system_case_study/
│
├── index.html          # Main HTML file with embedded CSS and JavaScript
├── README.md           # This file - Project documentation
```

## Algorithms Implemented

### 1. First Come First Serve (FCFS)
Non-preemptive algorithm that executes processes in order of arrival time.

### 2. Shortest Job First (SJF)
Non-preemptive algorithm that selects the process with the shortest burst time.

### 3. Priority Scheduling
Non-preemptive algorithm that executes processes based on priority (lower number = higher priority).

### 4. Round Robin (RR)
Preemptive algorithm with configurable time quantum for time-sharing execution.

## Key Performance Metrics

The visualizer calculates and displays:
- **Waiting Time**: Time a process spends in the ready queue
- **Turnaround Time**: Total time from arrival to completion
- **CPU Utilization**: Percentage of time CPU is actively executing processes

## Color Coding System
- 🟢 **Green**: Process currently running on CPU
- 🟡 **Yellow**: Process in ready queue
- 🔵 **Blue**: Process completed
- ⚪ **Gray**: Process waiting for arrival time

## Educational Value
This tool helps students understand:
- How different scheduling algorithms affect process execution
- The impact of arrival times and burst times on performance
- Trade-offs between different scheduling policies
- Real-world CPU scheduling behavior through visual feedback

## Code Quality
- Comprehensive inline comments explaining logic
- Consistent naming conventions
- Error-free execution with proper state management
- Efficient canvas rendering for smooth animations

## Future Enhancements (Optional)
- Export Gantt chart as PNG image
- Save/load process configurations
- Multilevel queue scheduling
- Preemptive SJF (SRTF)
- Comparison mode for multiple algorithms

## Author Information
- Name-Sanchit Kumar
- Registration no-23BCE0043
- **Submission Date**: 03-11-2025

## License
This project is submitted as part of academic coursework for BCSE303L Operating System.

---
