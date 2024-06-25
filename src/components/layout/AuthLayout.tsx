import { Flex, Typography } from 'antd'
import React from 'react'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'

interface Props {
  title?: string
  subTitle?: string
  children: React.ReactNode
}

const AuthLayout: React.FC<Props> = ({ title, subTitle, children }) => {
  useTitle(title ?? 'Phung Nguyen Garment')

  return (
    <Flex className='relative bg-background' align='center' justify='center'>
      <Flex
        vertical
        gap={30}
        align='center'
        className='h-fit w-full rounded-lg bg-white p-10 shadow-lg sm:fixed sm:top-1/2 sm:w-[500px] sm:-translate-y-1/2'
      >
        <Flex vertical align='center' className='relative h-fit w-full' justify='center'>
          <img src={logo} alt='logo' className='h-24 w-24 object-contain' />
          <Flex vertical align='center'>
            <Typography.Title className='text-center' level={3}>
              {title}
            </Typography.Title>
            <Typography.Text type='secondary'>{subTitle}</Typography.Text>
            {/* Please fill in your account information! */}
          </Flex>
        </Flex>
        {children}
      </Flex>
    </Flex>
  )
}

export default AuthLayout
