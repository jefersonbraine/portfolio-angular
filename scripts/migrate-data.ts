// scripts/migrate-data.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Aponta para o service account — nunca sobe ao git
import serviceAccount from '../service-account.json';

initializeApp({ credential: cert(serviceAccount as any) });

const db = getFirestore();

// ─── Seus dados atuais do portfólio ───────────────────────────

const courses = [
  {
    title: 'AWS Certified Cloud Practitioner',
    provider: 'Udemy',
    year: '2026',
    hours: '91 horas',
    status: 'Em andamento',
    description:
      'Preparatório para Certificação Amazon AWS Cloud Practitioner para dominar os fundamentos essenciais da computação em nuvem com foco no exame oficial.',
    certificate_url: '',
    order: 1,
  },
  {
    title: 'CCNA: Introduction to Networks - 10ª Onda Ciber Educação Cisco',
    provider: 'Senai-SC & Cisco',
    year: '2025',
    hours: '70 horas',
    status: 'Concluído',
    description:
      'Programa intensivo com foco nos pilares de redes e segurança cibernética, estabelecendo uma base fundamental.',
    certificate_url: '',
    order: 2,
  },
  {
    title: 'Network Security - 10ª Onda Ciber Educação Cisco',
    provider: 'Senai-SC & Cisco',
    year: '2025',
    hours: '70 horas',
    status: 'Concluído',
    description:
      'Aprender a proteger infraestruturas digitais contra ameaças, focando em defesa em camadas, políticas de segurança, criptografia, firewalls e VPNs.',
    certificate_url: '',
    order: 3,
  },
  {
    title: 'Network Defense - 10ª Onda Ciber Educação Cisco',
    provider: 'Senai-SC & Cisco',
    year: '2025',
    hours: '27 horas',
    status: 'Concluído',
    description:
      'Aprender a proteger infraestruturas de rede, focando em identificar vulnerabilidades, monitorar tráfego e reagir a ataques cibernéticos.',
    certificate_url: '',
    order: 4,
  },
  {
    title: 'Técnico em Redes - 10ª Onda Ciber Educação Cisco',
    provider: 'Senai-SC & Cisco',
    year: '2025',
    hours: '70 horas',
    status: 'Concluído',
    description:
      'Aprender a projetar, instalar, configurar e manter redes de computadores, dominando protocolos (IP, DHCP), roteadores, switches e segurança.',
    certificate_url: '',
    order: 5,
  },
  {
    title: 'Desenvolvimento Full Stack com React, Node.js e Next.js',
    provider: 'Full Stack Club',
    year: '2025',
    hours: '90 horas',
    status: 'Concluído',
    description:
      'Curso intensivo de desenvolvimento web moderno com foco em tecnologias atuais do mercado.',
    certificate_url: '',
    order: 6,
  },
  {
    title: 'Santander Bootcamp - FullStack Java + Angular',
    provider: 'DIO',
    year: '2025',
    hours: '116 horas',
    status: 'Concluído',
    description:
      'Intensivo Fullstack com alvo Java, Angular, Banco de dados, Spring Boot, POO, SQL e NoSQL.',
    certificate_url: '',
    order: 7,
  },
  {
    title: 'Desbravando a Web: HTML, CSS, JavaScript e TypeScript',
    provider: 'Udemy',
    year: '2024',
    hours: '36 horas',
    status: 'Concluído',
    description:
      'Desenvolvimento Web Full Stack: HTML, CSS, JavaScript, TypeScript e lógica de Programação.',
    certificate_url: '',
    order: 8,
  },
];

const projects: any[] = [
  // Adicione seus projetos aqui no mesmo formato
  // {
  //   name:        'Nome do projeto',
  //   description: 'Descrição',
  //   codeUrl:     'https://github.com/...',
  //   demoUrl:     '',
  //   videoUrl:    '',
  //   docUrl:      '',
  //   tags:        ['Angular', 'TypeScript'],
  //   order:       1
  // }
];

// ─── Migração ─────────────────────────────────────────────────

async function migrate() {
  console.log('🚀 Iniciando migração...\n');

  // Cursos
  console.log('📚 Migrando cursos...');
  for (const course of courses) {
    await db.collection('courses').add({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ ${course.title}`);
  }

  // Projetos
  console.log('\n🗂️  Migrando projetos...');
  for (const project of projects) {
    await db.collection('projects').add({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✅ ${project.name}`);
  }

  console.log('\n✅ Migração concluída!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Erro na migração:', err);
  process.exit(1);
});
