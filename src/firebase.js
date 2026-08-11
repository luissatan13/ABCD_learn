import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdAbbGB1LjKTIqblQcqQDg0SnmCZpbqbw",
  authDomain: "studio-3644374455-4c9fb.firebaseapp.com",
  projectId: "studio-3644374455-4c9fb",
  storageBucket: "studio-3644374455-4c9fb.firebasestorage.app",
  messagingSenderId: "228851074201",
  appId: "1:228851074201:web:9da0f867e3f8245bb86408"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
