import { Injectable } from '@angular/core';

interface AttemptData {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class RateLimitService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutos
  private readonly LOCKOUT_MS = 30 * 60 * 1000; // 30 minutos bloqueado
  private readonly STORAGE_KEY = 'admin_attempts';

  private getAttempts(): AttemptData {
    const raw = sessionStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, firstAttempt: Date.now(), lockedUntil: null };
  }

  private saveAttempts(data: AttemptData): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  isLocked(): { locked: boolean; remainingMs: number } {
    const data = this.getAttempts();
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return { locked: true, remainingMs: data.lockedUntil - Date.now() };
    }
    return { locked: false, remainingMs: 0 };
  }

  registerAttempt(success: boolean): void {
    const data = this.getAttempts();

    if (success) {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return;
    }

    if (Date.now() - data.firstAttempt > this.WINDOW_MS) {
      this.saveAttempts({ count: 1, firstAttempt: Date.now(), lockedUntil: null });
      return;
    }

    data.count++;
    if (data.count >= this.MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + this.LOCKOUT_MS;
    }
    this.saveAttempts(data);
  }

  getRemainingTime(): string {
    const { remainingMs } = this.isLocked();
    const minutes = Math.ceil(remainingMs / 60000);
    return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }
}
