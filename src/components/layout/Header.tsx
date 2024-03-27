import { CaretDownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Badge, Button, Divider, Dropdown, Flex, Layout, Space, Typography } from 'antd'
import { Bell, Menu } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '~/hooks/useLocalStorage'
import ProfileDialog from '~/pages/user/components/profiles/ProfileDialog'
import { RootState } from '~/store/store'
import { cn, extractEmailName } from '~/utils/helpers'

const { Header: AntHeader } = Layout

interface Props extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean
  onMenuClick: (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

const Header: React.FC<Props> = ({ onMenuClick, ...props }) => {
  const [openProfile, setOpenProfile] = useState<boolean>(false)
  const [, setAccessTokenStored] = useLocalStorage<string>('accessToken', '')
  const [isHidden, setIsHidden] = useState(false)
  const [offsetY, setOffsetY] = useState<number>(0)
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.user)

  // Saving last scroll position
  const lastScrollTop = useRef(0)

  const handleScroll = () => {
    const scrollYOffset = window.scrollY
    setOffsetY(scrollYOffset)
    // Visible/Unvisitable state navbar
    setIsHidden(scrollYOffset > lastScrollTop.current)
    lastScrollTop.current = scrollYOffset
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const items: MenuProps['items'] = [
    {
      label: <a onClick={() => setOpenProfile(true)}>View your profile</a>,
      key: '0'
    },
    // {
    //   label: <a>Change password</a>,
    //   key: '1'
    // },
    {
      type: 'divider'
    },
    {
      label: 'Log out',
      key: '3',
      onClick: () => {
        setAccessTokenStored(null)
        navigate('/login')
      }
    }
  ]

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
        <Button type='link' className='text-foreground hover:text-primary' onClick={onMenuClick}>
          <Menu size={20} />
        </Button>
        <Space split={<Divider type='vertical' />} className='h-full'>
          <Flex>
            <Badge dot>
              <Button shape='circle' icon={<Bell size={20} />} />
            </Badge>
          </Flex>
          <Flex vertical>
            <Dropdown menu={{ items }}>
              <Flex align='center' justify='center' gap={8} className='h-full'>
                {/* <Flex className='h-full'>
                  <Avatar size={32} src={currentUser.user.avatar} />
                </Flex> */}
                <Flex className='h-full'>
                  <Button type='link' className='' onClick={(e) => e.preventDefault()}>
                    <Flex gap={4} justify='center' className='h-full text-foreground'>
                      <Typography.Text className='m-0'>
                        {extractEmailName(currentUser.user.email ?? '')}
                      </Typography.Text>
                      <CaretDownOutlined />
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Dropdown>
          </Flex>
        </Space>
      </Flex>
      <ProfileDialog open={openProfile} setOpen={setOpenProfile} />
    </AntHeader>
  )
}

export default Header
