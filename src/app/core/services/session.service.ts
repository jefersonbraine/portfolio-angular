import { Injectable, NgZone, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  private readonly TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
  private timeoutRef: any;

  private readonly EVENTS = [
    'mousemove', 'keydown', 'wheel', 'DOMMouseScroll',
    'mouseWheel', 'mousedown', 'touchstart', 'touchmove',
    'MSPointerDown', 'MSPointerMove'
  ];

  // Referência única para a função de reset
  private resetHandler = () => this.reset();

  startWatching(): void {
    this.reset();
    this.zone.runOutsideAngular(() => {
      this.EVENTS.forEach((event) => {
        // Agora usa a referência salva
        document.addEventListener(event, this.resetHandler, { passive: true });
      });
    });
  }

  stopWatching(): void {
    clearTimeout(this.timeoutRef);
    this.EVENTS.forEach((event) => {
      // Remove usando a mesma referência exata
      document.removeEventListener(event, this.resetHandler);
    });
  }

  private reset(): void {
    clearTimeout(this.timeoutRef);
    this.zone.runOutsideAngular(() => {
      this.timeoutRef = setTimeout(() => this.logout(), this.TIMEOUT_MS);
    });
  }

  private logout(): void {
    this.zone.run(() => {
      this.auth.logout().then(() => {
        this.stopWatching();
        this.router.navigate(['/login']);
      });
    });
  }
}
