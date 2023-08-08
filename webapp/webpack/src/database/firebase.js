import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import webappCredentials from "../../credentials.json";

const app = initializeApp(webappCredentials.firebase);
const firestore = getFirestore(app);

export firestore;
