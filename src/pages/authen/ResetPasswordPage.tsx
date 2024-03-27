import { App as AntApp, Button, Flex, Form, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseDataType } from '~/api/client'
import UserAPI from '~/api/services/UserAPI'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useLocalStorage from '~/hooks/useLocalStorage'

const ResetPasswordPage = () => {
  const [emailStored, setEmailStored] = useLocalStorage('email-stored', '')
  const [otpVerified, setOtpVerified] = useLocalStorage('otp-stored', '')
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  // const [password, setPassword] = useState<string>('')
  // const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const navigate = useNavigate()
  useTitle('Reset password')

  useEffect(() => {
    if (!emailStored && !otpVerified) navigate('/')
  }, [emailStored, otpVerified])

  const finishHandler = async (user: { password: string; passwordConfirm: string }) => {
    try {
      setLoading(true)
      if (!emailStored) throw new Error(`Error`)
      if (user.password !== user.passwordConfirm) throw new Error(`Password and confirm password are not the same!`)
      await UserAPI.updateItemBy({ field: 'email', key: emailStored }, { password: user.password }).then((meta) => {
        if (!meta?.success) throw new Error(`${meta?.message}`)
        setEmailStored(null)
        setOtpVerified(null)
        navigate('/login')
        message.success(`Success`)
      })
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
          <Typography.Title level={2}>Reset Password</Typography.Title>
          <Typography.Text className='text-center' type='secondary'>
            Please create a new password and write it down to avoid forgetting it
          </Typography.Text>
        </Flex>

        <Form
          form={form}
          layout='horizontal'
          name='basic'
          labelCol={{ flex: '120px' }}
          labelAlign='left'
          labelWrap
          onFinish={finishHandler}
          className='w-full'
          onFinishFailed={finishFailedHandler}
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={20}>
            {/* <Form.Item
              label='Password'
              name='password'
              className='m-0 w-full p-0'
              rules={[{ required: true, message: 'Please enter your password!', validateTrigger: 'onBlur' }]}
            >
              <Input
                placeholder='Enter password'
                className='w-full'
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                allowClear
              />
            </Form.Item> */}
            <EditableFormCell
              isEditing
              placeholder='Enter password'
              title='Password'
              dataIndex='password'
              required
              inputType='password'
              subtitle='Please enter your password!'
              // inputProps={{
              //   value: password,
              //   onChange: (e) => setPassword(e.target.value)
              // }}
            />

            <EditableFormCell
              isEditing
              placeholder='Enter confirm password'
              title='Confirm password'
              dataIndex='passwordConfirm'
              required
              inputType='password'
              subtitle='Please confirm your password!'
              // inputProps={{
              //   value: passwordConfirm,
              //   onChange: (e) => setPasswordConfirm(e.target.value)
              // }}
            />
            {/* <Form.Item
              label='Confirm password'
              name='password-confirm'
              className='m-0 w-full p-0'
              rules={[{ required: true, message: 'Please confirm your password!', validateTrigger: 'onBlur' }]}
            >
              <Input
                placeholder='Enter password'
                className='w-full'
                type='password'
                onChange={(e) => setPasswordConfirm(e.target.value)}
                value={passwordConfirm}
                allowClear
              />
            </Form.Item> */}
            <Form.Item className='w-full'>
              <Button htmlType='submit' className='w-full' type='primary' loading={loading}>
                Change password
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

export default ResetPasswordPage
