'use client'

import { Progress } from '@nextui-org/react'
import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  delay: number
  onComplete: () => void
}

export const CountdownTimer = ({ delay, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(delay)
  const progress = ((delay - timeLeft) / delay) * 100

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete])

  return (
    <div className="w-full max-w-2xl">
      <Progress
        aria-label="倒计时"
        value={progress}
        className="max-w-2xl"
        color="primary"
        showValueLabel
        label={`${timeLeft} 秒后跳转`}
      />
    </div>
  )
}
