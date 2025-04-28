import {getDownloadURL, getStorage,ref, uploadBytesResumable} from "firebase/storage"
 

export const upload=async (file:any)=>{
    const storage=getStorage()
    const storageRef=ref(storage,`images/${Date.now()+file.name}`)
    const uploadTask=uploadBytesResumable(storageRef,file)


    return new Promise((resolve,reject )=>{
        
        uploadTask.on('state_changed',(snapshot)=>{
            const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log('progress',progress);
            switch(snapshot.state){ 
                case 'paused':
                    console.log('paused');
                    break;
                case 'running':
                console.log('uploading'); 
                break;
                case 'error':
                throw new Error("failed")
                    
            }
            
        }, 
        (error)=>{
           console.log('error in upload:',error);
            reject()
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                console.log('file available at',url);
                resolve(url ) ;
            })
        }
    )
    })
    

   
}