# SmartTimer Production Plan

## Summary
Build a production-ready Angular static app for multiple concurrent countdown timers with localStorage persistence, dark mode, responsive UI, in-app notifications, optional alarm sound, and auto-restart. The app has no backend and is deployable to Cloudflare Pages or another free static host.

“Background” for v1 means the app tab remains open in Chrome, but the user may be alt-tabbed or doing something else on the PC. Timers should still expire correctly, play sound, and update/show notifications when the tab is open. If the tab/browser is closed, no sound or notification is expected.

## Key Features
- Multiple timers:
  - `+` button adds timers.
  - Remove/delete button removes timers.
  - Each timer supports name, `HH:MM:SS`, Start, Pause, Stop, Auto-restart, Notify, and Sound.
  - Timers run independently at the same time.
- Timer accuracy:
  - Use wall-clock timestamps rather than trusting interval ticks alone.
  - This keeps timers accurate when Chrome throttles a background tab.
- Completion behavior:
  - Show an in-app snackbar/toast when a timer ends.
  - If the tab is open but not focused, also use browser notifications when permission is granted.
  - Play built-in alarm tones when sound is enabled.
  - Unlock audio once on the first user interaction/timer start so later expirations can play without extra clicks.
  - Auto-restart immediately when enabled.

## UI/UX
- Simple responsive layout:
  - Top app bar with app title, dark mode toggle, and settings.
  - Main screen is the timer dashboard, not a landing page.
  - Clear `+` add action for new timers.
  - Timer cards show large countdown text, status, and compact controls.
- Responsive behavior:
  - Mobile: single-column list with touch-friendly controls.
  - Tablet/desktop: adaptive grid for many timers.
  - Timer controls wrap cleanly without overlapping.
- Accessibility:
  - Angular Material controls.
  - Icon buttons with ARIA labels.
  - Keyboard-accessible actions.
  - WCAG AA contrast in light and dark themes.

## Architecture
- Angular 21 standalone app using signals, OnPush change detection, and modern `@if` / `@for` syntax.
- Services:
  - `TimerStoreService`: timer state and localStorage persistence.
  - `TimerEngineService`: ticking, wall-clock restore, completion detection.
  - `NotificationService`: in-app snackbar and optional browser Notification API.
  - `AlarmService`: built-in alarm tones and one-time audio unlock.
  - `ThemeService`: dark mode persistence.
- Persistence:
  - Save timers, durations, remaining state, running timestamps, auto-restart, notify/sound settings, and dark mode in `localStorage`.
  - On reload, restore timers and recompute running timers from elapsed real time.

## Test Plan
- Unit tests for start, pause, stop, remove, completion, auto-restart, and elapsed wall-clock correction.
- Unit tests for localStorage restore with valid, missing, and invalid data.
- Component tests for add/remove timer flow, dark mode toggle, and disabled states.
- Manual checks:
  - Multiple timers expiring while tab is focused.
  - Multiple timers expiring while Chrome is open but alt-tabbed.
  - Sound unlock after first Start click.
  - Responsive layouts on mobile, tablet, and desktop.
  - Production build with `npm run build`.

## Assumptions
- App only guarantees alarm/notification behavior while the tab is open.
- Browser notification permission is requested on first timer start.
- Built-in alarm tones are used for v1.
- Removing a timer permanently deletes it from localStorage.
