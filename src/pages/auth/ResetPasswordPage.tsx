import { App as AntApp, Button, Flex, Form } from 'antd'
import { InputOTP } from 'antd-input-otp'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthAPI from '~/api/services/AuthAPI'
import useTitle from '~/components/hooks/useTitle'
import AuthLayout from '~/components/layout/AuthLayout'
import EditableFormCell from '~/components/sky-ui/SkyTable/EditableFormCell'
import define from '~/constants'
import useAuthService from '~/hooks/useAuthService'
import useLocalStorage from '~/hooks/useLocalStorage'
import { setUser } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { User } from '~/typing'

const ResetPasswordPage = () => {
  useTitle('Reset Password | Phung Nguyen')
  const [userStored, setUserStored] = useLocalStorage('userTemp', {
    email: '',
    accessKey: ''
  })
  const [otp, setOtp] = useState<string>('')
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<'verify_email' | 'verify_otp' | 'reset_password'>('verify_email')
  const authService = useAuthService(AuthAPI)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user)

  const handleVerifyEmail = async (user: { email: string }) => {
    try {
      await authService.verifyEmailAndSendOTP(user.email, setLoading).then((result) => {
        if (!result.success) throw new Error(define('error_verify_email'))
        const resultUser = result.data as User
        setUserStored({ email: resultUser.email!, accessKey: '' })
        message.success(`The OTP code has been sent to your mailbox!`)
        setState('verify_otp')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (user: { otp: string[] }) => {
    try {
      await authService.verifyOTPCode(userStored.email, user.otp.join(''), setLoading).then((result) => {
        if (!result.success) throw new Error(define('error_verify_otp'))
        const userResult = result.data as User
        dispatch(setUser(userResult))
        setUserStored({ email: userResult.email!, accessKey: userResult.accessKey! })
        setState('reset_password')
      })
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (user: { password: string; passwordConfirm: string }) => {
    if (user.password !== user.passwordConfirm) {
      message.error(define('password_not_match'))
    } else {
      try {
        if (currentUser.user) {
          await authService
            .resetPasswordWithAccesskey(
              userStored.email,
              { newPassword: user.password, accessKey: userStored.accessKey },
              setLoading
            )
            .then((result) => {
              if (!result.success) throw new Error(`${result.message}`)
              dispatch(setUser({}))
              message.success(define('password_reset_successful'))
              navigate('/login')
            })
            .finally(() => {
              localStorage.removeItem('userTemp')
            })
        }
      } catch (error: any) {
        message.error(`${error.message}`)
      } finally {
        setLoading(false)
      }
    }
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
              />
            )}

            {state === 'verify_otp' && (
              <Form.Item name='otp'>
                <InputOTP
                  inputType='numeric'
                  onChange={(values) => setOtp(values.join(''))}
                  inputClassName='rounded-lg'
                />
              </Form.Item>
            )}

            <Form.Item className='w-full'>
              <Button
                htmlType='submit'
                className='w-full'
                type='primary'
                loading={loading}
                disabled={state === 'verify_otp' && otp.length !== 6}
              >
                {state === 'verify_email' || state === 'verify_otp' ? 'Submit' : 'Change password'}
              </Button>
            </Form.Item>

            <Flex className='w-full' align='center' justify='space-evenly'>
              <Button
                onClick={() => {
                  navigate('/login')
                }}
                type='link'
              >
                <Flex gap={4}>
                  {/* <ChevronLeft /> */}
                  Back to Login?
                </Flex>
              </Button>
              {/* {emailStored.length > 0 && state === 'verify_otp' && (
                <Button onClick={handleResendOTPCode} type='link' disabled={!isActiveResendOTP}>
                  Resent OTP code?
                </Button>
              )} */}
            </Flex>
          </Flex>
        </Form>
      </AuthLayout>
    </>
  )
}

export default ResetPasswordPage
