"use client"

import React, { useEffect, useState } from 'react'
import { 

  DropdownMenuItem, 

} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import {  Settings, Upload, Trash2 } from "lucide-react"
import { Input } from '@/components/ui/input'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppContext } from '@/context/AppContext'
import { upload } from '@/lib/helpers/upload/upload'
import { updateProfile } from '@/lib/helpers/user/data'
import { toast } from '@/hooks/use-toast'
import { Textarea } from '../ui/textarea'



function UpdateProfile() {
  const { data ,setData} = useAppContext()
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
    const [name,setName]=useState<null | string>(null)
    const [imageUrl,setImageUrl]=useState<null | string>(null);
    const [bio,setBio]=useState<null | string>(null)

    useEffect(()=>{
        if(!data) return ;

        setName(data.name)
        setImageUrl(imageUrl)
        setBio(data.bio)

    },[data])









  const handleProfileUpdate =async ()=>{
    
    try {
        let avatarUrl = imageUrl
        if (tempImage) {
          const file = await fetch(tempImage).then(r => r.blob()).then(blobFile => new File([blobFile], "avatar", { type: "image/png" }))
          avatarUrl = await upload(file) as string
          console.log("image uploaded sucessfully !!" ,avatarUrl);
          
        }

      await  updateProfile({name,avatar:avatarUrl,bio,uid:data?.uid})
      
      toast({
        title: "Sucess ",
        description: "Profile updated sucessfully !",
      })
      setData({...data,avatar:avatarUrl,bio,name})
      setOpen(false)
    } catch (error) {
        console.log(error);
        
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Failed to update profile ! ",
          })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTempImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }


  

  const handleRemoveImage = () => {
    setTempImage(null)
  }

  const handleCancel = () => {
    setTempImage(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-600">Edit Profile</DialogTitle>
        
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={tempImage || data?.avatar} alt={data?.name} />
              <AvatarFallback>{data?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2">
            <Label  className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={name?name:" "}
              onChange={(e)=>{setName(e.target.value)}} 
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="upload-image" className="text-sm font-medium">
              Profile Picture
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="upload-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button asChild variant="outline" className="flex-1">
                <label htmlFor="upload-image" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </label>
              </Button>
              {tempImage && (
                <Button variant="destructive" onClick={handleRemoveImage} className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Image
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-1.5">
      <Label htmlFor="message">Bio</Label>
        <Textarea placeholder="Type your message here." id="message" onChange={(e)=>{setBio(e.target.value)}} value={bio?bio:" "} />
    </div>
      <div className='flex justify-between gap-4'>
     
          <Button 
            className="w-full mt-4"
              onClick={handleCancel}
              variant={"outline"}
          >
            Cancel
          </Button>
          <Button 
            className="w-full mt-4"
           onClick={()=>{handleProfileUpdate()}}
          >
            Save Changes
          </Button>
      </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfile