import { Divider, Flex, FlexProps, Space } from 'antd'
import React from 'react'

interface Props extends FlexProps {}

const SkyTableExpandableLayout: React.FC<Props> = ({ ...props }) => {
  return (
    <>
      <Flex {...props} vertical className='w-full lg:w-1/2'>
        <Space direction='vertical' size={10} split={<Divider className='my-0 w-full py-0' />}>
          {props.children}
        </Space>
      </Flex>
    </>
  )
}

export default SkyTableExpandableLayout
