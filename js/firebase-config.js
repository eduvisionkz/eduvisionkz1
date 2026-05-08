// firebase-config.js — Firebase v10 modular (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBibTnyNO1PlkoSekpltUJSv8zURcVOO_o",
  authDomain: "eduvisionkz-45ac3.firebaseapp.com",
  projectId: "eduvisionkz-45ac3",
  storageBucket: "eduvisionkz-45ac3.firebasestorage.app",
  messagingSenderId: "870984996716",
  appId: "1:870984996716:web:dd301c331e181bdd440549"
};

const app = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);
