// src/app/features/landing/sections/admin/login/login.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { RateLimitService } from '../../../../../core/services/rate-limit.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly rateLimitService = inject(RateLimitService);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected async loginWithGoogle(): Promise<void> {
    if (this.isSubmitting()) return;

    // Checa lockout antes de qualquer requisição
    const { locked } = this.rateLimitService.isLocked();
    if (locked) {
      this.errorMessage.set(
        `Muitas tentativas. Tente novamente em ${this.rateLimitService.getRemainingTime()}.`,
      );
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    try {
      await this.authService.loginWithGoogle();
      this.rateLimitService.registerAttempt(true);
    } catch {
      this.rateLimitService.registerAttempt(false);
      this.errorMessage.set('Acesso negado para esta conta Google.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
