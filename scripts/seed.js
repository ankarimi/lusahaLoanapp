/* scripts/seed.js

Run with:
  FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seed.js

This script creates sample universities, departments, levels, courses and users in the local emulator.
*/

import admin from "firebase-admin";

// Use emulator when FIRESTORE_EMULATOR_HOST is set
if (process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST;
}

// Initialize admin SDK
try {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "campushub-local",
  });
} catch (e) {
  // already initialized
}

const db = admin.firestore();

async function main() {
  console.log("Seeding database...");

  // Universities
  const unis = [
    {
      id: "uni_1",
      name: "State University",
      location: "City A",
      logo_url: "",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "uni_2",
      name: "City College",
      location: "City B",
      logo_url: "",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];

  for (const u of unis) {
    await db.collection("universities").doc(u.id).set(u);
  }

  // Departments and levels and courses
  await db
    .collection("departments")
    .doc("dept_1")
    .set({ id: "dept_1", university_id: "uni_1", name: "Computer Science" });
  await db
    .collection("levels")
    .doc("level_100")
    .set({ id: "level_100", department_id: "dept_1", name: "100 Level" });
  await db
    .collection("courses")
    .doc("cs101")
    .set({
      id: "cs101",
      department_id: "dept_1",
      level_id: "level_100",
      course_code: "CS101",
      course_name: "Intro to CS",
    });

  // Create a super admin, an admin user and a student user in Auth and create profiles
  const auth = admin.auth();

  async function makeUser(email, password, profile) {
    try {
      const user = await auth.createUser({ email, password });
      await db
        .collection("users")
        .doc(user.uid)
        .set({ ...profile, id: user.uid, email });
      console.log("Created", email);
    } catch (err) {
      console.warn("Skipping user creation for", email, err.message);
    }
  }

  await makeUser("super@campus.local", "password", {
    full_name: "Super Admin",
    role: "super_admin",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  await makeUser("admin@stateuni.local", "password", {
    full_name: "State Admin",
    role: "admin",
    university_id: "uni_1",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });
  await makeUser("student@stateuni.local", "password", {
    full_name: "Student One",
    role: "student",
    university_id: "uni_1",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("Seeding finished");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
