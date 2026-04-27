import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { AuditService } from '../../../../core/services/audit.service';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';
import { UploadService } from '../../../../core/services/upload.service';

type ProjectStatus = 'Concluído' | 'Em andamento';
type ProjectColor = 'teal' | 'violet' | 'amber' | 'rose'; // NOVO

type AdminProjectItem = {
  id: string;
  title: string;
  year: string;
  description: string;
  image_url: string;
  status: ProjectStatus;
  demo_url: string;
  github_url: string;
  featured: boolean;
  technologies: string[];
  order: number;
  videoUrl: string;
  category: string;
  oneLiner: string;
  context: string;
  solution: string;
  lessonsLearned: string;
  color: ProjectColor;
  filters: string[];
};

type ProjectForm = {
  title: string;
  year: string;
  description: string;
  image_url: string;
  technologies: string;
  status: ProjectStatus;
  demo_url: string;
  github_url: string;
  featured: boolean;
  videoUrl: string;
  category: string;
  oneLiner: string;
  context: string;
  solution: string;
  lessonsLearned: string;
  color: ProjectColor;
  filtersRaw: string;
};

const EMPTY_FORM: ProjectForm = {
  title: '',
  year: '',
  description: '',
  image_url: '',
  technologies: '',
  status: 'Concluído',
  demo_url: '',
  github_url: '',
  featured: false,
  videoUrl: '',
  category: '',
  oneLiner: '',
  context: '',
  solution: '',
  lessonsLearned: '',
  color: 'teal',
  filtersRaw: '',
};

@Component({
  selector: 'app-admin-projects',
  imports: [],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjects implements OnInit {
  private readonly firestore = inject(Firestore);
  private readonly auditService = inject(AuditService);
  private readonly sanitizeService = inject(SanitizeService);

  protected readonly projects = signal<AdminProjectItem[]>([]);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly form = signal<ProjectForm>({ ...EMPTY_FORM });
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);

  ngOnInit(): void {
    const q = query(collection(this.firestore, 'projects'), orderBy('order', 'asc'));
    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.projects.set(data as AdminProjectItem[]);
      this.isLoading.set(false);
    });
  }

  protected openNewForm(): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.update((v) => !v);
  }

  protected openEdit(project: AdminProjectItem): void {
    this.editingId.set(project.id);
    this.form.set({
      title: project.title,
      year: project.year,
      description: project.description,
      image_url: project.image_url,
      technologies: project.technologies.join(', '),
      status: project.status,
      demo_url: project.demo_url,
      github_url: project.github_url,
      featured: project.featured,
      category: project.category ?? '',
      oneLiner: project.oneLiner ?? '',
      context: project.context ?? '',
      solution: project.solution ?? '',
      lessonsLearned: project.lessonsLearned ?? '',
      color: project.color ?? 'teal',
      filtersRaw: (project.filters ?? []).join(', '),
      videoUrl: (project as any).videoUrl ?? '', // ← adicione aqui
    });
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
  }

  protected setField<K extends keyof ProjectForm>(field: K, value: ProjectForm[K]): void {
    this.form.update((state) => ({ ...state, [field]: value }));
  }

  protected async submitForm(event: Event): Promise<void> {
    event.preventDefault();

    const current = this.form();
    if (!current.title.trim()) return;
    if (this.isSaving()) return;

    this.isSaving.set(true);

    const sanitized = {
      title: this.sanitizeService.sanitizeText(current.title ?? ''),
      year: this.sanitizeService.sanitizeText(current.year ?? ''),
      description: this.sanitizeService.sanitizeText(current.description ?? ''),
      image_url: this.sanitizeService.sanitizeUrl(current.image_url ?? ''),
      status: current.status,
      demo_url: this.sanitizeService.sanitizeUrl(current.demo_url ?? ''),
      github_url: this.sanitizeService.sanitizeUrl(current.github_url ?? ''),
      featured: current.featured,
      technologies: (current.technologies ?? '')
        .split(',')
        .map((t) => this.sanitizeService.sanitizeText(t))
        .filter(Boolean),
      category: this.sanitizeService.sanitizeText(current.category ?? ''),
      oneLiner: this.sanitizeService.sanitizeText(current.oneLiner ?? ''),
      context: this.sanitizeService.sanitizeText(current.context ?? ''),
      solution: this.sanitizeService.sanitizeText(current.solution ?? ''),
      lessonsLearned: this.sanitizeService.sanitizeText(current.lessonsLearned ?? ''),
      color: current.color ?? 'teal',
      filters: (current.filtersRaw ?? '')
        .split(',')
        .map((f) => this.sanitizeService.sanitizeText(f))
        .filter(Boolean),
      videoUrl: this.sanitizeService.sanitizeUrl(current.videoUrl ?? ''), // ← adicione aqui
      updatedAt: new Date(),
    };

    try {
      const editingId = this.editingId();
      if (editingId) {
        await updateDoc(doc(this.firestore, 'projects', editingId), sanitized);
        await this.auditService.log('UPDATE', 'project', { title: sanitized.title });
      } else {
        await addDoc(collection(this.firestore, 'projects'), {
          ...sanitized,
          order: this.projects().length + 1,
          createdAt: new Date(),
        });
        await this.auditService.log('CREATE', 'project', { title: sanitized.title });
      }

      this.form.set({ ...EMPTY_FORM });
      this.editingId.set(null);
      this.showForm.set(false);
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async deleteProject(id: string): Promise<void> {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    try {
      await deleteDoc(doc(this.firestore, 'projects', id));
      await this.auditService.log('DELETE', 'project', { id });
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
    }
  }

  protected getStatusClass(status: ProjectStatus): string {
    return status === 'Concluído'
      ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }

  // Upload de imagens
  private readonly uploadService = inject(UploadService);

  protected readonly uploadError = signal('');
  protected readonly isUploading = this.uploadService.isUploading;


  protected async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadError.set('');

    try {
      const url = await this.uploadService.uploadImage(file);
      this.form.update((state) => ({ ...state, image_url: url }));
    } catch (error: any) {
      this.uploadError.set(error.message ?? 'Erro ao fazer upload.');
    }

    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    input.value = '';
  }
}
