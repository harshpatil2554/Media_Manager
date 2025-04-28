'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Send, Menu as MenuIcon, Image as ImageIcon, X, Paperclip, Download, Heart, Laugh, Frown, Skull, ThumbsUp } from "lucide-react"
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserProfileModal from '@/components/chat/UserProfileModal'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firsbase'
import { upload } from '@/lib/helpers/upload/upload'
import { Input } from '../ui/input'
import { toast } from '@/hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatAreaProps {
  selectedChat: any
  data: any
  setIsSidebarOpen: any
}

const reactionEmojis = [
  { icon: Heart, name: 'heart' },
  { icon: Laugh, name: 'laugh' },
  { icon: Frown, name: 'sad' },
  { icon: Skull, name: 'skeleton' },
  { icon: ThumbsUp, name: 'thumbsup' },
]

export default function Component({ selectedChat, data, setIsSidebarOpen }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);



  useEffect(() => {
    setMessages([])
    if (selectedChat == null) return;

    const msgId = selectedChat.messageId;
    const unsub = onSnapshot((doc(db, "messages", msgId)), (res: any) => {

      if (res?.data()?.messages?.length > 0) {
        setMessages(res.data().messages)
      }
    })
    return () => {
      unsub()
    }
  }, [selectedChat])

  const handleMessageSend = async () => {
    if (input.trim().length === 0 && !tempImage && !tempFile) return;

    try {
      let messageContent: any = {
        sId: data.uid,
        createdAt: new Date(),
        reactions: {}
      };

      if (tempImage) {
        const fileUrl = await upload(tempImage);
        messageContent.image = fileUrl;
        messageContent.fileName = tempImage.name;
      } else if (tempFile) {
        const fileUrl = await upload(tempFile);
        messageContent.file = fileUrl;
        messageContent.fileName = tempFile.name;
      } else {
        messageContent.text = input;
      }

      await updateDoc(doc(db, "messages", selectedChat.messageId), {
        messages: arrayUnion(messageContent)
      })

      const ids = [selectedChat.rId, data.uid]

      ids.forEach(async (id: any) => {
        const userRef = doc(db, "chats", id)
        const userChatSnapshot = await getDoc(userRef)
        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data()
          const chatIndex = userChatData.chatData.findIndex((c: any) => {
            return c.messageId === selectedChat.messageId
          })
          userChatData.chatData[chatIndex].lastMessage = tempImage ? `image-${tempImage.name}` : tempFile ? `file-${tempFile.name}` : input.slice(0, 30)
          userChatData.chatData[chatIndex].updatedAt = Date.now()

          if (userChatData.chatData[chatIndex].rId == data.uid) {
            userChatData.chatData[chatIndex].messageSeen = false;
          }

          await updateDoc(userRef, {
            chatData: userChatData.chatData
          })
        }
      })

      setInput("")
      setTempImage(null)
      setTempImagePreview(null)
      setTempFile(null)
      
     if(tempImage){
      toast({
        title: "Success!",
        description: "Image sent sucessfully !"
      })
     }else if(tempFile){
      toast({
        title: "Success!",
        description: "File sent sucessfully !"
      })
     }
    } catch (error) {
      console.log('error in sending message:', error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to send message",
      })
    }

    if (messagesEndRef.current) {
messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
}
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempImage(file);
    setTempFile(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempFile(file);
    setTempImage(null);
    setTempImagePreview(null);
  }

  const removeTempFile = () => {
    setTempFile(null);
  }

  const removeTempImage = () => {
    setTempImage(null);
    setTempImagePreview(null);
  }

  const handleDownload = async (url: string, fileName: string) => {
      window.open(url)
  }

  const handleReaction = async (messageIndex: number, reactionType: string) => {
    try {
      const updatedMessages = [...messages];
      const message = updatedMessages[messageIndex];
      
      if (!message.reactions) {
        message.reactions = {};
      }

      if (message.reactions[reactionType]?.includes(data.uid)) {
        // Remove the reaction if it already exists
        message.reactions[reactionType] = message.reactions[reactionType].filter((id: string) => id !== data.uid);
      } else {
        // Add the reaction
        if (!message.reactions[reactionType]) {
          message.reactions[reactionType] = [];
        }
        message.reactions[reactionType].push(data.uid);
      }

      await updateDoc(doc(db, "messages", selectedChat.messageId), {
        messages: updatedMessages
      });

      setMessages(updatedMessages);
    } catch (error) {
      console.log('error in adding reaction:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to add reaction",
      })
    }
  }

  const formatMessageTime = (createdAt: { seconds: number; nanoseconds: number }) => {
    const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    return `${hours}:${minutes} | ${day} ${month}`;
    };

  return (
    <div className="flex-grow flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen((prev: any) => !prev)}>
            <MenuIcon className="h-6 w-6" />
          </Button>
          {selectedChat ? (
            <UserProfileModal messages={messages} profileData={selectedChat.userData} profileOpen={profileOpen} setProfileOpen={setProfileOpen}>
              <div className='flex gap-2 items-center cursor-pointer' onClick={() => { setProfileOpen(true) }}>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={selectedChat.userData.avatar} alt={selectedChat.userData.name} />
                  <AvatarFallback>{selectedChat.userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-semibold text-slate-700 truncate max-w-[150px] sm:max-w-[200px] md:max-w-full">{selectedChat.userData.name}</h1>
              </div>
            </UserProfileModal>
          ) : (
            <h1 className="text-xl font-bold">Select a contact</h1>
          )}
        </div>
      </header>

      <ScrollArea className="flex-grow p-4 h-[calc(100vh-160px)]">
        <div className="space-y-7">
          {messages.length == 0 && selectedChat != null ?
            <div className='font-semibold text-gray-500 w-full h-full flex items-center justify-center mt-48'>
              send message to start the conversation !
            </div>
            :
            messages.map((message: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col ${message.sId === data.uid ? 'items-end' : 'items-start'}`}
                >
                   <div className=" flex justify-end  text-[10px] text-gray-500 mb-[2px]">
  {formatMessageTime(message.createdAt)}
</div>
                  <div className={`flex items-end ${message.sId === data.uid ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex relative flex-col">
                      {
                        message["image"] ? (
                          <div className="relative group">
                            <Image 
                              alt='img' 
                              src={message.image} 
                              width={150} 
                              height={200} 
                              className='rounded-lg cursor-pointer max-w-[200px] sm:max-w-[250px] md:max-w-[300px]' 
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <Download onClick={() => handleDownload(message.image, message.fileName || 'image.jpg')} className="text-white cursor-pointer" />
                            </div>
                          </div>
                        ) : message["file"] ? (
                          <div 
                            className="flex items-center p-2 bg-blue-100 rounded-lg cursor-pointer group max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
                            onClick={() => handleDownload(message.file, message.fileName)}
                          >
                            <Paperclip className="mr-2 flex-shrink-0" size={15} />
                            <span className="truncate">{message.fileName}</span>
                            <Download size={20} className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                        ) : (
                          <div className={`max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-lg p-3 ${message.sId !== data.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} >
                            {message.text}
                          </div>
                        )
                      }
                      <div className={`flex mt-1 absolute bottom-[-10px] right-0 space-x-1 border-[2px] bg-white rounded-full border-white ${message.sId === data.uid ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(message.reactions || {}).map(([type, users]: [string, any]) => (
                          users.length > 0 && (
                            <div key={type} className="flex items-center bg-gray-200 rounded-full px-1 py-0.5 text-xs">
                              {React.createElement(reactionEmojis.find(emoji => emoji.name === type)?.icon || 'span', { size: 10 })}
                              <span className="ml-0.5 text-[10px]">{users.length}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0 mx-1">
                          <span className="text-xs">+</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-1">
                        <div className="flex space-x-1">
                          {reactionEmojis.map((emoji) => (
                            <Button
                              key={emoji.name}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleReaction(index, emoji.name)}
                            >
                              <emoji.icon className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                 
                </div>
              )
            })
          }
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {tempImagePreview && (
          <div className="relative w-32 h-32 mb-2">
            <Image src={tempImagePreview} alt="Temp" layout="fill" objectFit="cover" className="rounded-lg" />
            <button
              onClick={removeTempImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {tempFile && (
          <div className="flex items-center mb-2 p-2 bg-blue-100 rounded-lg">
            <Paperclip className="mr-2 flex-shrink-0" />
            <span className="truncate">{tempFile.name}</span>
            <button
              onClick={removeTempFile}
              className="ml-2 bg-red-500 text-white rounded-full p-1 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMessageSend()
          }}
          className="flex space-x-2 items-center"
        >
          <Input
            type="text"
            placeholder={selectedChat ? "Type a message..." : "Select a contact to start chatting"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow outline-none border-none"
            disabled={!selectedChat}
          />
          <Input onChange={handleImageSelect} id='image-input' type='file' accept='image/png, image/jpeg' hidden className={`hidden`} />
          <Label htmlFor='image-input'>
            <ImageIcon size={30} className={`cursor-pointer ${selectedChat != null ? 'text-black' : 'text-gray-500 cursor-not-allowed'}`} />
          </Label>
          <Input onChange={handleFileSelect} id='file-input' type='file' hidden className={`hidden`} />
          <Label htmlFor='file-input'>
            <Paperclip size={30} className={`cursor-pointer ${selectedChat != null ? 'text-black' : 'text-gray-500 cursor-not-allowed'}`} />
          </Label>
          <Button type="submit" className='h-[30px] w-[30px]' disabled={!selectedChat}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}