import { HTMLAttributes } from 'react'
import useAnimateNumber from '~/hooks/useAnimateNumber'

interface AnimatedNumberProps extends HTMLAttributes<HTMLDivElement> {
  end: number
  duration: number
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ end, duration, ...props }) => {
  const elementRef = useAnimateNumber(end, duration)

  return <div ref={elementRef} {...props} className={props.className} />
}

export default AnimatedNumber
