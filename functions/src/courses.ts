import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { request } from "https";

const adminUid = defineString("ADMIN_UID");

async function validateAdminAndLog(auth: any, action: string, details: string) {
  if (!auth || auth.uid !== adminUid.value()) {
    throw new HttpsError("permission-denied", "Acesso negado");
  }
  const db = getFirestore();
  await db.collection('audit_logs').add({
    action,
    details,
    uid: auth.uid,
    timeStamp: FieldValue.serverTimestamp(),
  });
}

export const createCourse = onCall(async (request) =>  {
  await validateAdminAndLog(request.auth, 'CREATE_COURSE', `Curso: ${request.data.title}`);
  const db = getFirestore();
const docRef = await db.collection('courses').add({
  ...request.data,
  createdAt: FieldValue.serverTimestamp(),
});
  return { id: docRef.id };
});

export const updateCourse = onCall(async (request) => {
  const { id, data } = request.data;
  await validateAdminAndLog(request.auth, 'UPDATE_COURSE', `ID: ${id}`);
  const db = getFirestore();
  await db.collection('courses').doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { success: true };
})

export const deleteCourse = onCall(async (request) => {
  const { id } = request.data;
  await validateAdminAndLog(request.auth, 'DELETE_COURSE', `ID: ${id}`);
  const db = getFirestore();
  await db.collection('courses').doc(id).delete();
  return { success: true };
});
