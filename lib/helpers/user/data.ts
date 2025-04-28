
import {auth, db, doc , getDoc} from '@/config/firsbase'

import { arrayUnion, collection, getDocs, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'

export const loadUserData=async (id:any)=>{
    try {
        const  ref= doc(db,"users",id)
        const userSnap=await getDoc(ref)
        const data=userSnap.data()
        return data;
        
    } catch (error) {
        console.log('error in loading user data');
        throw new Error("failed to load user data")
    }

}



export const updateLastSeen=async (id:any)=>{
    const  ref= doc(db,"users",id)
   console.log('updating lastseen for id',id);
   
    await updateDoc(ref,{
        lastSeen:Date.now()
    })

}

function getUniqueObjects(ar1:any, ar2:any) {

  return ar1.filter((obj1:any) => 
      !ar2.some((obj2:any) => obj2.rId === obj1.uid)
  );
}

export const inputUserData:any = async (namePattern: string, myId: string , existingChats :any[] ) => {
    try {
        const userRef = collection(db, 'users');

        const nameRegex = new RegExp(namePattern, 'i');
        const querySnapshot = await getDocs(userRef);
        const filteredUsers = querySnapshot.docs
            .map((doc) => doc.data())
            .filter((user) => {
                return nameRegex.test(user.name) && user.uid !== myId  ;
            });
            
            if(existingChats==null || existingChats.length==0) return filteredUsers;
            const d=getUniqueObjects(filteredUsers,existingChats);
        return d;
    } catch (error) {
        console.error('Error searching for users:', error);
        return null;
    }
};

export  const addChat = async (user: any, myId: any) => {
    
    const messageRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
  
    try {
      const newMessageRef = doc(messageRef);
  
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });




      await updateDoc(doc(chatRef, myId), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,   // message id is id for list of messages between 2 users 
          lastMessage: "", 
          rId: user.uid,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
  
      // Update chat doc for the other user (user.uid)
      await updateDoc(doc(chatRef, user.uid), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "", 
          rId: myId,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

    } catch (error) {
      console.error("Error adding chat:", error);
      throw new Error("failed to create new chat")
    }
  };




export const updateProfile = async ({ name, bio, avatar ,uid} : any) => {
    try {
       

        if (!uid || uid.trim().length==0 || !name || name.trim().length==0) {
            throw new Error("Fail !");
        }

        const userDocRef = doc(db, "users", uid);
          console.log({name,bio,avatar,uid});
          
        await updateDoc(userDocRef, {
            name:name,
            bio: bio, 
            avatar: avatar 
        });

        console.log("Profile updated successfully.");
    } catch (error:any) {
        console.error("Error updating profile:", error);
        throw new Error(error.message);
    }
};