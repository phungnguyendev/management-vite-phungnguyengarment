import { Row, RowProps } from 'antd'
import React from 'react'

const StatisticWrapper: React.FC<RowProps> = ({ ...props }) => {
  return (
    <>
      <Row {...props} gutter={[20, 20]}>
        {props.children}
      </Row>
    </>
  )
}

export default StatisticWrapper
