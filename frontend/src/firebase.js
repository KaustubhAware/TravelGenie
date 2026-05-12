import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGi-zc5hwEsJD3Q3Q9kh-eS3SpXkw8r_o",
  authDomain: "travelgenie-2f1d8.firebaseapp.com",
  projectId: "travelgenie-2f1d8",
  storageBucket: "travelgenie-2f1d8.firebasestorage.app",
  messagingSenderId: "986282900747",
  appId: "1:986282900747:web:782d243545eea9680b760e",
  measurementId: "G-1XQ9GT5GZ0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);