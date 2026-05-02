# Jeferson Braine Leal | Portfolio Angular

<p align="center">
  <img src="public/assets/banner-portfolio.png" alt="Banner do portfolio Angular" width="100%" />
</p>

<p align="center">
  <a href="https://angular.dev/"><img alt="Angular 21" src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a>
  <a href="https://firebase.google.com/"><img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Functions-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"></a>
</p>

<p align="center">
  Um portfolio construído para apresentar trabalho real com impacto visual, narrativa técnica e um painel administrativo privado para gerenciar conteúdo com autonomia.
</p>

## Sobre o projeto

Este projeto é o portfolio pessoal de Jeferson Braine Leal recriado em Angular com uma proposta clara: unir apresentação premium, arquitetura moderna e um fluxo real de gestão de conteúdo.

Aqui o portfolio não funciona como uma simples página estática. Ele foi pensado como um produto:

- uma landing page forte, responsiva e com identidade própria
- uma vitrine dinâmica de projetos e cursos carregados do Firestore
- um painel administrativo protegido para atualizar conteúdo sem mexer manualmente no código
- uma base preparada para autenticação, upload de imagens, auditoria e operações seguras

## O que torna esse projeto especial

- Design com presença, transições suaves e navegação por seções
- Experiência pública construída para contar história, não apenas listar links
- Seção de projetos com filtros, modal detalhado, tecnologias, contexto, solução e aprendizados
- Área administrativa privada com login Google restrito e dashboard exclusivo
- Integração com Firebase Authentication, Firestore e Cloud Functions
- Upload seguro de imagens com Cloudinary
- Estrutura Angular moderna com standalone components, signals e control flow nativo

## Experiência da aplicação

### Landing pública

- Hero section com direção visual forte
- navegação por hash entre `Home`, `Formação`, `Cursos`, `Projetos`, `Sobre mim` e `Contato`
- projetos renderizados dinamicamente a partir do banco
- modal de case study para aprofundar cada projeto
- embed de vídeo para demonstrações
- formulário de contato com validação e sanitização

### Painel admin

- login privado em rota administrativa personalizada
- autenticação com Google via Firebase Auth
- dashboard com navegação por áreas
- gerenciamento de projetos
- gerenciamento de cursos
- importação de repositórios do GitHub
- upload de imagens para uso nos conteúdos

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | Angular 21, TypeScript 5.9 |
| UI | Tailwind CSS 4, CSS componentizado |
| Estado | Signals, computed, control flow do Angular |
| Backend | Firebase Auth, Firestore, Cloud Functions |
| Upload | Cloudinary |
| SSR / Runtime | Angular SSR, Express |
| Qualidade | Vitest, jsdom, Prettier |
| Scripts | Node.js, ts-node, firebase-admin |

## Arquitetura

```text
src/
  app/
    core/             # auth, guards, interceptors e serviços
    features/
      landing/        # experiência pública + painel admin
      projects/       # páginas dedicadas de projeto
    layout/           # navbar e footer
    shared/           # UI reutilizável e validações
  environments/
scripts/              # setup de ambiente e migração de dados
public/assets/        # banner, logo e imagem de perfil
```

## Recursos técnicos

- autenticação protegida por UID administrador
- guard de rota para o painel privado
- timeout de sessão por inatividade
- rate limit para tentativas de login
- interceptors para autenticação e proteção de requests
- sanitização de entradas antes de persistência
- auditoria de operações importantes

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/jefersonbraine/portfolio-angular.git
cd portfolio-angular
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o projeto

```bash
npm start
```

Abra no navegador:

```text
http://localhost:4200
```

## Variáveis de ambiente

O projeto usa geração automática de `environment.ts` e `environment.prod.ts` via `scripts/set-env.js`.

Variáveis utilizadas:

```bash
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_MEASUREMENT_ID
ADMIN_UID
ADMIN_PATH
CLOUDINARY_CLOUD_NAME
CLOUDINARY_UPLOAD_PRESET
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | inicia o servidor de desenvolvimento |
| `npm run build` | gera a build do projeto |
| `npm run build:prod` | gera os environments e executa a build de produção |
| `npm run watch` | build em modo observação |
| `npm test` | executa os testes |
| `npm run serve:ssr:portfolio-angular` | serve a build SSR gerada |

## Seed e migração

O projeto inclui um script de migração em `scripts/migrate-data.ts` para popular o Firestore com dados iniciais, especialmente cursos e projetos.

Execução sugerida:

```bash
npx ts-node --project scripts/tsconfig.json scripts/migrate-data.ts
```

## Assets do projeto

- `public/assets/banner-portfolio.png`
- `public/assets/logo/logoSigla.svg`
- `public/assets/profile-picture/eu.jpg`

## Repositório

```text
https://github.com/jefersonbraine/portfolio-angular
```

## Autor

**Jeferson Braine Leal**  
Engenheiro de Software

- GitHub: [github.com/jefersonbraine](https://github.com/jefersonbraine)
- LinkedIn: [linkedin.com/in/jefersonbraineleal](https://linkedin.com/in/jefersonbraineleal)
- Email: [jefersonbraineleal@gmail.com](mailto:jefersonbraineleal@gmail.com)

---

<p align="center">
  Design forte na frente. Estrutura séria por trás.
</p>
