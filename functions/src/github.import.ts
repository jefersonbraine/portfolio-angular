// functions/src/github.import.ts
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import fetch from 'node-fetch';
import { checkRateLimit } from './rate-limit';

// Segredos — ficam no Firebase Secret Manager, nunca no código
const githubToken = defineSecret('GITHUB_TOKEN');
const githubUsername = defineString('GITHUB_USERNAME');
const adminUid = defineString('ADMIN_UID');

export const importFromGithub = onCall({ secrets: [githubToken] }, async (request) => {
  // Valida autenticação server-side
  if (!request.auth || request.auth.uid !== adminUid.value()) {
    throw new HttpsError('permission-denied', 'Acesso negado.');
  }

  // Checa rate limit server-side
  try {
    await checkRateLimit(request.auth.uid, 'github_import');
  } catch {
    throw new HttpsError(
      'resource-exhausted',
      'Limite de importações atingido. Tente em 15 minutos.',
    );
  }

  const response = await fetch(
    `https://api.github.com/users/${githubUsername.value()}/repos?sort=updated&per_page=30`,
    {
      headers: {
        Authorization: `token ${githubToken.value()}`,
        Accept: 'application/vnd.github.v3+json',
      },
    },
  );

  if (!response.ok) {
    throw new HttpsError('internal', 'Erro ao acessar a API do GitHub.');
  }

  const repos = (await response.json()) as any[];

  return repos.map((repo) => ({
    name: repo.name,
    description: repo.description || '',
    repoUrl: repo.html_url,
    language: repo.language || '',
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    topics: repo.topics || [],
  }));
});
