import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

// Centralized icon token list used by template @switch blocks.
// Keeping icons typed prevents invalid icon names in section arrays.
type IconName =
  | 'mail'
  | 'phone'
  | 'linkedin'
  | 'github'
  | 'map-pin'
  | 'code2'
  | 'dumbbell'
  | 'heart'
  | 'gamepad2'
  | 'external-link';

// Top profile card quick-action buttons (mail, WhatsApp, social links).
type ContactButton = {
  icon: IconName;
  label: string;
  href: string;
  external?: boolean;
};

// Small key/value metrics shown in the statistics panel.
type StatItem = {
  label: string;
  value: string;
};

// Grouped technical skills rendered as tag chips.
type SkillGroup = {
  category: string;
  // Predefined utility-class string controlling badge colors for each group.
  skillClass: string;
  skills: string[];
};

// Card data for personal interests grid.
type InterestItem = {
  icon: IconName;
  title: string;
  subtitle: string;
};

// Detailed contact rows in the "Vamos conversar" block.
type ContactInfoItem = {
  icon: IconName;
  label: string;
  href: string;
  external?: boolean;
};

@Component({
  selector: 'app-sobre-mim',
  imports: [NgOptimizedImage],
  templateUrl: './sobre-mim.html',
  styleUrl: './sobre-mim.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreMim {
  private readonly allowedHosts = new Set([
    'linkedin.com',
    'www.linkedin.com',
    'github.com',
    'www.github.com',
    'api.whatsapp.com',
  ]);

  private readonly allowedProtocols = new Set(['https:', 'mailto:', 'tel:']);

  // Local profile image served from /public and optimized via ngSrc.
  protected readonly profileImageSrc = '/assets/profile-picture/eu.jpg';

  // Circular icon-only shortcuts shown below the profile heading.
  private readonly rawContactButtons: ContactButton[] = [
    {
      icon: 'mail',
      label: 'Email',
      href: 'mailto:jefersonbraineleal@gmail.com',
    },
    {
      icon: 'phone',
      label: 'Telefone',
      href: 'https://api.whatsapp.com/send/?phone=5541996501459&text&type=phone_number&app_absent=0',
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/jefersonbraineleal',
      external: true,
    },
    {
      icon: 'github',
      label: 'GitHub',
      href: 'https://github.com/jefersonbraine',
      external: true,
    },
  ];

  // Personal highlight numbers displayed on left column.
  protected readonly stats: StatItem[] = [
    { label: 'Experiência', value: '2+ anos' },
    { label: 'Projetos', value: '8+' },
    { label: 'Commits', value: '1000+' },
    { label: 'Café/dia', value: '☕5' },
  ];

  // Main skills taxonomy with visual theme per category.
  protected readonly skillGroups: SkillGroup[] = [
    {
      category: 'Linguagens',
      skillClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      skills: ['JavaScript', 'TypeScript', 'Python', 'C#', 'SQL'],
    },
    {
      category: 'Frontend',
      skillClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      skills: ['Angular', 'HTML & CSS', 'Tailwind CSS', 'WinUI 3'],
    },
    {
      category: 'Backend & Banco',
      skillClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      skills: ['Python', 'SQLite', 'REST APIs', 'Firestore', 'EF Core'],
    },
    {
      category: 'Ferramentas',
      skillClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      skills: ['Git', 'GitHub', 'VS Code', 'Postman', 'Figma'],
    },
    {
      category: 'Cloud & DevOps',
      skillClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      skills: ['Oracle', 'Vercel', 'GitHub Actions (CI/CD)', 'Docker'],
    },
  ];

  // Personal interests/hobbies section data.
  protected readonly interests: InterestItem[] = [
    {
      icon: 'code2',
      title: 'Programação',
      subtitle: 'Desenvolvimento web e mobile',
    },
    {
      icon: 'dumbbell',
      title: 'Academia',
      subtitle: 'Cuidando diariamente da minha saúde',
    },
    {
      icon: 'heart',
      title: 'Voluntariado',
      subtitle: 'Ensino de programação e direito',
    },
    {
      icon: 'gamepad2',
      title: 'Videogame',
      subtitle: 'Explorar novos mundos e histórias',
    },
  ];

  // Contact links rendered as full-width rows in the final card.
  private readonly rawContactInfo: ContactInfoItem[] = [
    {
      icon: 'mail',
      label: 'jefersonbraineleal@gmail.com',
      href: 'mailto:jefersonbraineleal@gmail.com',
    },
    {
      icon: 'phone',
      label: '(41) 99650-1459',
      href: 'https://api.whatsapp.com/send/?phone=5541996501459&text&type=phone_number&app_absent=0',
    },
    {
      icon: 'linkedin',
      label: 'www.linkedin.com/in/jefersonbraineleal',
      href: 'https://linkedin.com/in/jefersonbraineleal',
      external: true,
    },
    {
      icon: 'github',
      label: 'https://github.com/jefersonbraine',
      href: 'https://github.com/jefersonbraine',
      external: true,
    },
  ];

  protected readonly contactButtons: ContactButton[] = this.rawContactButtons.map((button) => ({
    ...button,
    href: this.sanitizeLink(button.href),
  }));

  protected readonly contactInfo: ContactInfoItem[] = this.rawContactInfo.map((info) => ({
    ...info,
    href: this.sanitizeLink(info.href),
  }));

  protected isSafeExternalLink(href: string): boolean {
    return href.startsWith('https://');
  }

  private sanitizeLink(rawHref: string): string {
    if (!rawHref) {
      return '#';
    }

    if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      const protocol = rawHref.split(':', 1)[0] + ':';
      return this.allowedProtocols.has(protocol) ? rawHref : '#';
    }

    try {
      const parsed = new URL(rawHref);
      if (!this.allowedProtocols.has(parsed.protocol)) {
        return '#';
      }

      if (parsed.protocol === 'https:' && !this.allowedHosts.has(parsed.hostname.toLowerCase())) {
        return '#';
      }

      return parsed.toString();
    } catch {
      return '#';
    }
  }
}
