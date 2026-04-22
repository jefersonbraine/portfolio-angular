import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Footer } from '../../../layout/footer/footer';
import { Navbar } from '../../../layout/navbar/navbar';
import { Contato } from '../sections/contato/contato';
import { Cursos } from '../sections/cursos/cursos';
import { Formacao } from '../sections/formacao/formacao';
import { Home } from '../sections/home/home';
import { Projetos } from '../sections/projetos/projetos';
import { SobreMim } from '../sections/sobre-mim/sobre-mim';

type SectionKey = 'home' | 'formacao' | 'cursos' | 'projetos' | 'sobre-mim' | 'contato';

@Component({
  selector: 'app-landing',
  imports: [Navbar, Home, Formacao, Cursos, Projetos, SobreMim, Contato, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly activeSection = signal<SectionKey>('home');
  private hasVisitedOtherSection = false;

  private readonly sectionTitles: Record<SectionKey, string> = {
    home: 'Home | Meu portfólio',
    formacao: 'Formação | Meu portfólio',
    cursos: 'Cursos | Meu portfólio',
    projetos: 'Projetos | Meu portfólio',
    'sobre-mim': 'Sobre mim | Meu portfólio',
    contato: 'Contato | Meu portfólio',
  };

  private readonly handleHashChange = (): void => {
    this.syncSectionFromHash();
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncSectionFromHash();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.removeEventListener('hashchange', this.handleHashChange);
  }

  private syncSectionFromHash(): void {
    const hash = window.location.hash.replace('#', '') as SectionKey;
    const section = this.isValidSection(hash) ? hash : 'home';

    if (!window.location.hash || !this.isValidSection(hash)) {
      window.history.replaceState(null, '', `#${section}`);
    }

    this.activeSection.set(section);

    if (section === 'home') {
      this.title.setTitle(
        this.hasVisitedOtherSection
          ? 'Bem vindo(a) de volta à Home! | Meu portfólio'
          : this.sectionTitles.home,
      );
      return;
    }

    this.hasVisitedOtherSection = true;
    this.title.setTitle(this.sectionTitles[section]);
  }

  private isValidSection(value: string): value is SectionKey {
    return value in this.sectionTitles;
  }
}
