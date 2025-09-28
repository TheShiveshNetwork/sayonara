import { useState, useCallback, useRef, useEffect } from 'react';

// Exported types
export interface WipeConfig {
  driveId: string;
  method: string;
}

export interface WipeProgress {
  percent: number;
  step: string;
  status: 'idle' | 'running' | 'completed' | 'cancelled' | 'error';
}

export interface UseWipeProgressReturn {
  percent: number;
  step: string;
  status: 'idle' | 'running' | 'completed' | 'cancelled' | 'error';
  startWipe: (config: WipeConfig) => Promise<string>;
  getProgress: (taskId: string) => WipeProgress | null;
  cancelWipe: (taskId: string) => void;
  currentTaskId: string | null;
  activeTasks: string[];
}

// Wipe process steps (simulates ~20 second completion)
const WIPE_STEPS = [
  { step: 'Initializing secure wipe process', duration: 2000 },
  { step: 'Analyzing drive structure', duration: 1500 },
  { step: 'Overwriting sectors - Pass 1/3', duration: 5000 },
  { step: 'Overwriting sectors - Pass 2/3', duration: 4000 },
  { step: 'Overwriting sectors - Pass 3/3', duration: 4000 },
  { step: 'Secure erase verification', duration: 2000 },
  { step: 'Generating completion hash', duration: 1000 },
  { step: 'Anchoring blockchain proof', duration: 2500 },
  { step: 'Finalizing wipe certificate', duration: 1000 }
];

// Hook implementation
export const useWipeProgress = (): UseWipeProgressReturn => {
  const [currentProgress, setCurrentProgress] = useState<WipeProgress>({
    percent: 0,
    step: 'Ready to begin secure wipe',
    status: 'idle'
  });
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  
  // Store all task progresses
  const taskProgresses = useRef<Map<string, WipeProgress>>(new Map());
  const activeTimeouts = useRef<Map<string, number[]>>(new Map());

  const generateTaskId = useCallback(() => {
    return `wipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const updateProgress = useCallback((taskId: string, updates: Partial<WipeProgress>) => {
    const existingProgress = taskProgresses.current.get(taskId) || {
      percent: 0,
      step: 'Initializing',
      status: 'running' as const
    };

    const newProgress = { ...existingProgress, ...updates };
    taskProgresses.current.set(taskId, newProgress);

    // Update current progress if this is the active task
    if (taskId === currentTaskId) {
      setCurrentProgress(newProgress);
    }
  }, [currentTaskId]);

  const simulateWipeProgress = useCallback((taskId: string, _config: WipeConfig) => {
    let currentPercent = 0;
    const timeouts: number[] = [];
    
    const totalDuration = WIPE_STEPS.reduce((sum, step) => sum + step.duration, 0);
    let elapsedTime = 0;

    const executeStep = (index: number) => {
      if (index >= WIPE_STEPS.length) {
        // Completion
        updateProgress(taskId, {
          percent: 100,
          step: 'Wipe completed successfully',
          status: 'completed'
        });
        
        // Remove from active tasks
        setActiveTasks(prev => prev.filter(id => id !== taskId));
        activeTimeouts.current.delete(taskId);
        return;
      }

      const currentStep = WIPE_STEPS[index];
      elapsedTime += currentStep.duration;
      currentPercent = Math.round((elapsedTime / totalDuration) * 100);

      // Check if task was cancelled
      const task = taskProgresses.current.get(taskId);
      if (!task || task.status === 'cancelled') {
        activeTimeouts.current.delete(taskId);
        return;
      }

      updateProgress(taskId, {
        percent: currentPercent,
        step: currentStep.step,
        status: 'running'
      });

      // Schedule next step
      const timeout = window.setTimeout(() => executeStep(index + 1), currentStep.duration);
      timeouts.push(timeout);
    };

    // TODO: Replace this simulation with real Tauri command:
    // const taskId = await invoke('start_wipe_process', { 
    //   driveId: config.driveId, 
    //   method: config.method 
    // });
    // 
    // // Then poll for progress updates:
    // const progressInterval = setInterval(async () => {
    //   const progress = await invoke('get_wipe_progress', { taskId });
    //   updateProgress(taskId, progress);
    //   if (progress.status === 'completed' || progress.status === 'error') {
    //     clearInterval(progressInterval);
    //   }
    // }, 1000);

    activeTimeouts.current.set(taskId, timeouts);
    executeStep(0);
  }, [updateProgress]);

  const startWipe = useCallback(async (config: WipeConfig): Promise<string> => {
    const taskId = generateTaskId();
    
    // Initialize task progress
    const initialProgress: WipeProgress = {
      percent: 0,
      step: `Starting ${config.method} on ${config.driveId}`,
      status: 'running'
    };

    taskProgresses.current.set(taskId, initialProgress);
    setCurrentTaskId(taskId);
    setCurrentProgress(initialProgress);
    setActiveTasks(prev => [...prev, taskId]);

    // Start simulation
    setTimeout(() => {
      simulateWipeProgress(taskId, config);
    }, 500);

    return taskId;
  }, [generateTaskId, simulateWipeProgress]);

  const getProgress = useCallback((taskId: string): WipeProgress | null => {
    return taskProgresses.current.get(taskId) || null;
  }, []);

  const cancelWipe = useCallback((taskId: string) => {
    // TODO: Replace this simulation with real Tauri command:
    // await invoke('cancel_wipe_process', { taskId });

    const timeouts = activeTimeouts.current.get(taskId);
    if (timeouts) {
      timeouts.forEach(timeout => clearTimeout(timeout));
      activeTimeouts.current.delete(taskId);
    }

    updateProgress(taskId, {
      step: 'Wipe cancelled by user',
      status: 'cancelled'
    });

    // Remove from active tasks
    setActiveTasks(prev => prev.filter(id => id !== taskId));
    
    // If this was the current task, reset to idle
    if (taskId === currentTaskId) {
      setCurrentProgress({
        percent: 0,
        step: 'Ready to begin secure wipe',
        status: 'idle'
      });
      setCurrentTaskId(null);
    }
  }, [updateProgress, currentTaskId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeTimeouts.current.forEach(timeouts => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      });
      activeTimeouts.current.clear();
    };
  }, []);

  return {
    percent: currentProgress.percent,
    step: currentProgress.step,
    status: currentProgress.status,
    startWipe,
    getProgress,
    cancelWipe,
    currentTaskId,
    activeTasks,
  };
};

/*
Example usage:

const WipeProgressComponent = () => {
  const { 
    percent, 
    step, 
    status, 
    startWipe, 
    getProgress, 
    cancelWipe, 
    currentTaskId,
    activeTasks
  } = useWipeProgress();

  const [selectedDrive, setSelectedDrive] = useState('/dev/sda1');
  const [selectedMethod, setSelectedMethod] = useState('DoD 5220.22-M (3-pass)');

  const handleStartWipe = async () => {
    try {
      const taskId = await startWipe({
        driveId: selectedDrive,
        method: selectedMethod
      });
      console.log('Started wipe with task ID:', taskId);
    } catch (error) {
      console.error('Failed to start wipe:', error);
    }
  };

  const handleCancelWipe = () => {
    if (currentTaskId) {
      cancelWipe(currentTaskId);
    }
  };

  const isWiping = status === 'running';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const canStart = status === 'idle' || status === 'completed' || status === 'cancelled';

  return (
    <div className="wipe-progress-container">
      <div className="wipe-controls">
        <h3>Secure Data Wipe</h3>
        
        <div className="drive-selection">
          <label htmlFor="drive-select">Select Drive:</label>
          <select 
            id="drive-select"
            value={selectedDrive} 
            onChange={(e) => setSelectedDrive(e.target.value)}
            disabled={isWiping}
          >
            <option value="/dev/sda1">Primary Drive (/dev/sda1)</option>
            <option value="/dev/sdb1">Secondary Drive (/dev/sdb1)</option>
            <option value="/dev/sdc1">USB Drive (/dev/sdc1)</option>
            <option value="/dev/nvme0n1">NVMe SSD (/dev/nvme0n1)</option>
          </select>
        </div>

        <div className="method-selection">
          <label htmlFor="method-select">Wipe Method:</label>
          <select 
            id="method-select"
            value={selectedMethod} 
            onChange={(e) => setSelectedMethod(e.target.value)}
            disabled={isWiping}
          >
            <option value="DoD 5220.22-M (3-pass)">DoD 5220.22-M (3-pass)</option>
            <option value="NIST 800-88 Purge">NIST 800-88 Purge</option>
            <option value="Random Data Overwrite (7-pass)">Random Data Overwrite (7-pass)</option>
            <option value="Gutmann Method (35-pass)">Gutmann Method (35-pass)</option>
            <option value="Cryptographic Erasure">Cryptographic Erasure</option>
          </select>
        </div>
      </div>

      <div className="progress-display">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${status}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="progress-percentage">{percent}%</div>
        </div>
        
        <div className="status-info">
          <div className={`status-badge ${status}`}>
            {status.toUpperCase()}
          </div>
          <div className="current-step">{step}</div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={handleStartWipe} 
          disabled={!canStart}
          className="start-button"
        >
          {isWiping ? 'Wiping in Progress...' : 'Start Secure Wipe'}
        </button>
        
        <button 
          onClick={handleCancelWipe} 
          disabled={!isWiping}
          className="cancel-button"
        >
          Cancel Wipe
        </button>
      </div>

      {isCompleted && (
        <div className="completion-message success">
          ✅ Secure wipe completed successfully! Drive {selectedDrive} has been securely erased.
        </div>
      )}

      {isCancelled && (
        <div className="completion-message warning">
          ⚠️ Wipe operation was cancelled. Drive may contain partially erased data.
        </div>
      )}

      {activeTasks.length > 1 && (
        <div className="active-tasks-info">
          <p>Active wipe tasks: {activeTasks.length}</p>
          <div className="task-list">
            {activeTasks.map(taskId => {
              const taskProgress = getProgress(taskId);
              return (
                <div key={taskId} className="task-item">
                  <span className="task-id">{taskId.slice(-8)}</span>
                  <span className="task-progress">
                    {taskProgress?.percent || 0}% - {taskProgress?.step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="timing-info">
        <small>
          Estimated completion time: ~20 seconds for standard wipe methods
        </small>
      </div>
    </div>
  );
};
*/