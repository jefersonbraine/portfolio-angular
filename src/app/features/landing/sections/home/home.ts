import { Component } from '@angular/core';

type HomeCard = {
  title: string;
  subtitle: string;
  // Hash target used by navbar-style navigation and card links.
  hash: string;
};

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Home card order controls visual order in the grid.
  // To add/remove cards, update this list and the matching section hash route.
  protected readonly cards: HomeCard[] = [
    {
      title: 'Formação',
      subtitle: 'Minha jornada acadêmica',
      hash: 'formacao',
    },
    {
      title: 'Cursos',
      subtitle: 'Cursos e certificações',
      hash: 'cursos',
    },
    {
      title: 'Projetos',
      subtitle: 'Meus trabalhos desenvolvidos',
      hash: 'projetos',
    },
    {
      title: 'Sobre mim',
      subtitle: 'Conheça mais sobre mim',
      hash: 'sobre-mim',
    },
  ];
}
