export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export interface SmartTimer {
  id: string;
  name: string;
  durationSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  startedAtEpochMs: number | null;
  autoRestart: boolean;
  notifyEnabled: boolean;
  soundEnabled: boolean;
  lastNotifiedCycle: number;
  createdAtEpochMs: number;
}

export interface TimerSettings {
  notifyEnabled: boolean;
  soundEnabled: boolean;
  autoRestart: boolean;
}

export interface StoredTimerState {
  version: 1;
  timers: SmartTimer[];
  settings: TimerSettings;
}
