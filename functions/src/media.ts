import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
const cloudinary = require('cloudinary').v2;

const adminUid = defineString('ADMIN_UID');

// Configuramos o Cloudinary usando as variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Passamos o objeto de configuração { cors: true } como 1º argumento
export const getCloudinarySignature = onCall(
  {
    cors: [
      'https://www.jefersonbraineleal.dev',
      'https://jefersonbraineleal.dev',
      'http://localhost:4200',
    ],
  },
  async (request) => {
    // 1. Validação de segurança (Só o admin pede assinatura)
    if (!request.auth || request.auth.uid !== adminUid.value()) {
      throw new HttpsError('permission-denied', 'Acesso negado.');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'portfolio';

    // 2. Geramos a assinatura usando o utilitário do Cloudinary
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    // 3. Retornamos os dados para o Frontend fazer o upload
    return {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    };
  },
);
