import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const adminUid = defineString('ADMIN_UID');

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

export const createCourse = onCall({ cors: true }, async (request) => {
  await validateAdminAndLog(request.auth, 'CREATE_COURSE', `Curso: ${request.data.title}`);
  const db = getFirestore();
  const docRef = await db.collection('courses').add({
    ...request.data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: docRef.id };
});

export const updateCourse = onCall({ cors: true }, async (request) => {
  const { id, data } = request.data;
  await validateAdminAndLog(request.auth, 'UPDATE_COURSE', `ID: ${id}`);
  const db = getFirestore();
  await db
    .collection('courses')
    .doc(id)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  return { success: true };
});

export const deleteCourse = onCall({ cors: true }, async (request) => {
  const { id } = request.data;
  await validateAdminAndLog(request.auth, 'DELETE_COURSE', `ID: ${id}`);
  const db = getFirestore();
  await db.collection('courses').doc(id).delete();
  return { success: true };
});
