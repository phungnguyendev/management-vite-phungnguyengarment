import { Progress } from 'antd'
import React from 'react'
import { formatAsPercentage } from '~/utils/number-formatter'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  count: number
  total: number
}

const ProgressBar: React.FC<Props> = ({ count, total, ...props }) => {
  const per = (count * 100) / total

  const genColor = (per: number): string => {
    if (per < 25) {
      return 'var(--error)'
    } else if (per >= 25 && per < 50) {
      return 'var(--warn)'
    } else if (per >= 50 && per < 75) {
      return 'var(--blue)'
    } else if (per >= 75 && per < 100) {
      return 'var(--incoming-success)'
    } else {
      return 'var(--success)'
    }
  }

  return (
    <>
      <Progress
        {...props}
        className={props.className}
        percent={per}
        strokeColor={genColor(per)}
        format={(percent) => {
          return <>{formatAsPercentage(percent ?? 0)}</>
        }}
      />
    </>
  )
}

export default ProgressBar
