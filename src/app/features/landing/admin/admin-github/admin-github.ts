import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuditService } from '../../../../core/services/audit.service';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';

type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
};

@Component({
  selector: 'app-admin-github',
  imports: [],
  templateUrl: './admin-github.html',
  styleUrl: './admin-github.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGithub {
  private readonly firestore = inject(Firestore);
  private readonly auditService = inject(AuditService);
  private readonly sanitizeService = inject(SanitizeService);

  protected readonly username = signal('');
  protected readonly repos = signal<GithubRepo[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly imported = signal<Record<number, 'loading' | 'done'>>({});

  protected setUsername(value: string): void {
    this.username.set(value);
  }

  protected async fetchRepos(): Promise<void> {
    const user = this.username().trim();
    if (!user) return;

    this.loading.set(true);
    this.error.set('');
    this.repos.set([]);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=updated&per_page=30`,
      );
      if (!response.ok) {
        this.error.set('Usuário não encontrado ou erro na API do GitHub.');
        return;
      }

      const data = (await response.json()) as GithubRepo[];
      this.repos.set(data);
      this.imported.set({});
    } catch {
      this.error.set('Não foi possível carregar os repositórios no momento.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async importRepo(repoId: number): Promise<void> {
    const repo = this.repos().find((r) => r.id === repoId);
    if (!repo) return;

    this.imported.update((state) => ({ ...state, [repoId]: 'loading' }));

    try {
      await addDoc(collection(this.firestore, 'projects'), {
        title: this.sanitizeService.sanitizeText(repo.name),
        description: this.sanitizeService.sanitizeText(repo.description ?? ''),
        github_url: this.sanitizeService.sanitizeUrl(repo.html_url),
        demo_url: '',
        image_url: '',
        technologies: repo.language ? [repo.language] : [],
        status: 'Concluído',
        featured: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.auditService.log('IMPORT', 'project', { name: repo.name });
      this.imported.update((state) => ({ ...state, [repoId]: 'done' }));
    } catch (error) {
      console.error('Erro ao importar repositório:', error);
      this.imported.update((state) => {
        const updated = { ...state };
        delete updated[repoId];
        return updated;
      });
    }
  }

  protected getImportState(repoId: number): 'loading' | 'done' | null {
    return this.imported()[repoId] ?? null;
  }
}
