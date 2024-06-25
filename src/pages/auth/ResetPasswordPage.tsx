import { App as AntApp, Button, Flex, Form } from 'antd'
import { InputOTP } from 'antd-input-otp'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import UserAPI from '~/api/services/UserAPI'
import useTitle from '~/components/hooks/useTitle'
import AuthLayout from '~/components/layout/AuthLayout'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import useAPIService from '~/hooks/useAPIService'
import useAuthService from '~/hooks/useAuthService'
import { setUser } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { User } from '~/typing'

const ResetPasswordPage = () => {
  useTitle('Reset Password')
  // const [emailStored, setEmailStored] = useLocalStorage('email-stored', '')
  // const [otpVerified, setOtpVerified] = useLocalStorage('otp-stored', '')
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<'verify_email' | 'verify_otp' | 'reset_password'>('verify_email')
  const authService = useAuthService(AuthAPI)
  const userService = useAPIService<User>(UserAPI)
  // // const [password, setPassword] = useState<string>('')
  // // const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user)

  // useEffect(() => {
  //   if (!emailStored && !otpVerified) navigate('/')
  // }, [emailStored, otpVerified])

  const handleVerifyEmail = async (user: { email: string }) => {
    try {
      await authService.verifyEmailAndSendOTP(user.email, setLoading).then((result) => {
        const data = result.data
        dispatch(setUser(data.user))
        message.success(`The OTP code has been sent to your mailbox!`)
        setState('verify_otp')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (user: { password: string; passwordConfirm: string }) => {
    try {
      setLoading(true)
      if (currentUser.user) {
        await userService.updateItemByPk(currentUser.user.id!, { password: user.password }).then((result) => {
          if (!result?.success) throw new Error(`${result?.message}`)
          dispatch(setUser(result.data as User))
        })
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (user: { otp: string }) => {
    try {
      if (currentUser.user) {
        await authService.verifyOTPCode(currentUser.user.email!, user.otp).then((result) => {
          if (!result?.success) throw new Error(`${result?.message}`)
          dispatch(setUser(result.data as User))
        })
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onValueChange = (values: string[]) => {
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] === '') {
        values.splice(i, 1)
      }
    }
    // setOtpValues(value)
    console.log(values)
  }

  return (
    <>
      <AuthLayout title='Reset Password' subTitle='Please fill in your account information!'>
        <Form
          form={form}
          layout='horizontal'
          name='basic'
          labelCol={{ flex: '120px' }}
          labelAlign='left'
          labelWrap
          onFinish={(user) =>
            state === 'verify_email'
              ? handleVerifyEmail(user)
              : state === 'verify_otp'
                ? handleVerifyOTP(user)
                : handleResetPassword(user)
          }
          className='w-full'
          autoComplete='off'
        >
          <Flex className='w-full' vertical gap={20}>
            {state === 'reset_password' && (
              <EditableFormCell
                isEditing
                placeholder='Enter password'
                title='Password'
                dataIndex='password'
                required
                inputType='password'
                subtitle='Please enter your password!'
              />
            )}

            {state === 'reset_password' && (
              <EditableFormCell
                isEditing
                placeholder='Enter confirm password'
                title='Confirm password'
                dataIndex='passwordConfirm'
                required
                inputType='password'
                subtitle='Please confirm your password!'
              />
            )}

            {state === 'verify_email' && (
              <EditableFormCell
                isEditing
                placeholder='Enter your email'
                title='Email'
                dataIndex='email'
                required
                inputType='email'
                subtitle='Please confirm your email!'
              />
            )}

            {state === 'verify_otp' && (
              <InputOTP
                inputType='numeric'
                // Regex below is for all input except numeric
                onChange={onValueChange}
                // value={otpValues}
                inputClassName='rounded-lg'
              />
            )}

            <Form.Item className='w-full'>
              <Button htmlType='submit' className='w-full' type='primary' loading={loading}>
                {state === 'verify_email' || state === 'verify_otp' ? 'Submit' : 'Change password'}
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
      </AuthLayout>
    </>
  )
}

export default ResetPasswordPage
