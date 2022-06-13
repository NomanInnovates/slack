// import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/database";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvK40gxpYPs-2SWtqzPTRM7jg_b3zs_OQ",
  authDomain: "slack-clone-e23c4.firebaseapp.com",
  databaseURL: "https://slack-clone-e23c4-default-rtdb.firebaseio.com",
  projectId: "slack-clone-e23c4",
  storageBucket: "slack-clone-e23c4.appspot.com",
  messagingSenderId: "689610544549",
  appId: "1:689610544549:web:ce7cd9646853f0af93844c",
  measurementId: "G-Z89MX1BYJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export  const auth = app.auth();
export const database = app.database();

// export const db = app.firestore();
// export const storage = firebase.storage();
// export const authen = firebase.auth();

// const analytics = getAnalytics(app);
