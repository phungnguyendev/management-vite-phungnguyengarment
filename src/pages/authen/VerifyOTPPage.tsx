import { App as AntApp, Button, Flex, Typography } from 'antd'
import { InputOTP } from 'antd-input-otp'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponseDataType } from '~/api/client'
import AuthAPI from '~/api/services/AuthAPI'
import logo from '~/assets/logo.svg'
import useTitle from '~/components/hooks/useTitle'
import useCountdownTimer from '~/hooks/useCountdownTimer'
import useLocalStorage from '~/hooks/useLocalStorage'

const VerifyOTPPage = () => {
  const { message } = AntApp.useApp()
  const [emailStored] = useLocalStorage('email-stored', '')
  const [, setOtpVerified] = useLocalStorage('otp-stored', '')
  const [loading, setLoading] = useState<boolean>(false)
  const [resetLoading, setResetLoading] = useState<boolean>(false)
  const [otpValues, setOtpValues] = useState<string[]>([])
  const navigate = useNavigate()
  const [timer, setTimer] = useCountdownTimer(30)
  useTitle('Verify OTP')

  useEffect(() => {
    if (!emailStored) navigate('/login')
  }, [emailStored])

  const handleSubmit = async (otp: string) => {
    try {
      setLoading(true)
      if (emailStored) {
        await AuthAPI.verifyOTP({ email: emailStored, otp: otp })
          .then((meta) => {
            if (!meta?.success) throw new Error(`${meta?.message}`)
            setOtpVerified(otp)
            navigate('/reset-password')
          })
          .catch((err) => {
            throw Error(`${err.message}`)
          })
      }
    } catch (error: any) {
      const resError: ResponseDataType = error.data
      message.error(`${resError.message}`)
    } finally {
      setLoading(false)
    }
    // console.log(parseInt(otpValues.join('')))
  }

  const onValueChange = (value: string[]) => {
    for (let i = value.length - 1; i >= 0; i--) {
      if (value[i] === '') {
        value.splice(i, 1)
      }
    }
    setOtpValues(value)
  }

  const handleResendOTP = async () => {
    try {
      setResetLoading(true)
      if (emailStored) {
        await AuthAPI.sendEmail(emailStored)
          .then((meta) => {
            if (!meta?.success) throw new Error(`${meta?.message}`)
            message.success(`OTP Send!`)
            setTimer(30)
          })
          .catch((err) => {
            message.error(`${err.message}`)
          })
      }
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Flex className='relative bg-background' align='center' justify='center'>
      <Flex
        vertical
        gap={50}
        align='center'
        className='fixed top-1/2 h-fit w-fit -translate-y-1/2 rounded-lg bg-white p-10 shadow-lg sm:w-[400px]'
      >
        <img src={logo} alt='logo' className='h-24 w-24 object-contain' />
        <Flex vertical align='center'>
          <Typography.Title level={2}>Verify OTP</Typography.Title>
          <Typography.Text className='text-center' type='secondary'>
            Please enter the OTP code we just sent to your email inbox
          </Typography.Text>
        </Flex>

        <InputOTP
          inputType='numeric'
          // Regex below is for all input except numeric
          onChange={onValueChange}
          value={otpValues}
          inputClassName='rounded-lg'
        />
        <Button
          disabled={otpValues.length < 6 || otpValues.length > 6}
          loading={loading}
          block
          type='primary'
          onClick={() => handleSubmit(otpValues.join(''))}
        >
          Verify
        </Button>

        <Flex className='w-full' align='center' justify='center'>
          {timer !== 0 ? (
            <Typography.Text type='success'>{timer}</Typography.Text>
          ) : (
            <Button loading={resetLoading} type='link' onClick={handleResendOTP}>
              Resend OTP
            </Button>
          )}
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
    </Flex>
  )
}

export default VerifyOTPPage
