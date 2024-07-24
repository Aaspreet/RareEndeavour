
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = JSON.parse(process.env.SERVICE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
