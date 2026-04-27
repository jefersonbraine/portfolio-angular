import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Footer } from '../../../layout/footer/footer';
import { Navbar } from '../../../layout/navbar/navbar';
import { Contato } from '../sections/contato/contato';
import { Cursos } from '../sections/cursos/cursos';
import { Formacao } from '../sections/formacao/formacao';
import { Home } from '../sections/home/home';
import { NotFound } from '../sections/not-found/not-found';
import { Projetos } from '../sections/projetos/projetos';
import { SobreMim } from '../sections/sobre-mim/sobre-mim';

type SectionKey =
  | 'home'
  | 'formacao'
  | 'cursos'
  | 'projetos'
  | 'sobre-mim'
  | 'contato'
  | 'not-found';

@Component({
  selector: 'app-landing',
  imports: [Navbar, Home, Formacao, Cursos, Projetos, SobreMim, Contato, NotFound, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);

  // Controls which section is visible in the SPA shell.
  protected readonly activeSection = signal<SectionKey>('home');
  // CSS parallax offsets (in pixels). These are bound as custom properties in landing.html.
  // To increase/decrease background movement intensity globally, prefer adjusting maxShift below.
  protected readonly parallaxX = signal(0);
  protected readonly parallaxY = signal(0);
  private hasVisitedOtherSection = false;
  // Parallax is enabled only for desktop-like pointers and when reduced-motion is not requested.
  private isParallaxEnabled = false;

  private readonly sectionTitles: Record<SectionKey, string> = {
    home: 'Home | Meu portfólio',
    formacao: 'Formação | Meu portfólio',
    cursos: 'Cursos | Meu portfólio',
    projetos: 'Projetos | Meu portfólio',
    'sobre-mim': 'Sobre mim | Meu portfólio',
    contato: 'Contato | Meu portfólio',
    'not-found': '404 | Meu portfólio',
  };

  private readonly handleHashChange = (): void => {
    this.syncSectionFromHash();
  };

  private readonly handlePointerMove = (event: MouseEvent): void => {
    if (!this.isParallaxEnabled) {
      return;
    }

    // Pointer delta normalized to viewport center.
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (event.clientX - centerX) / centerX;
    const offsetY = (event.clientY - centerY) / centerY;
    // Main parallax strength knob.
    // Raise for stronger movement, reduce for subtler motion.
    const maxShift = 14;

    this.parallaxX.set(offsetX * maxShift);
    this.parallaxY.set(offsetY * maxShift);
  };

  private readonly handlePointerLeave = (): void => {
    this.parallaxX.set(0);
    this.parallaxY.set(0);
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Accessibility + device safety gate for parallax.
    const prefersReducedMotion = this.matchesMedia('(prefers-reduced-motion: reduce)');
    const hasFinePointer = this.matchesMedia('(pointer: fine)');
    this.isParallaxEnabled = !prefersReducedMotion && hasFinePointer;

    this.syncSectionFromHash();
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('mousemove', this.handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', this.handlePointerLeave, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('mousemove', this.handlePointerMove);
    window.removeEventListener('mouseleave', this.handlePointerLeave);
  }

  private syncSectionFromHash(): void {
    // Keeps routing based on URL hash (e.g. #home, #cursos) and updates title accordingly.
    const rawHash = window.location.hash.replace('#', '');

    if (rawHash === 'admin') {
      window.history.replaceState(null, '', '#404');
      this.activeSection.set('not-found');
      this.title.setTitle(this.sectionTitles['not-found']);
      return;
    }

    const hashToSection = rawHash === '404' ? 'not-found' : rawHash;
    const section = this.isValidSection(hashToSection) ? hashToSection : 'home';

    if (!window.location.hash || !this.isValidSection(hashToSection)) {
      window.history.replaceState(null, '', section === 'not-found' ? '#404' : `#${section}`);
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

    if (section === 'not-found') {
      this.title.setTitle(this.sectionTitles['not-found']);
      return;
    }

    this.hasVisitedOtherSection = true;
    this.title.setTitle(this.sectionTitles[section]);
  }

  private isValidSection(value: string): value is SectionKey {
    return value in this.sectionTitles;
  }

  private matchesMedia(query: string): boolean {
    if (typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(query).matches;
  }
}
