import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type ProjectColor = 'teal' | 'violet' | 'amber' | 'rose'; //Cores predefinidas para os projetos, usadas para criar uma identidade visual consistente e facilitar a associação de cada projeto a uma cor específica, melhorando a experiência do usuário e a estética geral da seção de projetos.
type ProjectFilter = 'Todos' | 'Web' | 'Full-Stack' | 'Python'; //Filtros que os usuários podem usar para filtrar os projetos exibidos, permitindo uma navegação mais personalizada e relevante.


// Definição do tipo Project com campos detalhados para cada projeto, incluindo URLs opcionais e lições aprendidas.
// o Type project obriga que todo projeto tenha um title, image, status e etc, garantindo consistência e completude dos dados.
type Project = {
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
};

type ColorTokens = { //Definição do tipo ColorTokens para mapear as classes CSS relacionadas a cada cor, facilitando a aplicação de estilos consistentes em todo o componente.
  badge: string;
  bar: string;
  hoverAccent: string;
};

@Component({ // Definição do componente Angular para a seção de projetos, com configuração de seletor, template, estilos e estratégia de detecção de mudanças.
  selector: 'app-projetos',
  imports: [],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class Projetos {
  private readonly allowedProtocols = new Set(['https:']); //Somente links HTTPS são permitidos para evitar vulnerabilidades de segurança.

  protected readonly filters: ProjectFilter[] = ['Todos', 'Web', 'Full-Stack', 'Python']; // filtros que serão exibidos para o usuário, permitindo que ele selecione a categoria de projetos que deseja ver.

  protected readonly colorMap: Record<ProjectColor, ColorTokens> = {
    // Mapeamento de cores para cada projeto, definindo classes CSS para badge, barra e hoverAccent, garantindo uma identidade visual consistente e fácil de manter.
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

  protected readonly projects: Project[] = [ // Lista de projetos, cada um com detalhes completos, incluindo título, categoria, tecnologias usadas, contexto, solução e lições aprendidas. Essa estrutura detalhada permite que os usuários entendam não apenas o que foi feito, mas também o porquê e o como de cada projeto.
    {
      number: '01', // "id"
      title: 'Portfolio Website',
      category: 'Frontend · Design',
      oneLiner:
        'Portfólio pessoal que demonstra domínio de animações, design system e boas práticas de frontend.',
      year: '2025',
      status: 'Concluído',
      color: 'teal',
      filters: ['Web'], // Como que esse projeto vai ser identificado
      technologies: ['HTML', 'CSS', 'JS', 'Figma', 'Vercel'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      context:
        'A maioria dos portfólios de devs é genérica, baseada em templates prontos, e não consegue transmitir a personalidade do profissional. Criar um portfólio do zero é um desafio que envolve muito mais do que código — é sobre narrativa, identidade e impacto visual.',
      solution:
        'Construí uma SPA com React e Framer Motion focada em micro-interações e performance. Implementei um design system baseado em tokens CSS para garantir consistência visual. A grade animada no background foi feita puramente em CSS, sem impacto na performance. Cada página tem animações de entrada escalonadas para criar uma experiência de leitura fluida.',
      demoUrl: 'https://jefersonbraineleal.dev',
      codeUrl: 'https://github.com/jefersonbraine/Portfolio-project',
      videoUrl: null,
      docUrl: null,
      lessonsLearned:
        'O maior desafio foi equilibrar animações ricas com performance. Aprendi a usar will-change com cuidado e a preferir animações baseadas em transform/opacity para manter 60fps consistente mesmo em dispositivos móveis.',
    },
    {
      number: '02',
      title: 'Ecommerce Website',
      category: 'Full-Stack · IA',
      oneLiner:
        'E-commerce completo com autenticação, gateway de pagamento e recomendações por IA.',
      year: '2025',
      status: 'Concluído',
      color: 'violet',
      filters: ['Web', 'Full-Stack'], // Vai aparecer quando filtrar por Web ou Full-Stack
      technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Supabase', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      context:
        'Construir um e-commerce do zero é o projeto que mais expõe as lacunas de conhecimento de um desenvolvedor. Envolve segurança, UX de checkout, integração com APIs de pagamento, gestão de estado complexo e performance — tudo ao mesmo tempo.',
      solution:
        'Utilizei Next.js para SSR e melhor SEO. A autenticação foi implementada com Supabase Auth, aproveitando Row Level Security no banco para segurança em nível de dados. O gateway de pagamento foi integrado via webhooks, garantindo consistência mesmo com falhas de rede. TypeScript em todo o projeto eliminou bugs de tipagem antes do runtime.',
      demoUrl: '#',
      codeUrl: '#',
      videoUrl: null,
      docUrl: null,
      lessonsLearned:
        'Aprendi que integrar pagamentos é muito mais sobre tratamento de edge cases do que sobre a API em si. Casos como usuário fechou a aba durante o pagamento exigiram lógica de reconciliação via webhooks — algo que nenhum tutorial cobre bem.',
    },
    {
      number: '03',
      title: 'Conecta Doc',
      category: 'Full-Stack · SaaS',
      oneLiner:
        'Plataforma SaaS que reduziu em 70% o tempo de gestão documental de pequenas empresas.',
      year: '2025',
      status: 'Em andamento',
      color: 'amber',
      filters: ['Web', 'Full-Stack'],
      technologies: ['Angular', 'Supabase', 'TypeScript', 'Figma'],
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80',
      context:
        'Pequenas empresas ainda organizam documentos em pastas físicas ou drives pessoais, sem controle de versão, sem acesso por perfil, sem histórico de alterações. Isso gera retrabalho, perda de documentos e riscos de conformidade.',
      solution:
        'Desenvolvi uma plataforma SaaS com Angular no frontend e Supabase como backend. Implementei autenticação por perfis (admin, colaborador, viewer) com regras de segurança no Supabase Auth. O fluxo de aprovação de documentos usa Supabase Realtime Database para notificações instantâneas. O design foi prototipado no Figma antes de qualquer linha de código.',
      demoUrl: '#',
      codeUrl: '#',
      videoUrl: null,
      docUrl: null,
      lessonsLearned:
        'Modelar dados no Supabase é fundamentalmente diferente de SQL. Aprendi a desnormalizar estrategicamente — duplicar dados para evitar queries encadeadas — e a usar subcoleções com cuidado para não explodir o número de leituras cobradas.',
    },
    {
      number: '04',
      title: 'Iniciando.dev',
      category: 'Frontend · Marca',
      oneLiner:
        'Site institucional da minha marca de conteúdo tech, construído para conversão e SEO.',
      year: '2025',
      status: 'Em andamento',
      color: 'rose',
      filters: ['Web'],
      technologies: ['Angular', 'TypeScript', 'Tailwind CSS', 'Vercel', 'Firebase'],
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
      context:
        'Conteúdo tech sem uma marca forte se perde no ruído. O Iniciando.dev nasceu da necessidade de ter um hub centralizado de conteúdo, com identidade visual consistente e foco em desenvolvedores iniciantes que precisam de direcionamento real.',
      solution:
        'Desenvolvi o site em Angular com foco em performance e SEO técnico. A arquitetura foi pensada para escalar: componentes reutilizáveis, lazy loading de rotas e imagens otimizadas. O deploy é automatizado via Vercel com preview branches para cada PR.',
      demoUrl: '#',
      codeUrl: '#',
      videoUrl: null,
      docUrl: null,
      lessonsLearned:
        'SEO em Angular tem peculiaridades — o conteúdo renderizado no cliente não é indexado bem pelo Google sem SSR. Aprendi a configurar Angular Universal para pré-renderização estática das páginas principais, o que melhorou significativamente o Lighthouse score.',
    },
    {
      number: '05',
      title: 'Password Manager',
      category: 'Desktop · Segurança',
      oneLiner:
        'Gerenciador de senhas com criptografia AES-256 desenvolvido para aprender segurança aplicada.',
      year: '2024',
      status: 'Concluído',
      color: 'teal',
      filters: ['Python'],
      technologies: ['Python', 'AES-256', 'Tkinter', 'SQLite'],
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80',
      context:
        'A maioria das pessoas usa a mesma senha para tudo ou anota em papel. Queria entender, na prática, como funcionam os gerenciadores de senha — e aprender Python de forma que importasse, resolvendo um problema real.',
      solution:
        'Implementei criptografia simétrica AES-256 via biblioteca cryptography do Python. As senhas são salvas em SQLite local, criptografadas com uma master key derivada da senha mestra via PBKDF2. A interface foi feita em Tkinter para rodar sem dependências externas. Nenhuma senha trafega em texto puro em nenhum momento.',
      demoUrl: null,
      codeUrl: '#',
      videoUrl: null,
      docUrl: null,
      lessonsLearned:
        'Aprendi que segurança não é sobre o algoritmo — é sobre a implementação. Usar AES incorretamente (IV fixo, por exemplo) pode tornar a criptografia inútil. Estudar os vetores de ataque antes de escrever a solução mudou completamente minha abordagem.',
    },
  ];

  protected readonly activeFilter = signal<ProjectFilter>('Todos');
  protected readonly selectedProject = signal<Project | null>(null);

  protected readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'Todos') {
      return this.projects;
    }

    return this.projects.filter((project) => project.filters.includes(filter));
  });

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

  // auxiliares para o visual

  protected getCardTitleClasses(color: ProjectColor): string {
    return 'text-xl font-bold text-white transition-colors ' + this.colorMap[color].hoverAccent;
  }

  protected getQuoteClasses(color: ProjectColor): string {
    return 'text-lg font-semibold leading-snug ' + this.colorMap[color].badge.split(' ')[1];
  }

  protected getFilterButtonClasses(filter: ProjectFilter): string {
    const isActive = this.activeFilter() === filter;
    if (isActive) {
      return 'rounded-full border px-6 py-1.5 text-xs font-semibold transition-all duration-200 bg-white text-black border-white'; //Como o filtro selecionado irá aparecer, destacando-se dos demais.
    }

    return 'rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'; // Como os filtros não selecionados irão aparecer, com uma aparência mais sutil, mas ainda interativa.
  }

  protected getStatusColor(status: Project['status']): string {
    return status === 'Concluído' ? 'text-teal-400' : 'text-amber-400';
  }

  protected getStatusDotColor(status: Project['status']): string {
    return status === 'Concluído' ? 'bg-teal-400' : 'bg-amber-400';
  }

  protected getSafeLink(url: string | null): string {
    if (!url || url === '#') {
      return '#';
    }

    try {
      const parsed = new URL(url);
      if (!this.allowedProtocols.has(parsed.protocol)) {
        return '#';
      }

      return parsed.toString();
    } catch {
      return '#';
    }
  }

  protected shouldOpenInNewTab(url: string | null): boolean {
    return this.getSafeLink(url) !== '#';
  }
}
