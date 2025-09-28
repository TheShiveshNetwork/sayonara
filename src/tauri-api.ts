import { invoke } from '@tauri-apps/api/core';

export interface Drive {
  id: string;
  name: string;
  size: string;
  usage_pct: number;
}

export interface WipeProgress {
  percent: number;
  step: string;
  status: string;
}

/**
 * List available drives for wiping
 */
export async function listDrives(): Promise<Drive[]> {
  return await invoke('list_drives');
}

/**
 * Start a wipe operation on the specified drive
 * @param driveId - The ID of the drive to wipe
 * @param method - The wipe method to use
 * @returns Promise resolving to task ID for progress tracking
 */
export async function startWipe(driveId: string, method: string): Promise<string> {
  return await invoke('start_wipe', { drive_id: driveId, method });
}

/**
 * Get current progress for a wipe operation
 * @param taskId - The task ID returned from startWipe
 * @returns Promise resolving to current progress
 */
export async function getWipeProgress(taskId: string): Promise<WipeProgress> {
  return await invoke('get_wipe_progress', { task_id: taskId });
}

// Example usage:
// const drives = await listDrives();
// const taskId = await startWipe('C:', 'deep');
// const progress = await getWipeProgress(taskId);
