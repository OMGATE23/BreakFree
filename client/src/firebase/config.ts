import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAGGFROlNLbKFXs4h8yHWvIEvHl0a9wZI",
  authDomain: "reading-list-app-2018f.firebaseapp.com",
  projectId: "reading-list-app-2018f",
  storageBucket: "reading-list-app-2018f.appspot.com",
  messagingSenderId: "664785348522",
  appId: "1:664785348522:web:ba73587bf65f9e884f2dd3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { auth, provider, db };
