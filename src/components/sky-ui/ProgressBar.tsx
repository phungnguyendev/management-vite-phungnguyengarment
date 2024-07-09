import { Progress } from 'antd'
import React from 'react'
import { breakpoint, percentage } from '~/utils/helpers'
import { formatAsPercentage } from '~/utils/number-formatter'
import useDevice from '../hooks/useDevice'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  count: number
  total: number
}

const ProgressBar: React.FC<Props> = ({ count, total, ...props }) => {
  const { width } = useDevice()

  const genColor = (): string => {
    const percent = percentage(total, count)

    if (percent < 25) {
      return 'var(--error)'
    } else if (percent >= 25 && percent < 50) {
      return 'var(--warn)'
    } else if (percent >= 50 && percent < 75) {
      return 'var(--blue)'
    } else if (percent >= 75 && percent < 100) {
      return 'var(--incoming-success)'
    } else {
      return 'var(--success)'
    }
  }

  return (
    <>
      <Progress
        {...props}
        size={width >= breakpoint.xl ? 'default' : 'small'}
        className={props.className}
        percent={percentage(total, count)}
        strokeColor={genColor()}
        format={(percent) => {
          return <>{formatAsPercentage(percent ?? 0)}</>
        }}
      />
    </>
  )
}

export default ProgressBar
