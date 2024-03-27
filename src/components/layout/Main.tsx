import { Drawer, Layout } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import SideNav from './sidenav/SideNav'

const { Sider, Content } = Layout

const Main: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false)

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
        <Header
          onMenuClick={() => {
            setOpenDrawer(!openDrawer)
          }}
        />
        <Content className='min-h-screen bg-background p-5'>
          <Outlet />
        </Content>
        <Footer className=''>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

export default Main
