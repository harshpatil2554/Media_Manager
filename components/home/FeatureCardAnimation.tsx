'use client'
import React, { useEffect, useState  }  from 'react'
import {  Users, Lock, MessageCircle, Zap } from 'lucide-react'
function FeatureCardAnimation() {

    const [activeFeature, setActiveFeature] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveFeature((prev:any) => (prev + 1) % 4)
      }, 1800)
      return () => clearInterval(interval)
    }, [])
    

    


    const features = [
      { icon: MessageCircle, title: "Real-time Messaging", description: "Send and receive messages instantly" },
      { icon: Users, title: "Group Chats", description: "Collaborate with team members easily" },
      { icon: Lock, title: "End-to-End Encryption", description: "Your conversations are secure" },
      { icon: Zap, title: "Rich Media Sharing", description: "Share photos, videos, and files seamlessly" },
    ]

  return (
    <div className="relative h-64 rounded-lg mb-20  ">
    {features.map((feature, index) => (
      <div
        key={feature.title}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          index === activeFeature ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center p-6">
          <feature.icon className="h-16 w-16 text-black mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-black mb-2">{feature.title}</h3>
          <p className="text-purple-800">{feature.description}</p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default FeatureCardAnimation