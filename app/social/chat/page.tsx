'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {  Search, ArrowLeft, UserRoundPlus   } from "lucide-react"
import Menu  from '@/components/social/Menu'
import { useAppContext } from '@/context/AppContext'
import { addChat, inputUserData } from '@/lib/helpers/user/data'
import { toast } from '@/hooks/use-toast'
import {  doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firsbase'
import ChatList from '@/components/chat/ChatList'
import ChatArea from '@/components/chat/ChatArea'
import { useRouter } from 'next/navigation'



export default function Page() {
const {  data} = useAppContext()


  const [chats,setChats]=useState<any | null>(null)
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchText,setSearchText]=useState('')
  const [searchedUsers,setSearchedUsers]=useState<any | null>(null)

  useEffect(()=>{
    
    if(data?.isLoggedIn){
      

      
      const chatRef=doc(db,"chats",data.uid);
      const unsub=onSnapshot(chatRef,async ( res:any)=>{       
        const chatItems=res.data()?.chatData;        
        const tempData=[];

        if(!!chatItems && chatItems.length>0){
          for(const item of chatItems){
            const userRef=doc(db,"users",item.rId);
            const userSnap=await getDoc(userRef)
            const userData=userSnap.data()
            tempData.push({
              ...item,userData
            })
            
          }

        }
        setChats(tempData)

        
      })
      return ()=>{
        unsub()
      }
    }
  },[data])


 
 const handleSearch=async (e:any)=>{
    e.preventDefault()
    if(searchText.trim().length==0) return ;
    try {
      let users=await inputUserData(searchText,data.uid , chats) 
     if(users==null) setSearchedUsers([])
      else {
        setSearchedUsers(users)
      }
  
    } catch (error) {
      setSearchedUsers([])
    }
  }


  const createNewChat=async (usersData  :any , myId :any)=>{
      try {
        await addChat(usersData,myId)

        toast({
          title: "sucess",
          description: "user added to the list sucessfully !!",
        })

        setSearchedUsers(null)
        setSearchText("");
        

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "failed to add user to the list !!",
        })
      }


  }








  return (
    <div className="flex  bg-background">
      {/* Sidebar */}
      <aside className={`border-r w-80 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Contacts</h2>
          <Menu  />
        </div>
        <div className=" flex gap-2 w-full items-center">
      { searchedUsers  &&  <ArrowLeft onClick={()=>{setSearchedUsers(null);setSearchText("")}} className='hover:text-black text-gray-700 cursor-pointer' size={30}  />}
        <form className='py-2 flex gap-2 items-center w-full' action="" onSubmit={handleSearch}>
        <Input
            type="text"
            placeholder="Search users.."
            className="pl-3 w-full"
            value={searchText}
            onChange={(e:any)=>{setSearchText(e.target.value)}}
          />
          <Button variant={'outline'} size={"icon"} onClick={handleSearch} type='submit'><Search className=" left-2  h-full w-full text-black" /></Button>
        </form>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-11rem)]">
        {
           searchedUsers  ?

           searchedUsers.length==0 ? 
           <div className='text-center py-8 font-semibold text-gray-700'>No user found with this name </div>:

          <div>
           {searchedUsers.map((user:any) =>{
            
           return ( 
           <div
              key={user.uid}
              className={`flex items-center p-4 cursor-pointer hover:bg-accent ${selectedChat?.uid == user.uid ? ' bg-accent ' : ''}`}
              >
              
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex justify-between w-full pr-4">
               <div className='flex-grow'>
               <h3 className="font-semibold">{user.name}</h3>
                <p className={`text-[9px] text-gray-600 `}>
                  {user.bio?user.bio:""}
                </p>
               </div>
               <UserRoundPlus size={25} className='text-gray-500 hover:text-black'  onClick={()=>{createNewChat(user,data.uid)}}/>
              </div>
            </div>)
            }
          )}
        </div>

        
          : <ChatList chats={chats} selectedChat={selectedChat} setChats={setChats} setSelectedChat={setSelectedChat} data={data}/>
        
      
      }
      </ScrollArea>
    </aside>

      {/* Main Chat Area */}

      <ChatArea setIsSidebarOpen={setIsSidebarOpen} data={data} selectedChat={selectedChat} />      


    </div>
  )
}