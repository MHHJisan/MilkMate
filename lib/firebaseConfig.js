// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNCy5K2WEwn8uWiO6b5oNxNyDYx_UmK1U",
  authDomain: "milkmate-c8315.firebaseapp.com",
  projectId: "milkmate-c8315",
  storageBucket: "milkmate-c8315.appspot.com",
  messagingSenderId: "781918842825",
  appId: "1:781918842825:web:549710c04aaa5f36e80218",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
