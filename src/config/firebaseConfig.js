import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore"; // Import Timestamp and FieldValue
import { getAuth } from "firebase-admin/auth";
import path from "path";
import { fileURLToPath } from "url"; // Import for ES module compatibility
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get the directory name for the current module
const __filename = fileURLToPath(import.meta.url); // Get the current file's URL
const __dirname = path.dirname(__filename); // Extract directory path

// Path to your serviceAccountKey.json file
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Initialize Firebase Admin SDK
const firebaseApp = initializeApp({
    credential: cert(serviceAccountPath),
});

// Export Firestore and Auth instances
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Export Timestamp and FieldValue for use in your Firestore operations
export { firebaseApp, db, auth, Timestamp, FieldValue };
