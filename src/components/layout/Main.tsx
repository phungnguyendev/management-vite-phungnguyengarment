import { App as AntApp, Drawer, Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import RoleAPI from '~/api/services/RoleAPI'
import useAPIService from '~/hooks/useAPIService'
import useAuthService from '~/hooks/useAuthService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUser, setUserRole } from '~/store/actions-creator'
import { Role, User, UserRole } from '~/typing'
import Footer from './Footer'
import Header from './Header'
import SideNav from './sidenav/SideNav'

const { Sider, Content } = Layout

const Main: React.FC = () => {
  const { message } = AntApp.useApp()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [accessToken] = useLocalStorage<string>('accessToken', '')
  const [refreshToken] = useLocalStorage<string>('refreshToken', '')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authService = useAuthService(AuthAPI)
  const roleService = useAPIService(RoleAPI)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    // Gọi thông tin người dùng từ accessToken và lưu nó vào redux
    try {
      if (accessToken) {
        const result = await authService.userInfoFromAccessToken(accessToken)
        const user = result.data.user as User
        const userRoles = result.data.userRoles as UserRole[]
        await roleService
          .getItems({
            filter: {
              field: 'id',
              items: userRoles.map((item) => {
                return item.id!
              }),
              status: 'active'
            }
          })
          .then((result) => {
            if (result) {
              // console.log(result)
              const roles = result.data as Role[]
              dispatch(
                setUserRole(
                  roles.map((item) => {
                    return item.role!
                  })
                )
              )
            }
          })
        dispatch(setUser(user))
      } else {
        navigate('/login')
      }
    } catch (error: any) {
      await authService.logout(refreshToken).then(() => {
        navigate('/login')
        message.error(`${error.message ?? 'Login session has expired, please log in again!'}`)
      })
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
      {/* <Sider
        breakpoint='lg'
        collapsedWidth={0}
        collapsible
        trigger={null}
        width={100}
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          bottom: '0px',
          overflow: 'auto',
          height: '100vh'
        }}
      >
        <SideNav />
      </Sider> */}
      <Layout>
        <Header onMenuClick={() => setOpenDrawer(!openDrawer)} />
        <Content className='min-h-screen bg-background p-5'>
          <Outlet />
        </Content>
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
