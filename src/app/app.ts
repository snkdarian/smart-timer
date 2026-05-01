import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SmartTimer } from './timer.model';
import { TimerEngineService } from './timer-engine.service';
import { TimerStoreService } from './timer-store.service';
import { ThemeService } from './theme.service';
import { formatDuration, parseDurationInput } from './time-utils';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly store = inject(TimerStoreService);
  private readonly engine = inject(TimerEngineService);
  protected readonly theme = inject(ThemeService);

  protected readonly timers = this.store.timers;
  protected readonly settings = this.store.settings;
  protected readonly hasTimers = this.store.hasTimers;
  protected readonly durationInputs = signal<Record<string, string>>({});
  protected readonly visibleTimers = computed(() =>
    [...this.timers()].sort((a, b) => a.createdAtEpochMs - b.createdAtEpochMs),
  );

  protected addTimer(): void {
    const timer = this.store.addTimer();
    this.durationInputs.update((inputs) => ({
      ...inputs,
      [timer.id]: formatDuration(timer.durationSeconds),
    }));
  }

  protected removeTimer(id: string): void {
    this.store.removeTimer(id);
    this.durationInputs.update((inputs) => {
      const next = { ...inputs };
      delete next[id];
      return next;
    });
  }

  protected startTimer(timer: SmartTimer): void {
    this.commitDuration(timer);
    this.engine.start(timer.id);
  }

  protected pauseTimer(id: string): void {
    this.engine.pause(id);
  }

  protected stopTimer(id: string): void {
    this.engine.stop(id);
  }

  protected updateName(timer: SmartTimer, name: string): void {
    this.store.updateTimer(timer.id, { name });
  }

  protected setDurationInput(timer: SmartTimer, value: string): void {
    this.durationInputs.update((inputs) => ({ ...inputs, [timer.id]: value }));
    const parsed = parseDurationInput(value);

    if (parsed && timer.status !== 'running') {
      this.store.updateTimer(timer.id, {
        durationSeconds: parsed,
        remainingSeconds: parsed,
        status: timer.status === 'done' ? 'idle' : timer.status,
      });
    }
  }

  protected durationInput(timer: SmartTimer): string {
    return this.durationInputs()[timer.id] ?? formatDuration(timer.durationSeconds);
  }

  protected toggleAutoRestart(timer: SmartTimer, checked: boolean): void {
    this.store.updateTimer(timer.id, { autoRestart: checked });
  }

  protected toggleNotify(timer: SmartTimer, checked: boolean): void {
    this.store.updateTimer(timer.id, { notifyEnabled: checked });
  }

  protected toggleSound(timer: SmartTimer, checked: boolean): void {
    this.store.updateTimer(timer.id, { soundEnabled: checked });
  }

  protected updateDefaultNotify(checked: boolean): void {
    this.store.updateSettings({ notifyEnabled: checked });
  }

  protected updateDefaultSound(checked: boolean): void {
    this.store.updateSettings({ soundEnabled: checked });
  }

  protected updateDefaultAutoRestart(checked: boolean): void {
    this.store.updateSettings({ autoRestart: checked });
  }

  protected format(seconds: number): string {
    return formatDuration(seconds);
  }

  protected progress(timer: SmartTimer): number {
    if (timer.durationSeconds <= 0) {
      return 0;
    }

    return Math.max(0, Math.min(100, (timer.remainingSeconds / timer.durationSeconds) * 100));
  }

  protected statusLabel(timer: SmartTimer): string {
    if (timer.status === 'running') {
      return 'Running';
    }

    if (timer.status === 'paused') {
      return 'Paused';
    }

    if (timer.status === 'done') {
      return timer.autoRestart ? 'Restarting' : 'Finished';
    }

    return 'Ready';
  }

  protected canStart(timer: SmartTimer): boolean {
    return timer.status !== 'running' && timer.durationSeconds > 0;
  }

  protected isDurationInvalid(timer: SmartTimer): boolean {
    return parseDurationInput(this.durationInput(timer)) === null;
  }

  protected commitDuration(timer: SmartTimer): void {
    const parsed = parseDurationInput(this.durationInput(timer));
    if (!parsed) {
      return;
    }

    this.store.updateTimer(timer.id, {
      durationSeconds: parsed,
      remainingSeconds: timer.status === 'paused' ? timer.remainingSeconds : parsed,
    });
  }
}
