'use client'

import { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const instructions = [
  {
    title: 'Welcome to Our App',
    content: 'This guide will help you get started with our application. Follow along to learn the basics!'
  },
  {
    title: 'Chat interface',
    content: 'Add user to your chat list by searching their name and clicking add friend icon'
  },
  {
    title: 'Start the chat',
    content: 'After sucessful adding you can now chat with your new friend'
  },
  {
    title: 'Put some emotions!',
    content: 'Along side with chatting you also can react to messages with emojies'
  },
  {
    title: 'file sharing',
    content: 'Cherry on the top is now you can share files and images to people!'
  }
]

export default function Overview({isOpen,setIsOpen}:any) {
  const [currentStep, setCurrentStep] = useState(0)



  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep((currentStep + 1))
    }
    if(currentStep === instructions.length) {
      setIsOpen(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1))
    }
  
  }

  const handleSkip = () => {
    setIsOpen(false)
  }

  return (
    <Popover  open={isOpen} >
      <PopoverTrigger asChild>
        <Button variant="outline" className="hidden">Trigger</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] mt-[30%] ml-[30%]">
        <Card >
          <CardHeader>
            <CardTitle>{instructions[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{instructions[currentStep].content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSkip}>
              Skip
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}