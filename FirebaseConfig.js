import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBS4zGTyryfAouejlnR8-1Ux33EyR3P4ew",
  authDomain: "tomatoesapplication-4d135.firebaseapp.com",
  projectId: "tomatoesapplication-4d135",
  storageBucket: "tomatoesapplication-4d135.appspot.com",
  messagingSenderId: "559262389891",
  appId: "1:559262389891:web:2146fb2a809fab6c536db6"
};

const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


export default db;