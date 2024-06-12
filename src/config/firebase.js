
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD95ExjDbHMzKAcbM2a_6DedQsAd9e-gJ8",
    authDomain: "bachhoasi-37d21.firebaseapp.com",
    projectId: "bachhoasi-37d21",
    storageBucket: "bachhoasi-37d21.appspot.com",
    messagingSenderId: "1067814855948",
    appId: "1:1067814855948:web:b88a4931bdd363ebb29529",
    measurementId: "G-QXWSLZWY8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
