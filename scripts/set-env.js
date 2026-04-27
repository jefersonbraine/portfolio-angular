// scripts/set-env.js
const fs = require('fs');
const path = require('path');

const envContent = `
export const environment = {
  production: true,
  firebase: {
    apiKey:            '${process.env.FIREBASE_API_KEY}',
    authDomain:        '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId:         '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket:     '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId:             '${process.env.FIREBASE_APP_ID}',
    measurementId:     '${process.env.FIREBASE_MEASUREMENT_ID}'
  },
  adminUid:  '${process.env.ADMIN_UID}',
  adminPath: '${process.env.ADMIN_PATH}',
  cloudinary: {
    cloudName:    '${process.env.CLOUDINARY_CLOUD_NAME}',
    uploadPreset: '${process.env.CLOUDINARY_UPLOAD_PRESET}'
  }
};
`;

// Gera os dois arquivos
const envDir = path.join(__dirname, '..', 'src', 'environments');

// Cria a pasta se não existir
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), envContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), envContent);

console.log('✅ environment.ts e environment.prod.ts gerados com sucesso!');
