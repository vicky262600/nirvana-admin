// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvpbI6OjXLjYdmoH1nWYJyDPf9HAgRgPY",
  authDomain: "rira-social-media.firebaseapp.com",
  projectId: "rira-social-media",
  storageBucket: "rira-social-media.appspot.com",
  messagingSenderId: "33921742968",
  appId: "1:33921742968:web:c0f3c3bf16ad0983b9158d",
  measurementId: "G-RDQ0WVSMWT"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
