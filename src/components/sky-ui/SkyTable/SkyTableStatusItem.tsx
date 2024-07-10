import { Typography } from 'antd'
import { BlockProps } from 'antd/es/typography/Base'
import React from 'react'

const SkyTableStatusItem: React.FC<BlockProps> = ({ ...props }) => {
  return (
    <>
      <Typography.Text {...props} className='' type='success' code>
        {props.children}
      </Typography.Text>
    </>
  )
}

export default SkyTableStatusItem
