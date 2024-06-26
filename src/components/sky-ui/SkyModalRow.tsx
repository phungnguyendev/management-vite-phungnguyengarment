import { Row, RowProps } from 'antd'
import React from 'react'
import { cn } from '~/utils/helpers'

const SkyModalRow: React.FC<RowProps> = ({ ...props }) => {
  return (
    <>
      <Row className={cn('w-full pb-10', props.className)} gutter={[20, 20]}>
        {props.children}
      </Row>
    </>
  )
}

export default SkyModalRow
