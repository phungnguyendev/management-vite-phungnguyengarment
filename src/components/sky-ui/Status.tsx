import React from 'react'
import { StatusType } from '~/typing'
import { cn } from '~/utils/helpers'

interface Props extends React.HTMLAttributes<HTMLElement> {
  type: StatusType
  label?: string
}

const Status: React.FC<Props> = ({ ...props }) => {
  return (
    <div {...props} className={cn('flex flex-row items-center gap-2', props.className)}>
      <span
        className={cn('h-[6px] w-[6px] rounded-full', {
          'bg-success': props.type === 'success',
          'bg-error': props.type === 'error',
          'bg-warn': props.type === 'warn',
          'bg-normal': props.type === 'normal'
        })}
      />
      {props.label ? <span>{props.label}</span> : <span>{props.children}</span>}
    </div>
  )
}

export default Status
