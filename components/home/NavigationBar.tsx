"use client"
import { useAppContext } from '@/context/AppContext'
import { toast } from '@/hooks/use-toast'
import { logout } from '@/lib/helpers/auth/auth'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function NavigationBar() {
    const {authUser ,data} = useAppContext()
    
    const handleLogout =async () => {
      
        try {
          await logout()
          
          toast({
           title: "Sucess",
           description: "logged out sucessfully ",
         })
         console.log('logged out , ');
         
        } catch (error:any) {
         toast({
           variant: "destructive",
           title: "Failed.",
           description: error.message,
         })
        }
       };

  return (
    <nav className='text-gray-200 py-5 md:py-0'>
    <ul className="flex space-x-5  justify-center items-center">
      <li><Link href="#features" className=" hover:text-indigo-200">Features</Link></li>
      <li><Link href="#about" className=" hover:text-indigo-200">About</Link></li>
     {data?.isLoggedIn && <button onClick={handleLogout}><span  className=" hover:text-indigo-200">Logout</span></button>}
     {data?.isLoggedIn && 
    <Avatar className="h-10 w-10 mr-4 flex items-center text-black">
       <AvatarImage src={data.avatar} alt={data.name} />
       <AvatarFallback className=''>{data.name?.charAt(0)}</AvatarFallback>
     </Avatar>
     }

    </ul>
  </nav>
  )
}

export default NavigationBar