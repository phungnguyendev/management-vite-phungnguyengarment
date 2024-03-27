import { FC, HTMLAttributes } from 'react'
import { cn } from '~/utils/helpers'

interface Props extends HTMLAttributes<HTMLSpanElement> {}

const DotRequired: FC<Props> = ({ ...props }) => {
  return (
    <span {...props} className={cn('text-error', props.className)}>
      *
    </span>
  )
}

export default DotRequired
