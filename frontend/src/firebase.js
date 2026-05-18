import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  env,
  validateFrontendConfig,
} from "./config/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

const missingConfig = validateFrontendConfig();

if (missingConfig.length > 0) {
  console.warn(
    "TravelGenie Firebase config missing:",
    missingConfig.join(", ")
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);



