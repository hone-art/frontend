import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Change to environmental variable?
const firebaseConfig = {
  apiKey: "AIzaSyAyIZmcTZPyYo9wJroZ2jDI7BVQkNXwysM",
  authDomain: "hone-art.firebaseapp.com",
  projectId: "hone-art",
  storageBucket: "hone-art.appspot.com",
  messagingSenderId: "485151310463",
  appId: "1:485151310463:web:c72d899213cfd640bcf54a",
  measurementId: "G-E6Z5YJT8GD"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);