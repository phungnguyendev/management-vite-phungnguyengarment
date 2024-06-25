import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { App as AntApp, Button, Flex, Form, Input } from 'antd'
import React, { HTMLAttributes, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import useTitle from '~/components/hooks/useTitle'
import AuthLayout from '~/components/layout/AuthLayout'
import useAuthService from '~/hooks/useAuthService'

interface Props extends HTMLAttributes<HTMLElement> {}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginPage: React.FC<Props> = () => {
  useTitle('Login')
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const authService = useAuthService(AuthAPI)
  const [user, setUser] = useState<{ email?: string; password?: string }>({})
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout)
  }

  const handleFinish = async (user: { email: string; password: string }) => {
    try {
      setLoading(true)
      // Create a new request to login user
      await authService.login(user.email, user.password, setLoading).then(() => {
        message.success('Success!')
        navigate('/')
      })
    } catch (error: any) {
      message.error(`${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFinishFailure = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const formItemLayout =
    formLayout === 'vertical'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 }
        }
      : null

  const buttonItemLayout =
    formLayout === 'vertical'
      ? {
          wrapperCol: { span: 14, offset: 4 }
        }
      : null

  const forgerPasswordHandler = () => {
    navigate('/reset-password')
  }

  return (
    <>
      <AuthLayout title='Welcome to PHUNG NGUYEN' subTitle='Please login to your account!'>
        <Form
          form={form}
          {...formItemLayout}
          layout={formLayout}
          name='basic'
          labelCol={{ flex: '100px' }}
          labelAlign='left'
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
          onFinish={handleFinish}
          className='w-full'
          onFinishFailed={handleFinishFailure}
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={40}>
            <Flex className='w-full' vertical gap={16}>
              <Form.Item
                label='Email'
                name='email'
                className='m-0 w-full p-0'
                initialValue='soyoong.dev@gmail.com'
                rules={[
                  { required: true, message: 'Please input your email!', validateTrigger: 'onBlur', type: 'email' }
                ]}
              >
                <Input
                  placeholder='Email'
                  className='w-full'
                  type='email'
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  value={user.email}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                className='m-0 w-full p-0'
                initialValue='Soyoongdev@2704'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  placeholder='Password'
                  className='w-full'
                  type='password'
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  value={user.password}
                  allowClear
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Flex>

            <Form.Item {...buttonItemLayout} className='w-full'>
              <Button htmlType='submit' className='w-full' type='primary' loading={loading}>
                Login
              </Button>
            </Form.Item>

            <Flex className='w-full' justify='center' align='end'>
              <Button className='w-fit' onClick={forgerPasswordHandler} type='link'>
                Forget password?
              </Button>
            </Flex>
          </Flex>
        </Form>
      </AuthLayout>
    </>
  )
}

export default LoginPage
