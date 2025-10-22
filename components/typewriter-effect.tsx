"use client"

import { useState, useEffect } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  className?: string
}

export function TypewriterEffect({ text, speed = 100, className = "" }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      // Hide cursor after typing is complete
      const timeout = setTimeout(() => {
        setShowCursor(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  // Reset when text changes
  useEffect(() => {
    setDisplayText("")
    setCurrentIndex(0)
    setShowCursor(true)
  }, [text])

  return (
    <span className={className}>
      {displayText.split(" ").map((word, index) => {
        const isGreenWord = ["énergétiques", "energy"].includes(word.toLowerCase())
        return (
          <span key={index} className={isGreenWord ? "text-akili-green" : ""}>
            {word}
            {index < displayText.split(" ").length - 1 ? " " : ""}
          </span>
        )
      })}
      {showCursor && <span className="typewriter-cursor">|</span>}
    </span>
  )
}
