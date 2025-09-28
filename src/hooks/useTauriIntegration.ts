// src/hooks/useTauriIntegration.ts
import { useState, useEffect } from 'react';
import { listDrives, startWipe, getWipeProgress, type Drive, type WipeProgress } from '../tauri-api';

// Check if we're running in Tauri
const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;

export function useTauriIntegration() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load drives on mount
  useEffect(() => {
    if (isTauri) {
      loadDrives();
    }
  }, []);

  const loadDrives = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const driveList = await listDrives();
      setDrives(driveList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drives');
      console.error('Failed to load drives:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startWipeOperation = async (driveId: string, method: string): Promise<string> => {
    if (!isTauri) {
      throw new Error('Tauri not available');
    }
    
    try {
      const taskId = await startWipe(driveId, method);
      return taskId;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to start wipe');
    }
  };

  const getProgress = async (taskId: string): Promise<WipeProgress> => {
    if (!isTauri) {
      throw new Error('Tauri not available');
    }
    
    try {
      return await getWipeProgress(taskId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get progress');
    }
  };

  return {
    drives,
    isLoading,
    error,
    isTauri,
    loadDrives,
    startWipeOperation,
    getProgress,
  };
}

// Example usage in a component:
/*
const { drives, isLoading, error, isTauri, startWipeOperation, getProgress } = useTauriIntegration();

if (isTauri) {
  // Use real Tauri API
  const handleStartWipe = async () => {
    try {
      const taskId = await startWipeOperation('C:', 'deep');
      // Start polling for progress
      const interval = setInterval(async () => {
        const progress = await getProgress(taskId);
        setProgress(progress.percent);
        if (progress.status === 'completed') {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      console.error('Wipe failed:', err);
    }
  };
} else {
  // Fall back to dummy data
  // Use existing useDummyHooks
}
*/
