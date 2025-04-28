'use client'

import {  useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { login, loginWithGithub, loginWithGoogle, signup } from '@/lib/helpers/auth/auth'

import { Button } from "@/components/ui/button"
import { ToastAction } from '../ui/toast'
import { toast } from '@/hooks/use-toast'

export default function AuthCard() {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")



  const handleSignup=async (e:any)=>{
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Password didn't matched",
        action: <ToastAction altText="Please enter the same passwords">Please enter the same passwords</ToastAction>,
      })
     
      return
    }
    try {
      await signup({ name, email, password })
      toast({
        title: "Sucess",
        description: "Account has been created sucessfully ",
      })

    } catch (error :any) {
      console.error("Signup error:", error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } 
  }


  const handleLogin=async (e:any)=>{
  if(e!=null)  e.preventDefault();
    try {
      await login({ email, password })
      toast({
        title: "Sucess",
        description: " logged in sucessfully   ",
      })

    } catch (error :any) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }


  const handleGoogleAuth=async ()=>{
    try {
      
     await loginWithGoogle()
     toast({
      title: "Sucess",
      description: "logged in sucessfully ",
    })
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }

  const handleGithubAuth=async ()=>{
    try {
      
     await loginWithGithub()
     toast({
      title: "Sucess",
      description: "logged in sucessfully ",
    })
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  }
  


  return (
    <Card className="w-[350px] h-full " id='auth'>
      <CardHeader>
        <CardTitle>Lets Start</CardTitle>
        <CardDescription>
          Login to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className='flex flex-col gap-4' onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password-login">Password</Label>
                  <Input id="password-login" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <Button   className="w-full" type="submit">
            Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className='flex flex-col gap-4'>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name-signup">Name</Label>
                  <Input id="name-signup" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input id="email-signup" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input id="password-signup" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" type="submit">
          Sign up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
      
        <div className="mt-4 flex flex-col gap-2 w-full">
          <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
            {activeTab === "login" ? "Login with Google" : "Sign up with Google"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGithubAuth}>
            {activeTab === "login" ? "Login with GitHub" : "Sign up with GitHub"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}