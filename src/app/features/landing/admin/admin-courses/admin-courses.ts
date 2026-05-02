import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
// 1. Importar Functions
import { Functions, httpsCallable } from '@angular/fire/functions';
import { SanitizeService } from '../../../../shared/validators/sanitize.service';

type CourseStatus = 'Concluído' | 'Em andamento';

type AdminCourseItem = {
  id: string;
  title: string;
  provider: string;
  year: string;
  hours: string;
  status: CourseStatus;
  description: string;
  certificate_url: string;
  order: number;
};

type CourseForm = {
  title: string;
  provider: string;
  year: string;
  hours: string;
  status: CourseStatus;
  description: string;
  certificate_url: string;
};

const EMPTY_FORM: CourseForm = {
  title: '',
  provider: '',
  year: '',
  hours: '',
  status: 'Concluído',
  description: '',
  certificate_url: '',
};

@Component({
  selector: 'app-admin-courses',
  imports: [],
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCourses implements OnInit {
  private readonly firestore = inject(Firestore);
  private readonly sanitizeService = inject(SanitizeService);
  // 2. Injetar Functions
  private readonly functions = inject(Functions);

  protected readonly courses = signal<AdminCourseItem[]>([]);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly form = signal<CourseForm>({ ...EMPTY_FORM });
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);

  ngOnInit(): void {
    const q = query(collection(this.firestore, 'courses'), orderBy('order', 'asc'));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.courses.set(data as AdminCourseItem[]);
      this.isLoading.set(false);
    });
  }

  protected openNewForm(): void {
    this.editingId.set(null);
    this.form.set({ ...EMPTY_FORM });
    this.showForm.set(true);
  }

  protected openEdit(course: AdminCourseItem): void {
    this.editingId.set(course.id);
    this.form.set({
      title: course.title,
      provider: course.provider,
      year: course.year,
      hours: course.hours,
      status: course.status,
      description: course.description,
      certificate_url: course.certificate_url,
    });
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
  }

  protected setField<K extends keyof CourseForm>(field: K, value: CourseForm[K]): void {
    this.form.update((state) => ({ ...state, [field]: value }));
  }

  protected async submitForm(event: Event): Promise<void> {
    event.preventDefault();

    const current = this.form();
    if (!current.title.trim() || !current.provider.trim()) return;
    if (this.isSaving()) return;

    this.isSaving.set(true);

    const sanitized = {
      title: this.sanitizeService.sanitizeText(current.title),
      provider: this.sanitizeService.sanitizeText(current.provider),
      year: this.sanitizeService.sanitizeText(current.year),
      hours: this.sanitizeService.sanitizeText(current.hours),
      status: current.status,
      description: this.sanitizeService.sanitizeText(current.description),
      certificate_url: this.sanitizeService.sanitizeUrl(current.certificate_url),
    };

    try {
      const editingId = this.editingId();

      if (editingId) {
        // 3. TROCA AQUI: Update via Cloud Function
        const updateCourseFn = httpsCallable(this.functions, 'updateCourse');
        await updateCourseFn({ id: editingId, data: sanitized });
      } else {
        // 4. TROCA AQUI: Create via Cloud Function
        const createCourseFn = httpsCallable(this.functions, 'createCourse');
        await createCourseFn({
          ...sanitized,
          order: this.courses().length + 1,
        });
      }

      this.form.set({ ...EMPTY_FORM });
      this.editingId.set(null);
      this.showForm.set(false);
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  protected async deleteCourse(id: string): Promise<void> {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    try {
      // 5. TROCA AQUI: Delete via Cloud Function
      const deleteCourseFn = httpsCallable(this.functions, 'deleteCourse');
      await deleteCourseFn({ id });
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  }

  protected getStatusClass(status: CourseStatus): string {
    return status === 'Concluído'
      ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
      : 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }
}
