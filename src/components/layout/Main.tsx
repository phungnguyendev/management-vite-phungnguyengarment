import { App as AntApp, Drawer, Layout } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import useAuthService from '~/hooks/useAuthService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUser, setUserRole } from '~/store/actions-creator'
import { User, UserRole, UserRoleType } from '~/typing'
import Footer from './Footer'
import Header from './Header'
import SideNav from './sidenav/SideNav'

const { Sider, Content } = Layout

const Main: React.FC<HTMLAttributes<HTMLElement>> = () => {
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
          <Sider trigger={null}>
            <SideNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
          </Sider>
        </Layout>
      </Drawer>
      <Layout>
        <Header onMenuClick={() => setOpenDrawer(!openDrawer)} />
        <Content className='min-h-screen bg-background p-5'>{!loading && <Outlet />}</Content>
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
