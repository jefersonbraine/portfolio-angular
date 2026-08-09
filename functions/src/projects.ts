import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { FieldValue, getFirestore } from "firebase-admin/firestore";


const adminUid = defineString("ADMIN_UID");

// Função auxiliar para validar Admin e gravar Log
async function validateAdminAndLog(auth: any, action: string, details: string) {
  const expectedUid = adminUid.value() || process.env.ADMIN_UID;

  if (!auth || !auth.uid || auth.uid !== expectedUid) {
    throw new HttpsError('permission-denied', 'Apenas administradores podem realizar esta ação');
  }

  try {
    const db = getFirestore();
    await db.collection('audit_logs').add({
      action,
      details,
      uid: auth.uid,
      timestamp: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao gravar audit log:', error);
    // Não interrompe a ação principal se apenas o log falhar
  }
}

export const createProject = onCall({cors: true}, async (request) => {
  await validateAdminAndLog(request.auth, 'CREATE_PROJECT', `Projeto: ${request.data.title}`);
  const db = getFirestore();
  const docRef = await db.collection('projects').add({
    ...request.data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: docRef.id };
});

export const updateProject = onCall({ cors: true }, async (request) => {
  const { id, data } = request.data;
  await validateAdminAndLog(request.auth, 'UPDATE_PROJECT', `ID: ${id}`);
  const db = getFirestore();
  await db
    .collection('projects')
    .doc(id)
    .update({
      ...data,
      updateAt: FieldValue.serverTimestamp(),
    });
  return { success: true };
});


export const deleteProject = onCall({ cors: true }, async (request) => {
  const { id } = request.data;
  await validateAdminAndLog(request.auth, 'DELETE_PROJECT', `ID: ${id}`);
  const db = getFirestore();
  await db.collection('projects').doc(id).delete();
  return { success: true };
});
