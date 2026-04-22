import { Component, input } from '@angular/core';

type SectionKey = 'home' | 'formacao' | 'cursos' | 'projetos' | 'sobre-mim' | 'contato';

type NavItem = {
  label: string;
  hash: SectionKey;
};

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly currentSection = input<SectionKey>('home');

  protected readonly navItems: NavItem[] = [
    { label: 'Home', hash: 'home' },
    { label: 'Formação', hash: 'formacao' },
    { label: 'Cursos', hash: 'cursos' },
    { label: 'Projetos', hash: 'projetos' },
    { label: 'Sobre mim', hash: 'sobre-mim' },
    { label: 'Contato', hash: 'contato' },
  ];
}
