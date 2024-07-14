import { Flex, Typography } from 'antd'
import React from 'react'

interface BaseLayoutProps extends React.HTMLAttributes<HTMLElement> {}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, ...props }) => {
  return (
    <div {...props} className='w-full'>
      <Flex vertical gap={40} className='w-full'>
        {props.title && (
          <Typography.Title level={2} className='ml-5 md:m-0'>
            {props.title}
          </Typography.Title>
        )}
        <Flex vertical gap={20}>
          {children}
        </Flex>
      </Flex>
    </div>
  )
}

export default BaseLayout
