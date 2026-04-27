import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';

type StatItem = {
  icon: 'award' | 'clock' | 'layers';
  label: string;
  value: string;
  colorClass: string;
};

type CourseStatus = 'Concluido' | 'Em andamento' | 'Concluído';

type CourseItem = {
  id: string;
  title: string;
  provider: string;
  year: string;
  hours: string;
  status: CourseStatus;
  description: string;
  certificate_url: string;
};

@Component({
  selector: 'app-cursos',
  imports: [],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cursos implements OnInit {
  private readonly firestore = inject(Firestore);

  protected readonly courses = signal<CourseItem[]>([]);
  protected readonly isLoading = signal(true);

  protected readonly stats: StatItem[] = [
    { icon: 'award', label: 'Certificacoes', value: '7', colorClass: 'text-teal-400' },
    { icon: 'clock', label: 'Horas de Estudo', value: '500+', colorClass: 'text-violet-400' },
    { icon: 'layers', label: 'Plataformas', value: '4', colorClass: 'text-amber-400' },
  ];

  ngOnInit(): void {
    const q = query(collection(this.firestore, 'courses'), orderBy('order', 'asc'));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.courses.set(data as CourseItem[]);
      this.isLoading.set(false);
    });
  }

  protected hasCertificate(course: CourseItem): boolean {
    return true; // todos os cursos têm a seção de certificado
  }

  protected isCompleted(course: CourseItem): boolean {
    return course.status === 'Concluido' || course.status === 'Concluído';
  }
}
