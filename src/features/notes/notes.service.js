import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export const fetchNotesByCourse = async (courseId, universityId) => {
  const q = query(
    collection(db, "notes"),
    where("course_id", "==", courseId),
    where("university_id", "==", universityId),
    where("status", "==", "approved")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const uploadNote = async (payload) => {
  return await addDoc(collection(db, "notes"), {
    ...payload,
    status: "pending",
    created_at: new Date(),
  });
};
