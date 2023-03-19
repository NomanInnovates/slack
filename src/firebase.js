// import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { initializeApp } from "firebase/app";
import "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  measurementId: "G-Z89MX1BYJJ",
  projectId: "slack-clone-e23c4",
  messagingSenderId: "689610544549",
  storageBucket: "slack-clone-e23c4.appspot.com",
  authDomain: "slack-clone-e23c4.firebaseapp.com",
  apiKey: "AIzaSyCvK40gxpYPs-2SWtqzPTRM7jg_b3zs_OQ",
  appId: "1:689610544549:web:ce7cd9646853f0af93844c",
  databaseURL: "https://slack-clone-e23c4-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export  const auth = app.auth();
export  const storage = app.storage();
export const database = app.database();
