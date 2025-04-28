'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const newText = '404'.split('').map(char => 
        Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
      ).join('')
      setGlitchText(newText)
    }, 100)

    return () => clearInterval(glitchInterval)
  }, [])

  const router=useRouter()
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <motion.h1 
        className="text-8xl font-bold mb-4 font-mono"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {glitchText}
      </motion.h1>
      <motion.p 
        className="text-2xl mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Oops! Page Not Found
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
          <button onClick={()=>{router.back()}}>
          Back
          </button>
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}