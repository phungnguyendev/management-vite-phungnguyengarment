import { Divider, Flex, FlexProps, Space } from 'antd'
import React from 'react'

interface Props extends FlexProps {}

const SkyTableExpandableLayout: React.FC<Props> = ({ ...props }) => {
  return (
    <Flex vertical className='xl-1/2 w-full overflow-hidden lg:w-2/3'>
      <Space direction='vertical' size={10} split={<Divider className='' />}>
        {props.children}
      </Space>
    </Flex>
  )
}

export default SkyTableExpandableLayout
