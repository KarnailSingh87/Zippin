import admin from "firebase-admin";

let firebaseApp = null;
let firebaseAuth = null;
let firebaseMessaging = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      // If provided as a file path
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log("Firebase Admin SDK initialized with project ID");
  } else {
    console.log("Firebase Admin credentials not set yet. Add FIREBASE_SERVICE_ACCOUNT in Render environment variables when ready.");
  }

  if (firebaseApp) {
    firebaseAuth = admin.auth();
    firebaseMessaging = admin.messaging();
  }
} catch (err) {
  console.warn("Firebase Admin initialization deferred:", err.message);
}

export { firebaseApp, firebaseAuth, firebaseMessaging, admin };
