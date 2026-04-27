import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
  private timeoutRef: any;
  private readonly EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];


  constructor(private authService: AuthService, private zone: NgZone) { }

  startWatching(): void {
    this.reset();
    // Roda fora do Angular para não disparar change detection a cada mousemove
    this.zone.runOutsideAngular(() => {
      this.EVENTS.forEach(event => {
        document.addEventListener(event, () => this.reset(), { passive: true });
      });
    });
  }

   stopWatching(): void {
    clearTimeout(this.timeoutRef);
    this.EVENTS.forEach(event =>
      document.removeEventListener(event, () => this.reset())
    );
   }

  private reset(): void {
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      this.zone.run(() => this.authService.logout());
    }, this.TIMEOUT_MS);
  }
}

