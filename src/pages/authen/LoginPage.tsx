import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { App as AntApp, Button, Flex, Form, Input, Typography } from 'antd'
import React, { HTMLAttributes, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseDataType } from '~/api/client'
import AuthAPI from '~/api/services/AuthAPI'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import useLocalStorage from '~/hooks/useLocalStorage'
import { User } from '~/typing'

interface Props extends HTMLAttributes<HTMLElement> {}

type LayoutType = Parameters<typeof Form>[0]['layout']

const LoginPage: React.FC<Props> = ({ ...props }) => {
  const [form] = Form.useForm()
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [accessTokenStored, setAccessTokenStored] = useLocalStorage('accessToken', '')
  const [emailStored, setEmailStored] = useLocalStorage('email-stored', '')
  const [otpStored, setOtpStored] = useLocalStorage('otp-stored', '')
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')
  useTitle('Đăng nhập')

  useEffect(() => {
    if (emailStored || otpStored) {
      setEmailStored(null)
      setOtpStored(null)
    }
  }, [emailStored, otpStored])

  useEffect(() => {
    if (accessTokenStored && accessTokenStored.length !== 0) {
      navigate('/')
    }
  }, [accessTokenStored])

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout)
  }

  const onFinish = async (user: { email: string; password: string }) => {
    try {
      setLoading(true)
      // Create a new request to login user
      await AuthAPI.login(user).then((meta) => {
        if (!meta?.success) throw new Error(meta?.message)
        const userLogged = meta.data as User
        if (userLogged) {
          // Save to local storage
          setAccessTokenStored(userLogged.accessToken)
        }
        // Send message app
        message.success('Success!')
        // Navigation to '/' (Dashboard page) if login success
        navigate('/')
      })
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
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
    navigate('/verify-email')
  }

  return (
    <Flex {...props} className='relative bg-background' align='center' justify='center'>
      <Flex
        vertical
        gap={30}
        align='center'
        className='fixed top-1/2 h-fit w-fit -translate-y-1/2 rounded-lg bg-white p-10 shadow-lg sm:w-[400px]'
      >
        <Flex vertical align='center' className='relative h-fit w-full' justify='center'>
          <img src={logo} alt='logo' className='h-24 w-24 object-contain' />
          <Flex vertical align='center'>
            <Typography.Title className='text-center' level={3}>
              Welcome to PHUNG NGUYEN
            </Typography.Title>
            <Typography.Text type='secondary'>Please login to your account</Typography.Text>
          </Flex>
        </Flex>

        <Form
          form={form}
          {...formItemLayout}
          layout={formLayout}
          name='basic'
          labelCol={{ flex: '100px' }}
          labelAlign='left'
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
          onFinish={onFinish}
          className='w-full'
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={20}>
            <Flex className='w-full' vertical gap={16}>
              <Form.Item
                label='Email'
                name='email'
                className='m-0 w-full p-0'
                rules={[
                  { required: true, message: 'Please input your email!', validateTrigger: 'onBlur', type: 'email' }
                ]}
              >
                <Input
                  placeholder='Email'
                  className='w-full'
                  type='email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                className='m-0 w-full p-0'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  placeholder='Password'
                  className='w-full'
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
              <Button className='w-fit' onClick={forgerPasswordHandler} type='link' loading={loading}>
                Forget password?
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  )
}

export default LoginPage
