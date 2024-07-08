import { Col, ColProps } from 'antd'
import React from 'react'

const SkyModalRowItem: React.FC<ColProps> = ({ ...props }) => {
  return (
    <>
      <Col {...props} xs={24}>
        {props.children}
      </Col>
    </>
  )
}

export default SkyModalRowItem
