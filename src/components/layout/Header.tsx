import { CaretDownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { App as AntApp, Badge, Button, Divider, Dropdown, Flex, Layout, Space, Typography } from 'antd'
import { Bell, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import useAuthService from '~/hooks/useAuthService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setLoading } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { cn, extractEmailName } from '~/utils/helpers'
import useScroll from '../hooks/useScroll'

const { Header: AntHeader } = Layout

interface Props extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
  onMenuClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

const Header: React.FC<Props> = ({ onMenuClick, ...props }) => {
  const { message } = AntApp.useApp()
  const [, setOpenProfile] = useState<boolean>(false)
  const [refreshTokenStored] = useLocalStorage('refreshToken', '')
  const { isHidden, offsetY } = useScroll()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authService = useAuthService(AuthAPI)
  const userState = useSelector((state: RootState) => state.user)

  const items: MenuProps['items'] = [
    {
      label: <a onClick={() => setOpenProfile(true)}>View your profile</a>,
      key: '0'
    },
    {
      type: 'divider'
    },
    {
      label: 'Log out',
      key: '3',
      onClick: () => handleLogout()
    }
  ]

  const handleLogout = async () => {
    try {
      if (!refreshTokenStored || refreshTokenStored.length <= 0) throw new Error(`Refresh token unavailable!`)
      await authService.logout(refreshTokenStored, (loading) => dispatch(setLoading(loading)))
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userTemp')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      navigate('/login')
    }
  }

  return (
    <AntHeader>
      <Flex
        {...props}
        className={cn('fixed left-0 right-0 top-0 z-[999] min-h-[52px] bg-white px-5 transition-all duration-300', {
          'shadow-sm': offsetY > 1,
          '-translate-y-full': isHidden && offsetY > 52,
          'top-0': !isHidden
        })}
        justify='space-between'
        align='center'
      >
        <Button type='primary' className='group' onClick={onMenuClick} icon={<Menu size={24} />} />
        <Space split={<Divider type='vertical' />} className='h-full'>
          <Flex>
            <Badge dot>
              <Button shape='circle' icon={<Bell size={20} />} />
            </Badge>
          </Flex>
          <Flex vertical>
            <Dropdown menu={{ items }}>
              <Flex align='center' justify='center' gap={8} className='h-full'>
                <Flex className='h-full'>
                  <Button type='link' className='' onClick={(e) => e.preventDefault()}>
                    <Flex gap={4} justify='center' className='h-full text-foreground'>
                      <Typography.Text className='m-0'>{extractEmailName(userState.user?.email ?? '')}</Typography.Text>
                      <CaretDownOutlined />
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Dropdown>
          </Flex>
        </Space>
      </Flex>
    </AntHeader>
  )
}

export default Header
