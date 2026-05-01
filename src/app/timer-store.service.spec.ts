import { TestBed } from '@angular/core/testing';
import { TimerStoreService } from './timer-store.service';

describe('TimerStoreService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('adds and removes timers', () => {
    const store = TestBed.inject(TimerStoreService);

    const timer = store.addTimer();
    expect(store.timers().length).toBe(1);

    store.removeTimer(timer.id);
    expect(store.timers().length).toBe(0);
  });

  it('starts, pauses, and stops a timer', () => {
    const store = TestBed.inject(TimerStoreService);
    const timer = store.addTimer();

    store.updateTimer(timer.id, { durationSeconds: 60, remainingSeconds: 60 });
    store.startTimer(timer.id);
    expect(store.timers()[0].status).toBe('running');

    store.pauseTimer(timer.id, Date.now() + 10_000);
    expect(store.timers()[0].status).toBe('paused');
    expect(store.timers()[0].remainingSeconds).toBeLessThanOrEqual(60);

    store.stopTimer(timer.id);
    expect(store.timers()[0].status).toBe('idle');
    expect(store.timers()[0].remainingSeconds).toBe(60);
  });

  it('recovers from invalid localStorage data', () => {
    localStorage.setItem('smart-timer-state', 'not-json');

    const store = TestBed.inject(TimerStoreService);
    expect(store.timers()).toEqual([]);
  });

  it('restores saved timers without starting them automatically', () => {
    localStorage.setItem(
      'smart-timer-state',
      JSON.stringify({
        version: 1,
        settings: {
          notifyEnabled: false,
          soundEnabled: true,
          autoRestart: true,
        },
        timers: [
          {
            id: 'stored-timer',
            name: 'Stored timer',
            durationSeconds: 300,
            remainingSeconds: 120,
            status: 'running',
            startedAtEpochMs: Date.now() - 60_000,
            autoRestart: true,
            notifyEnabled: false,
            soundEnabled: true,
            lastNotifiedCycle: 2,
            createdAtEpochMs: 100,
          },
        ],
      }),
    );

    const store = TestBed.inject(TimerStoreService);
    const [timer] = store.timers();

    expect(timer.status).toBe('idle');
    expect(timer.remainingSeconds).toBe(300);
    expect(timer.startedAtEpochMs).toBeNull();
    expect(timer.autoRestart).toBe(true);
    expect(timer.notifyEnabled).toBe(false);
    expect(timer.soundEnabled).toBe(true);
  });
});
