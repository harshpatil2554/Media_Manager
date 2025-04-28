"use client"

import { motion } from "framer-motion"

interface CircularLoaderProps {
  size?: number
  strokeWidth?: number
  className?:string

}

export default function Loader({
    className ,
  size = 40,
  strokeWidth = 4,
}: CircularLoaderProps = {}) {
  return (
    <div className="flex items-center justify-center">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          className={`${className} stroke-current`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0.25, opacity: 1 }}
          animate={{
            pathLength: [0.25, 1, 0.25],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.svg>
    </div>
  )
}