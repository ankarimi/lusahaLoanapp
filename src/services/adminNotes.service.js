import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";

export const assignUserUniversityAndRole = async ({
  targetUserId,
  university_id,
  role,
}) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  const adminSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

  if (!adminSnap.exists()) throw new Error("Admin profile missing");

  await updateDoc(doc(db, "users", targetUserId), {
    university_id,
    role,
  });
};

export const approveNote = async (noteId) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "notes", noteId), {
    status: "approved",
    approved_at: serverTimestamp(),
  });
};

export const rejectNote = async (noteId, reason) => {
  if (!auth.currentUser) throw new Error("Not authenticated");

  await updateDoc(doc(db, "notes", noteId), {
    status: "rejected",
    rejection_reason: reason,
    rejected_at: serverTimestamp(),
  });
};
