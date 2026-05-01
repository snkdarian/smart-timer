import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

const THEME_KEY = 'smart-timer-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly darkModeSignal = signal(this.readInitialTheme());

  readonly darkMode = this.darkModeSignal.asReadonly();

  constructor() {
    effect(() => {
      const darkMode = this.darkModeSignal();
      this.document.documentElement.classList.toggle('dark-theme', darkMode);
      this.document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.darkModeSignal.update((value) => !value);
  }

  private readInitialTheme(): boolean {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) {
        return stored === 'dark';
      }
    } catch {
      return false;
    }

    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
