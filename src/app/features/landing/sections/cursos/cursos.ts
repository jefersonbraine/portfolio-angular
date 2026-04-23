import { ChangeDetectionStrategy, Component } from '@angular/core';

type StatItem = {
  icon: 'award' | 'clock' | 'layers';
  label: string;
  value: string;
  colorClass: string;
};

type CourseStatus = 'Concluido' | 'Em andamento';

type CourseItem = {
  title: string;
  provider: string;
  year: string;
  hours: string;
  status: CourseStatus;
  description: string;
  certificate: boolean;
  certificateUrl?: string;
};

@Component({
  selector: 'app-cursos',
  imports: [],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cursos {
  protected readonly stats: StatItem[] = [
    {
      icon: 'award',
      label: 'Certificacoes',
      value: '7',
      colorClass: 'text-teal-400',
    },
    {
      icon: 'clock',
      label: 'Horas de Estudo',
      value: '500+',
      colorClass: 'text-violet-400',
    },
    {
      icon: 'layers',
      label: 'Plataformas',
      value: '4',
      colorClass: 'text-amber-400',
    },
  ];

  protected readonly courses: CourseItem[] = [
    {
      title: 'AWS Certified Cloud Practitioner',
      provider: 'Udemy',
      year: '2026',
      hours: '91 horas',
      status: 'Em andamento',
      description:
        'Preparatório para Certificação Amazon AWS Cloud Practitioner para dominar os fundamentos essenciais da computação em nuvem com foco no exame oficial.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'CCNA: Introduction to Networks - 10ª Onda Ciber Educação Cisco',
      provider: 'Senai-SC & Cisco',
      year: '2025',
      hours: '70 horas',
      status: 'Concluido',
      description:
        'Programa intensivo com foco nos pilares de redes e seguranca cibernética, estabelecendo uma base fundamental.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Network Security - 10ª Onda Ciber Educação Cisco',
      provider: 'Senai-SC & Cisco',
      year: '2025',
      hours: '70 horas',
      status: 'Concluido',
      description:
        'Aprender a proteger infraestruturas digitais contra ameaças, focando em defesa em camadas, políticas de segurança, criptografia, firewalls e VPNs.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Network Defense - 10ª Onda Ciber Educação Cisco',
      provider: 'Senai-SC & Cisco',
      year: '2025',
      hours: '27 horas',
      status: 'Concluido',
      description:
        'Aprender a proteger nfraestruturas de rede, focando em identificar vulnerabilidades, monitorar tráfego e reagir a ataques cibernéticos.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Técnico em Redes - 10ª Onda Ciber Educação Cisco',
      provider: 'Senai-SC & Cisco',
      year: '2025',
      hours: '70 horas',
      status: 'Concluido',
      description:
        'Aprender a projetar, instalar, configurar e manter redes de computadores, dominando protocolos (IP, DHCP), roteadores, switches e segurança.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Desenvolvimento Full Stack com React, Node.js e Next.js',
      provider: 'Full Stack Club',
      year: '2025',
      hours: '90 horas',
      status: 'Concluido',
      description:
        'Curso intensivo de desenvolvimento web moderno com foco em tecnologias atuais do mercado.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Santander Bootcamp - FullStack Java + Angular',
      provider: 'DIO',
      year: '2025',
      hours: '116 horas',
      status: 'Concluido',
      description:
        'Intensivo Fullstack com alvo Java, Angular, Banco de dados, Spring Boot, POO, SQL e NoSQL.',
      certificate: true,
      certificateUrl: '',
    },
    {
      title: 'Desbravando a Web: HTML, CSS, JavaScript e TypeScript',
      provider: 'Udemy',
      year: '2024',
      hours: '36 horas',
      status: 'Concluido',
      description:
        'Desenvolvimento Web Full Stack: HTML, CSS, JavaScript, TypeScript e lógica de Programação.',
      certificate: true,
      certificateUrl: '',
    },
  ];
}
