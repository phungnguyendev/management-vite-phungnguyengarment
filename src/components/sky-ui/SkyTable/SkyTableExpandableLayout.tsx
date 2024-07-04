import { Divider, Flex, FlexProps, Space } from 'antd'
import React from 'react'

interface Props extends FlexProps {}

const SkyTableExpandableLayout: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex vertical className='w-full'>
      <Space direction='vertical' className='w-full' size={10} split={<Divider className='my-2' />}>
        {props.children}
      </Space>
    </Flex>
  )
}

export default SkyTableExpandableLayout
