import {auth, db , doc , setDoc ,createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut, signInWithPopup, googleProvider, githubProvider, getDoc} from '@/config/firsbase'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged as OnAuthStateChange } from 'firebase/auth'



type signupData={
    name: string
    email:string
    password:string

}

type loginData={
    email:string
    password:string

}

export const signup= async ({name,email,password}:signupData)=>{
    try {
        if(name.trim().length==0 || email.trim().length==0 || password.trim().length==0) {
            throw new Error("Invalid credentials !!")
        }
        const res=await createUserWithEmailAndPassword(auth,email , password)
        const user=res.user
        await setDoc(doc(db,"users",user.uid),{
                uid:user.uid,
                name,
                avatar:"",
                bio:"Hey there! I am using Media wave",
                lastSeen:Date.now(),
                email,
                createdAt:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
               chatData:[]
        })


        
    } catch (error: any) {
        const firebaseError = error as FirebaseError;

        if (firebaseError.code === 'auth/email-already-in-use') {
            throw new Error("The email address is already in use by another account."); 
        } else if (firebaseError.code === 'auth/invalid-email') {
            throw new Error("The email address is not valid."); 
        } else if (firebaseError.code === 'auth/weak-password') {
            throw new Error("The password is too weak."); 
        } else {
            throw new Error(error.message); 
        }
    }
}
export const login= async ({email,password}:loginData)=>{
    try {
        if( email.trim().length==0 || password.trim().length==0) {
            throw new Error("Invalid credentials !!")
        }
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;

        console.log('Login successful:', user);

    }  catch (error:any) {
        const firebaseError = error as FirebaseError; 

        if (firebaseError.code === 'auth/user-not-found') {
            throw new Error("No user found with this email."); 
        } else if (firebaseError.code === 'auth/wrong-password') {
            throw new Error("Password didn't matched ."); 
        }  else if (firebaseError.code === 'auth/invalid-credential') {
            throw new Error(" Invalid credentials "); 
        } 
        else {
            throw new Error(error.message); 
        }
    }
}



export const logout=async ()=>{
    try {
        
      await  signOut(auth)
    } catch (error) {
        console.log('failed to logout',error);
        throw new Error("Failed to logout ")
        
    }
}
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            createdAt:Date.now(),
            lastSeen:Date.now()

        }, { merge: true });

        const chatRef = doc(db, "chats", user.uid);
        
        // Check if chat document already exists
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
            await setDoc(chatRef, {
                chatData: []
            });
        }

        return user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw new Error("failed to login with google account ");
    }
};

// GitHub Login
export const loginWithGithub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            createdAt:Date.now(),
            lastSeen:Date.now()

        }, { merge: true });

        const chatRef = doc(db, "chats", user.uid);
        
        // Check if chat document already exists
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
            await setDoc(chatRef, {
                chatData: []
            });
        }

        return user;
    } catch (error) {
        console.error("Error during Github sign-in:", error);
        throw new Error("failed to login with github account ");
    }
};




  export const onAuthStateChange=(cb:any)=> {
    return OnAuthStateChange(auth, cb);
}




