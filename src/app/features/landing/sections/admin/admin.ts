import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AdminCourses } from '../../admin/admin-courses/admin-courses';
import { AdminGithub } from '../../admin/admin-github/admin-github';
import { AdminInfoCards } from '../../admin/admin-info-cards/admin-info-cards';
import { AdminProjects } from '../../admin/admin-projects/admin-projects';
import { AuthService } from '../../../../core/services/auth.service';
import { SessionService } from '../../../../core/services/session.service';

type AdminTab = 'projects' | 'courses' | 'cards' | 'github';

type TabItem = {
  label: string;
  value: AdminTab;
  icon: 'folder' | 'book' | 'layout' | 'github';
};

@Component({
  selector: 'app-admin',
  imports: [AdminProjects, AdminCourses, AdminInfoCards, AdminGithub],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  protected readonly isLoading = signal(false);
  protected readonly isAdmin = signal(true);
  protected readonly activeTab = signal<AdminTab>('projects');
  protected readonly isLoggingOut = signal(false);

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly tabItems: TabItem[] = [
    { label: 'Projetos', value: 'projects', icon: 'folder' },
    { label: 'Cursos', value: 'courses', icon: 'book' },
    { label: 'Info Cards', value: 'cards', icon: 'layout' },
    { label: 'GitHub Import', value: 'github', icon: 'github' },
  ];

  ngOnInit(): void {
    this.sessionService.startWatching();
  }

  ngOnDestroy(): void {
    this.sessionService.stopWatching();
  }

  protected setActiveTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  protected async logout(): Promise<void> {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    try {
      await signOut(this.auth);
      this.sessionService.stopWatching();
      await this.router.navigate(['/']);
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}
