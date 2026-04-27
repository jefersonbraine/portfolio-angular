// scripts/set-env.js
const fs = require('fs');
const path = require('path');

const envFile = `
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

const targetPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(targetPath, envFile);
console.log('✅ environment.prod.ts gerado com sucesso!');
