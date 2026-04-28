import { ChangeDetectionStrategy, Component } from '@angular/core';

type EducationItem = {
  year: string;
  title: string;
  institution: string;
  period: string;
  description: string;
  current?: boolean;
};

type StatItem = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-formacao',
  imports: [],
  templateUrl: './formacao.html',
  styleUrl: './formacao.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formacao {
  protected readonly educationData: EducationItem[] = [
    {
      year: '2025',
      title: 'Bacharelado em Engenharia de Software',
      institution: 'Centro Universitário Internacional - Uninter',
      period: '2025 - Atual',
      description:
        'Formação que capacita para projetar, desenvolver, testar e manter sistemas de software. Aborda programação, algoritmos, arquitetura de software, banco de dados e gestão de projetos, visando criar soluções tecnológicas eficientes.',
      current: true,
    },
    {
      year: '2021',
      title: 'Pós-graduação em Direito e Gestão Notarial e Registral',
      institution: 'Centro Universitário Internacional - Uninter',
      period: '2021 - 2022',
      description:
        'Especialização em atos notariais e registrais, com foco na gestão eficiente de serventias extrajudiciais e na garantia da segurança jurídica em diversas transações.',
    },
    {
      year: '2021',
      title: 'Pós-graduação em Direito Civil e Processual Civil',
      institution: 'Faculdade Unina',
      period: '2021 - 2022',
      description:
        'Formação aprofundada em relações jurídicas civis e na instrumentalização processual estratégica, capacitando para o controle da resolução de litígios e da aplicação prática do Direito.',
    },
    {
      year: '2018',
      title: 'Tecnólogo em Serviços Jurídicos',
      institution: 'Centro Universitário Internacional - Uninter',
      period: '2016 - 2020',
      description:
        'Conhecimento aprofundado em legislação, ética e prática forense, além de técnicas de documentação jurídica. Bem capacitado para atuar como assessor em departamentos jurídicos e cartórios.',
    },
  ];

  protected readonly stats: StatItem[] = [
    { label: 'Média', value: '93,42/100' },
    { label: 'Projetos Concluídos', value: '8' },
    { label: 'Tecnologias', value: '10' },
  ];
}
