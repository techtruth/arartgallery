import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import webappCredentials from "../../credentials.json";

const app = initializeApp(webappCredentials.firebase);
export const firestore = getFirestore(app);
export const storage = getStorage();
