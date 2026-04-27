import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Firestore, collection, collectionData, orderBy, query } from '@angular/fire/firestore';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type ProjectColor = 'teal' | 'violet' | 'amber' | 'rose';
type ProjectFilter = 'Todos' | 'Web' | 'Full-Stack' | 'Python';

type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  oneLiner: string;
  year: string;
  status: 'Concluído' | 'Em andamento';
  color: ProjectColor;
  filters: ProjectFilter[];
  technologies: string[];
  image: string;
  context: string;
  solution: string;
  demoUrl: string | null;
  codeUrl: string;
  videoUrl: string | null;
  docUrl: string | null;
  lessonsLearned: string;
  // campos do Firestore
  description?: string;
  demo_url?: string;
  github_url?: string;
  image_url?: string;
  order?: number;
  featured?: boolean;
};

type ColorTokens = {
  badge: string;
  bar: string;
  hoverAccent: string;
};

const COLORS: ProjectColor[] = ['teal', 'violet', 'amber', 'rose'];

@Component({
  selector: 'app-projetos',
  imports: [],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projetos implements OnInit {
  private readonly firestore = inject(Firestore);
  private readonly allowedProtocols = new Set(['https:']);

  protected readonly filters: ProjectFilter[] = ['Todos', 'Web', 'Full-Stack', 'Python'];
  protected readonly isLoading = signal(true);

  protected readonly colorMap: Record<ProjectColor, ColorTokens> = {
    teal: {
      badge: 'bg-teal-500/10 text-teal-300 border-teal-500/25',
      bar: 'bg-teal-400',
      hoverAccent: 'group-hover:text-teal-300',
    },
    violet: {
      badge: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
      bar: 'bg-violet-400',
      hoverAccent: 'group-hover:text-violet-300',
    },
    amber: {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
      bar: 'bg-amber-400',
      hoverAccent: 'group-hover:text-amber-300',
    },
    rose: {
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
      bar: 'bg-rose-400',
      hoverAccent: 'group-hover:text-rose-300',
    },
  };

  protected readonly rawProjects = signal<any[]>([]);
  protected readonly activeFilter = signal<ProjectFilter>('Todos');
  protected readonly selectedProject = signal<Project | null>(null);

  // Mapeia dados do Firestore para o tipo Project
  protected readonly projects = computed<Project[]>(() =>
    this.rawProjects().map((doc, index) => ({
      id: doc.id,
      number: String(index + 1).padStart(2, '0'),
      title: doc.title ?? '',
      category: doc.category ?? 'Web',
      oneLiner: doc.oneLiner ?? doc.description ?? '',
      year: doc.year ?? '',
      status: doc.status ?? 'Concluído',
      color: (doc.color as ProjectColor) ?? COLORS[index % COLORS.length],
      filters: (doc.filters as ProjectFilter[]) ?? ['Web'],
      technologies: doc.technologies ?? [],
      image: doc.image_url ?? doc.image ?? '',
      context: doc.context ?? '',
      solution: doc.solution ?? '',
      demoUrl: doc.demo_url ?? doc.demoUrl ?? null,
      codeUrl: doc.github_url ?? doc.codeUrl ?? '',
      videoUrl: doc.videoUrl ?? null,
      docUrl: doc.docUrl ?? null,
      lessonsLearned: doc.lessonsLearned ?? '',
    })),
  );

  private readonly sanitizer = inject(DomSanitizer);

  protected getEmbedUrl(url: string | null): string {
    if (!url) return '';

    try {
      const parsed = new URL(url);

      // YouTube
      if (parsed.hostname.includes('youtube.com')) {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : '';
      }

      // YouTube curto (youtu.be)
      if (parsed.hostname === 'youtu.be') {
        const videoId = parsed.pathname.slice(1);
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : '';
      }

      // Vimeo
      if (parsed.hostname.includes('vimeo.com')) {
        const videoId = parsed.pathname.split('/').filter(Boolean).pop();
        return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
      }

      return '';
    } catch {
      return '';
    }
  }

  protected getSafeEmbedUrl(url: string | null): SafeResourceUrl {
    const embedUrl = this.getEmbedUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  protected readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'Todos') return this.projects();
    return this.projects().filter((p) => p.filters.includes(filter));
  });

  ngOnInit(): void {
    const q = query(collection(this.firestore, 'projects'), orderBy('order', 'asc'));

    collectionData(q, { idField: 'id' }).subscribe((data) => {
      this.rawProjects.set(data);
      this.isLoading.set(false);
    });
  }

  protected setFilter(filter: ProjectFilter): void {
    this.activeFilter.set(filter);
  }

  protected openProject(project: Project): void {
    this.selectedProject.set(project);
  }

  protected closeProject(): void {
    this.selectedProject.set(null);
  }

  protected getCardColorClasses(color: ProjectColor): string {
    return this.colorMap[color].badge;
  }

  protected getCardTitleClasses(color: ProjectColor): string {
    return 'text-xl font-bold text-white transition-colors ' + this.colorMap[color].hoverAccent;
  }

  protected getQuoteClasses(color: ProjectColor): string {
    return 'text-lg font-semibold leading-snug ' + this.colorMap[color].badge.split(' ')[1];
  }

  protected getFilterButtonClasses(filter: ProjectFilter): string {
    const isActive = this.activeFilter() === filter;
    if (isActive) {
      return 'rounded-full border px-6 py-1.5 text-xs font-semibold transition-all duration-200 bg-white text-black border-white';
    }
    return 'rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white';
  }

  protected getStatusColor(status: Project['status']): string {
    return status === 'Concluído' ? 'text-teal-400' : 'text-amber-400';
  }

  protected getStatusDotColor(status: Project['status']): string {
    return status === 'Concluído' ? 'bg-teal-400' : 'bg-amber-400';
  }

  protected getSafeLink(url: string | null): string {
    if (!url || url === '#') return '#';
    try {
      const parsed = new URL(url);
      if (!this.allowedProtocols.has(parsed.protocol)) return '#';
      return parsed.toString();
    } catch {
      return '#';
    }
  }

  protected shouldOpenInNewTab(url: string | null): boolean {
    return this.getSafeLink(url) !== '#';
  }
}
