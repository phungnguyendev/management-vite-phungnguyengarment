import { useEffect, useState } from 'react'

const useCountdownTimer = (initialTime: number) => {
  const [time, setTime] = useState<number>(initialTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer)
          return 0
        } else {
          return prevTime - 1
        }
      })
    }, 1000)

    // Clear the interval when component unmounts
    return () => clearInterval(timer)
  }, [initialTime])

  return [time, setTime] as const
}

export default useCountdownTimer
