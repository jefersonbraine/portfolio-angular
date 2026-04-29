import * as admin from 'firebase-admin';

// inicializa o Firebase Admin uma única vez
admin.initializeApp();

//Exporta todas as cloud functions
export { importFromGithub } from './github.import';

// Exporta as novas funções de Projetos
export { createProject, updateProject, deleteProject } from './projects';
