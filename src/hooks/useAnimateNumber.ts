import { useEffect, useRef } from 'react'

export default function useAnimateNumber(end: number, duration: number) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element: HTMLDivElement | null = elementRef.current
    if (!element) return

    let startTime: number | null = null

    function animate(currentTime: number) {
      if (!startTime) startTime = currentTime
      const progress = currentTime - startTime
      const increment = easeInOutQuad(progress, 0, end, duration)

      element!.innerText = Math.floor(increment).toString()

      if (progress < duration) {
        requestAnimationFrame(animate)
      } else {
        element!.innerText = end.toString()
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  function easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  return elementRef
}
