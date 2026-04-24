import { Component } from '@angular/core';

// Model for each Home navigation card.
// Every card points to a hash section rendered by the Landing container.
type HomeCard = {
  // Text shown as card headline.
  title: string;
  // Supporting text shown below title.
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
  // Single source of truth for Home quick-navigation cards.
  // The order here is the order rendered in the grid.
  // Home card order controls visual order in the grid.
  // To add/remove cards, update this list and the matching section hash route.
  protected readonly cards: HomeCard[] = [
    // Must match a valid hash handled in Landing (e.g. #formacao).
    {
      title: 'Formação',
      subtitle: 'Minha jornada acadêmica',
      hash: 'formacao',
    },
    // Keep this hash in sync with routes/section switch names.
    {
      title: 'Cursos',
      subtitle: 'Cursos e certificações',
      hash: 'cursos',
    },
    // Card used to jump directly to projects section.
    {
      title: 'Projetos',
      subtitle: 'Meus trabalhos desenvolvidos',
      hash: 'projetos',
    },
    // About section entry card.
    {
      title: 'Sobre mim',
      subtitle: 'Conheça mais sobre mim',
      hash: 'sobre-mim',
    },
  ];
}
