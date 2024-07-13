import type { MenuProps } from 'antd'
import { App as AntApp, Drawer, Flex, Layout, Menu } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import logo from '~/assets/logo.svg'
import routes from '~/config/route.config'
import useAuthService from '~/hooks/useAuthService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUser, setUserRole } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { User, UserRole, UserRoleType } from '~/typing'
import Footer from './Footer'
import Header from './Header'
import SideIcon from './sidenav/SideIcon'
import SideItem from './sidenav/SideItem'

const { Sider: SiDer, Content } = Layout

export interface Props extends React.HTMLAttributes<HTMLElement> {
  openDrawer: boolean
  setOpenDrawer: (enable: boolean) => void
}

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, type?: 'group'): MenuItem {
  return {
    key,
    icon,
    label,
    type
  } as MenuItem
}

const Main: React.FC<HTMLAttributes<HTMLElement>> = () => {
  const { pathname } = useLocation()
  const [selectedKey, setSelectedKey] = useState<string>(routes[0].key)
  const currentUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const keyFound = routes.find((route) => route.path === pathname)
    if (keyFound) {
      setSelectedKey(keyFound.key)
    }
  }, [pathname])

  const { message } = AntApp.useApp()
  const [loading, setLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [accessToken] = useLocalStorage<string>('accessToken', '')
  const [refreshToken] = useLocalStorage<string>('refreshToken', '')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authService = useAuthService(AuthAPI)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    setLoading(true)
    // Kiểm tra accessToken và refreshToken có tồn tại hay không (Chỉ tổn tại khi người dùng đã đăng nhập)
    try {
      if (
        !accessToken ||
        !refreshToken ||
        (accessToken && accessToken.length <= 0) ||
        (refreshToken && refreshToken.length <= 0)
      )
        throw new Error(`Token stored unavailable!`)
      // Gọi thông tin người dùng từ accessToken và lưu nó vào redux (app state)
      const result = await authService.userInfoFromAccessToken(accessToken, setLoading)
      const data = result.data as { user: User; userRoles: UserRole[] }
      dispatch(setUser(data.user))
      dispatch(
        setUserRole(
          data.userRoles.map((item) => {
            return item.role!.role as UserRoleType
          })
        )
      )
    } catch (error: any) {
      message.error(`${error.message}`)
      navigate('/login')
      await authService.logout(refreshToken)
    } finally {
      setLoading(false)
    }
  }

  const items: MenuProps['items'] = routes
    .filter((item) => item.roles.some((self) => currentUser.roles.includes(self)))
    .map((route) => {
      if (route.isGroup) {
        return getItem(SideItem(route), route.key, null, 'group')
      } else {
        return getItem(SideItem(route), route.key, SideIcon(route.icon))
      }
    })

  const handleClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key)
    setOpenDrawer(!openDrawer)
  }

  return (
    <Layout className='w-full bg-background' hasSider>
      <Drawer
        title={false}
        placement='left'
        closable={true}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        width={250}
        className='m-0 p-0'
      >
        <Layout>
          <SiDer trigger={null}>
            <Flex vertical gap={20} className='bg-white'>
              <Flex align='center' justify='center'>
                <img src={logo} alt='logo' className='h-16 w-16 object-contain' />
              </Flex>
              <Menu
                onClick={handleClick}
                selectedKeys={[selectedKey]}
                defaultSelectedKeys={[selectedKey]}
                mode='inline'
                items={items}
              />
            </Flex>
          </SiDer>
        </Layout>
      </Drawer>
      <Layout>
        <Header onMenuClick={() => setOpenDrawer(!openDrawer)} />
        <Content className='min-h-screen bg-background md:p-5'>{!loading && <Outlet />}</Content>
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
