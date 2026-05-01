import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlarmService {
  private audioContext: AudioContext | null = null;
  private unlocked = false;

  async unlock(): Promise<void> {
    const context = this.getAudioContext();
    if (!context) {
      return;
    }

    if (context.state === 'suspended') {
      await context.resume();
    }

    this.unlocked = true;
  }

  async play(): Promise<void> {
    const context = this.getAudioContext();
    if (!context || !this.unlocked) {
      return;
    }

    if (context.state === 'suspended') {
      await context.resume();
    }

    const now = context.currentTime;
    this.playTone(context, now, 880, 0.22);
    this.playTone(context, now + 0.28, 660, 0.22);
    this.playTone(context, now + 0.56, 880, 0.28);
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    this.audioContext ??= new AudioContextCtor();
    return this.audioContext;
  }

  private playTone(context: AudioContext, start: number, frequency: number, duration: number): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }
}
