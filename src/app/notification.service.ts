import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SmartTimer } from './timer.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private permissionRequested = false;

  requestBrowserPermission(): void {
    if (this.permissionRequested || !this.supportsBrowserNotifications()) {
      return;
    }

    this.permissionRequested = true;

    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }

  timerCompleted(timer: SmartTimer): void {
    const message = `${timer.name} finished`;

    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['timer-snackbar'],
    });

    if (timer.notifyEnabled && document.hidden && this.supportsBrowserNotifications() && Notification.permission === 'granted') {
      new Notification('SmartTimer', {
        body: message,
        tag: `smart-timer-${timer.id}`,
        requireInteraction: false,
      });
    }
  }

  private supportsBrowserNotifications(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && window.isSecureContext;
  }
}
