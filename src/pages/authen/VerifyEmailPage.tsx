import { App, Button, Flex, Form, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseDataType } from '~/api/client'
import AuthAPI from '~/api/services/AuthAPI'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import useLocalStorage from '~/hooks/useLocalStorage'

const VerifyEmailPage = () => {
  const [emailStored, setEmailStored] = useLocalStorage('email-stored', '')
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const navigate = useNavigate()
  useTitle('Verify Email')

  useEffect(() => {
    if (emailStored) navigate('/verify-otp')
  }, [emailStored])

  const finishHandler = async (user: { email: string }) => {
    try {
      setLoading(true)
      if (user.email) {
        await AuthAPI.sendEmail(user.email)
          .then((meta) => {
            setEmailStored(user.email)
            if (!meta?.success) throw new Error(`${meta?.message}`)
            console.log(meta)
            message.success(`OTP Send!`)
            navigate('/verify-otp')
          })
          .catch((err: any) => {
            throw err
          })
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
  }

  const finishFailedHandler = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Flex className='relative bg-background' align='center' justify='center'>
      <Flex
        vertical
        gap={30}
        align='center'
        className='fixed top-1/2 h-fit w-fit -translate-y-1/2 rounded-lg bg-white p-10 shadow-lg sm:w-[400px]'
      >
        <img src={logo} alt='logo' className='h-24 w-24 object-contain' />
        <Flex vertical align='center'>
          <Typography.Title level={2}>Verify Email</Typography.Title>
          <Typography.Text className='text-center' type='secondary'>
            Please enter your email address so we can verify it
          </Typography.Text>
        </Flex>

        <Form
          form={form}
          layout='horizontal'
          name='basic'
          labelCol={{ flex: '100px', span: 4 }}
          labelAlign='left'
          labelWrap
          onFinish={finishHandler}
          className='w-full'
          onFinishFailed={finishFailedHandler}
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={20}>
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
            <Form.Item className='w-full'>
              <Button htmlType='submit' className='w-full' type='primary' loading={loading}>
                Send OTP
              </Button>
            </Form.Item>

            <Flex className='w-full' align='center' justify='center'>
              <Button
                onClick={() => {
                  navigate('/login')
                }}
                type='link'
              >
                Back to login ?
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  )
}

export default VerifyEmailPage
