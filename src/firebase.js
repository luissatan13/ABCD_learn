import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Reemplazar con la configuración de Firebase de la consola
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "studio-3644374455-4c9fb.firebaseapp.com",
  projectId: "studio-3644374455-4c9fb",
  storageBucket: "studio-3644374455-4c9fb.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
