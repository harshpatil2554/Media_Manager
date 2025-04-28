import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore , doc , setDoc , getDoc} from "firebase/firestore"
  import { createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , signInWithPopup  , GoogleAuthProvider , GithubAuthProvider} from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_AUTH_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};



const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)

export const db=getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider;
export {doc,setDoc , createUserWithEmailAndPassword ,signInWithEmailAndPassword , signOut , signInWithPopup  , googleProvider, githubProvider , getDoc}


 







// const analytics = getAnalytics(app);



// github client id Ov23lipT7jZe7tuyxFJv
// client secret 7f2fb88c426b0f4ebdfe5b1eafb83d7285f5a1a7